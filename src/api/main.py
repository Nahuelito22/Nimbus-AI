# --- 1. Importaciones ---
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import pickle
import os
import pandas as pd
from datetime import datetime, timedelta, timezone
import xarray as xr
import cv2
from pyproj import Proj
import boto3
from botocore import UNSIGNED
from botocore.config import Config

# --- 2. Crear la Aplicación y Cargar Artefactos ---
app = FastAPI(title="API de Predicción de Granizo - Nimbus AI", version="3.1.0")

# Rutas a los artefactos del modelo
MODEL_PATH = os.path.join("..", "..", "models", "multimodal_v3.1_optimizado.keras")
SCALER_PATH = os.path.join("..", "..", "data", "processed", "modelo_multimodal", "sets_finales", "scaler.pkl")
model, scaler = None, None

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    print("✅ Modelo y escalador cargados exitosamente.")
except Exception as e:
    print(f"❌ Error al cargar los artefactos del modelo: {e}")

# --- 3. Definir "Contrato" de Entrada ---
class ForecastInput(BaseModel):
    TMAX: float
    TMIN: float
    PRCP: float
    om_wind_gusts_10m_max: float
    om_dew_point_2m_mean: float
    om_pressure_msl_mean: float
    latitude: float
    longitude: float
    # ... y cualquier otra variable que el back-end obtenga del pronóstico de Open-Meteo

# --- 4. Funciones Auxiliares ---
def procesar_imagen_api(ruta_archivo_nc):
    # ... (esta función es la misma que ya teníamos en la notebook 08) ...
    IMG_SIZE = 64
    ds = xr.open_dataset(ruta_archivo_nc)
    proj_info = ds.goes_imager_projection
    h_sat, lon_cen = proj_info.perspective_point_height, proj_info.longitude_of_projection_origin
    p = Proj(proj='geos', h=h_sat, lon_0=lon_cen)
    x1, y1 = p(-70.5, -37.5); x2, y2 = p(-66.5, -32.0)
    ds['x'] = ds['x'] * h_sat; ds['y'] = ds['y'] * h_sat
    recorte = ds.sel(x=slice(x1, x2), y=slice(y2, y1))['CMI'].values
    recorte_redimensionado = cv2.resize(recorte, (IMG_SIZE, IMG_SIZE))
    recorte_normalizado = (recorte_redimensionado - np.nanmin(recorte_redimensionado)) / (np.nanmax(recorte_redimensionado) - np.nanmin(recorte_redimensionado) + 1e-6)
    return np.nan_to_num(recorte_normalizado)

# --- 5. El Endpoint de Predicción REAL ---
@app.post("/predict")
def predict_hail(forecast_input: ForecastInput):
    if not model or not scaler:
        raise HTTPException(status_code=503, detail="Modelo no está disponible en este momento.")

    # --- A. Preparar Datos Tabulares ---
    df_input = pd.DataFrame([forecast_input.dict()])
    now = datetime.now()
    df_input['date'] = pd.to_datetime(now)
    df_input['mes'] = df_input['date'].dt.month
    df_input['dia_del_año'] = df_input['date'].dt.dayofyear
    df_input['rango_temp_diario'] = df_input['TMAX'] - df_input['TMIN']
    expected_features = scaler.feature_names_in_
    for col in expected_features:
        if col not in df_input.columns:
            df_input[col] = 0.0 # Valor por defecto para columnas no presentes en el input
    df_input = df_input[expected_features]
    X_tabular_scaled = scaler.transform(df_input)

    # --- B. Descargar y Procesar la Imagen Satelital más Reciente ---
    try:
        s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
        now_utc = datetime.now(timezone.utc)
        
        # Buscamos la imagen más reciente (hasta 2 horas de antigüedad)
        key_archivo = None
        for i in range(3): # Revisa la hora actual y las 2 anteriores
            hora_a_buscar = now_utc - timedelta(hours=i)
            prefix = f"ABI-L2-CMIPF/{hora_a_buscar.year}/{hora_a_buscar.timetuple().tm_yday:03d}/{hora_a_buscar.hour:02d}/"
            response = s3.list_objects_v2(Bucket='noaa-goes16', Prefix=prefix)
            if 'Contents' in response:
                for file in reversed(response['Contents']): # Buscamos el más reciente
                    if 'C13' in file['Key']:
                        key_archivo = file['Key']
                        break
            if key_archivo:
                break
        
        if not key_archivo:
            raise HTTPException(status_code=404, detail="No se encontró imagen satelital en las últimas 3 horas.")

        nombre_archivo_temp = "temp_image.nc" # Se guarda en el entorno del servidor
        s3.download_file('noaa-goes16', key_archivo, nombre_archivo_temp)
        
        imagen_procesada = procesar_imagen_api(nombre_archivo_temp)
        X_image_input = np.stack([imagen_procesada] * 5, axis=-1) # Creamos la secuencia
        X_image_input = np.expand_dims(X_image_input, axis=0) # Añadimos dimensión de batch
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener/procesar imagen: {str(e)}")

    # --- C. Hacer la Predicción ---
    try:
        prediccion_prob = model.predict([X_tabular_scaled, X_image_input])[0][0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la predicción del modelo: {str(e)}")

    # --- D. Devolver el Resultado ---
    UMBRAL_OPTIMO = 0.56
    return {
        "probabilidad_granizo": float(prediccion_prob),
        "umbral_aplicado": UMBRAL_OPTIMO,
        "alerta_sugerida": "Sí" if prediccion_prob > UMBRAL_OPTIMO else "No",
        "timestamp_prediccion": now_utc.isoformat(),
        "fuente_imagen": key_archivo
    }