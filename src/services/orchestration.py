import requests
from datetime import datetime
import numpy as np
from src.services.meteo import get_weather_by_coords

# =====================================================================================
# URL de la API de predicción en Hugging Face Spaces
HUGGING_FACE_API_URL = "https://nahuelito22-nimbus-ai.hf.space/api/predict"
# =====================================================================================

def _transform_data_for_model(lat, lon, open_meteo_data):
    """
    Transforma la respuesta de Open-Meteo al formato plano que espera el modelo de ML.
    """
    if "error" in open_meteo_data:
        raise ValueError(f"Error en los datos de Open-Meteo: {open_meteo_data['error']}")

    daily = open_meteo_data.get("daily", {})
    hourly = open_meteo_data.get("hourly", {})

    # --- 1. Extraer y calcular promedios de datos horarios ---
    # Usamos np.mean para calcular el promedio, asegurándonos de manejar listas vacías.
    om_dew_point_2m_mean = np.mean(hourly.get("dew_point_2m", [0]))
    om_relative_humidity_2m_mean = np.mean(hourly.get("relative_humidity_2m", [0]))
    om_pressure_msl_mean = np.mean(hourly.get("pressure_msl", [0]))

    # --- 2. Extraer datos diarios (tomando el primer valor de la lista) ---
    # Open-Meteo devuelve listas para los datos diarios, incluso si solo pedimos 1 día.
    tmax = daily.get("temperature_2m_max", [0])[0]
    tmin = daily.get("temperature_2m_min", [0])[0]
    
    # --- 3. Derivar características de fecha ---
    now = datetime.now()
    mes = now.month
    dia_del_año = now.timetuple().tm_yday

    # --- 4. Construir el diccionario final con las 22 características ---
    model_input = {
        "PRCP": daily.get("precipitation_sum", [0])[0],
        "SNWD": daily.get("snowfall_sum", [0])[0],
        "TAVG": (tmax + tmin) / 2,  # Calculado
        "TMAX": tmax,
        "TMIN": tmin,
        "latitude": lat,
        "longitude": lon,
        "om_weather_code": daily.get("weather_code", [0])[0],
        "om_rain_sum": daily.get("rain_sum", [0])[0],
        "om_snowfall_sum": daily.get("snowfall_sum", [0])[0],
        "om_precipitation_hours": daily.get("precipitation_hours", [0])[0],
        "om_wind_gusts_10m_max": daily.get("wind_gusts_10m_max", [0])[0],
        "om_wind_direction_10m_dominant": daily.get("wind_direction_10m_dominant", [0])[0],
        "om_shortwave_radiation_sum": daily.get("shortwave_radiation_sum", [0])[0],
        "om_et0_fao_evapotranspiration": daily.get("et0_fao_evapotranspiration", [0])[0],
        "om_dew_point_2m_mean": om_dew_point_2m_mean, # Promedio
        "om_relative_humidity_2m_mean": om_relative_humidity_2m_mean, # Promedio
        "om_pressure_msl_mean": om_pressure_msl_mean, # Promedio
        "mes": mes, # Derivado
        "dia_del_año": dia_del_año, # Derivado
        "rango_temp_diario": tmax - tmin, # Calculado
    }
    
    return model_input

def get_hail_prediction(lat, lon):
    """
    Función orquestadora principal.
    1. Obtiene datos de Open-Meteo.
    2. Transforma los datos para el modelo.
    3. Llama a la API de predicción en Hugging Face.
    4. Devuelve el resultado.
    """
    # 1. Obtener datos de Open-Meteo
    weather_data = get_weather_by_coords(lat, lon)
    
    # 2. Transformar datos
    try:
        model_input = _transform_data_for_model(lat, lon, weather_data)
    except ValueError as e:
        return {"error": str(e)}

    # 3. Llamar a la API de Hugging Face
    if HUGGING_FACE_API_URL == "URL_DE_TU_API_EN_HUGGING_FACE_AQUI":
        return {"error": "La URL de la API de Hugging Face no ha sido configurada."}

    try:
        response = requests.post(HUGGING_FACE_API_URL, json=model_input, timeout=20)
        response.raise_for_status()  # Lanza un error para respuestas 4xx/5xx
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Error al contactar el modelo de predicción: {e}"}
