# --- 1. Importar las librerías necesarias ---
from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import pickle
import os

# --- 2. Crear la Aplicación FastAPI ---
app = FastAPI(title="API de Predicción de Granizo - Nimbus AI")

# --- 3. Cargar los "Artefactos" del Modelo ---
# Definimos las rutas a nuestros archivos guardados. 
# Estas rutas son relativas a la ubicación del script main.py
MODEL_PATH = os.path.join("..", "..", "models", "multimodal_v3.1_optimizado.keras")
SCALER_PATH = os.path.join("..", "..", "data", "processed", "modelo_multimodal", "sets_finales", "scaler.pkl")

# Cargamos el modelo y el escalador en memoria cuando la API se inicia
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    print("✅ Modelo y escalador cargados exitosamente.")
except Exception as e:
    print(f"❌ Error al cargar los artefactos del modelo: {e}")
    model = None
    scaler = None

# --- 4. Definir un endpoint de "saludo" para probar ---
# Esto nos permite verificar que la API está funcionando.
@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Nimbus AI"}


# --- 5. Definir el "Contrato" de Entrada de Datos ---
# Esta clase le dice a FastAPI qué datos esperamos recibir para hacer una predicción.
class FeaturesInput(BaseModel):
    PRCP: float
    SNWD: float
    TAVG: float
    TMAX: float
    TMIN: float
    om_weather_code: float
    om_rain_sum: float
    om_snowfall_sum: float
    om_precipitation_hours: float
    om_wind_gusts_10m_max: float
    om_wind_direction_10m_dominant: float
    om_shortwave_radiation_sum: float
    om_et0_fao_evapotranspiration: float
    om_dew_point_2m_mean: float
    om_relative_humidity_2m_mean: float
    om_pressure_msl_mean: float
    mes: int
    dia_del_año: int
    rango_temp_diario: float
    latitude: float
    longitude: float

# --- 6. Crear el Endpoint de Predicción ---
# @app.post le dice a FastAPI que este endpoint recibirá datos.
@app.post("/predict")
def predict_hail(input_features: FeaturesInput):
    # Por ahora, solo confirmaremos que recibimos los datos y devolveremos una respuesta de prueba.
    
    print("Datos recibidos en el endpoint /predict:")
    print(input_features.dict())
    
    # En el próximo paso, aquí irá la lógica para procesar los datos,
    # obtener la imagen satelital y llamar al modelo.
    
    # Devolvemos una respuesta de ejemplo
    return {"probabilidad_granizo_estimada": 0.5, "status": "Prueba exitosa"}