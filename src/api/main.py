# --- 1. Importaciones ---
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import pickle
import os
import pandas as pd
from datetime import datetime
import xarray as xr
import cv2
from pyproj import Proj
import boto3
from botocore import UNSIGNED
from botocore.config import Config

# --- 2. Crear la Aplicación y Cargar Artefactos ---
app = FastAPI(title="API de Predicción de Granizo - Nimbus AI")

MODEL_PATH = os.path.join("..", "..", "models", "multimodal_v3.1_optimizado.keras")
SCALER_PATH = os.path.join("..", "..", "data", "processed", "modelo_multimodal", "sets_finales", "scaler.pkl")

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    print("✅ Modelo y escalador cargados exitosamente.")
except Exception as e:
    print(f"❌ Error al cargar los artefactos del modelo: {e}")
    model = None
    scaler = None

# --- 3. Definir "Contrato" de Entrada ---
class FeaturesInput(BaseModel):
    # ... (la misma clase que ya tenías) ...
    PRCP: float; SNWD: float; TAVG: float; TMAX: float; TMIN: float; om_weather_code: float; om_rain_sum: float; om_snowfall_sum: float; om_precipitation_hours: float; om_wind_gusts_10m_max: float; om_wind_direction_10m_dominant: float; om_shortwave_radiation_sum: float; om_et0_fao_evapotranspiration: float; om_dew_point_2m_mean: float; om_relative_humidity_2m_mean: float; om_pressure_msl_mean: float; mes: int; dia_del_año: int; rango_temp_diario: float; latitude: float; longitude: float

# --- 4. Funciones Auxiliares para Procesar la Imagen ---
def procesar_imagen_api(ruta_archivo_nc):
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
def predict_hail(input_features: FeaturesInput):
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Modelo o escalador no están disponibles.")

    # --- A. Procesar Datos Tabulares ---
    # Convertimos los datos de entrada a un DataFrame
    df_input = pd.DataFrame([input_features.dict()])
    # Escalamos los datos con el MISMO scaler que usamos en el entrenamiento
    X_tabular_scaled = scaler.transform(df_input)

    # --- B. Descargar y Procesar la Imagen Satelital ---
    try:
        now_utc = datetime.utcnow()
        s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
        prefix = f"ABI-L2-CMIPF/{now_utc.year}/{now_utc.dayofyear:03d}/{now_utc.hour:02d}/"
        response = s3.list_objects_v2(Bucket='noaa-goes16', Prefix=prefix)
        
        key_archivo = None
        if 'Contents' in response:
            for file in response['Contents']:
                if 'C13' in file['Key']:
                    key_archivo = file['Key']
                    break
        
        if not key_archivo:
            raise HTTPException(status_code=404, detail="No se encontró imagen satelital reciente.")

        nombre_archivo_temp = "/tmp/temp_image.nc"
        s3.download_file('noaa-goes16', key_archivo, nombre_archivo_temp)
        
        # Procesamos la imagen descargada (solo necesitamos una, no una secuencia)
        imagen_procesada = procesar_imagen_api(nombre_archivo_temp)
        # Creamos una "secuencia" de 5 imágenes idénticas para que coincida con la entrada del modelo
        X_image_input = np.stack([imagen_procesada] * 5, axis=-1)
        # Añadimos una dimensión extra para el "batch"
        X_image_input = np.expand_dims(X_image_input, axis=0)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener o procesar la imagen: {e}")

    # --- C. Hacer la Predicción ---
    try:
        # Le pasamos los dos tipos de datos al modelo
        prediccion_prob = model.predict([X_tabular_scaled, X_image_input])[0][0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error durante la predicción del modelo: {e}")

    # --- D. Devolver el Resultado ---
    return {
        "probabilidad_granizo": float(prediccion_prob),
        "umbral_recomendado": 0.56, # El umbral que encontramos en la notebook 11
        "alerta_sugerida": "Sí" if prediccion_prob > 0.56 else "No"
    }