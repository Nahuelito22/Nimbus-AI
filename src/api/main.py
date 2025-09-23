# --- 1. Importaciones ---
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
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

# --- 3. Definir "Contrato" de Entrada con Valores por Defecto ---
# Usamos Field(default=None) para que los campos sean opcionales.
# Luego los manejaremos en el código.
class ForecastInput(BaseModel):
    TMAX: float | None = None
    TMIN: float | None = None
    PRCP: float | None = None
    om_wind_gusts_10m_max: float | None = None
    om_dew_point_2m_mean: float | None = None
    om_pressure_msl_mean: float | None = None
    latitude: float
    longitude: float

# --- 4. Funciones Auxiliares ---
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

# --- 5. El Endpoint de Predicción Definitivo ---
@app.post("/predict")
def predict_hail(forecast_input: ForecastInput):
    if not model or not scaler:
        raise HTTPException(status_code=503, detail="Modelo no está disponible.")

    try:
        # A. Preparar Datos Tabulares
        df_input = pd.DataFrame([forecast_input.dict()])
        
        # B. Ingeniería de Características
        now = datetime.now()
        df_input['date'] = pd.to_datetime(now)
        df_input['mes'] = df_input['date'].dt.month
        df_input['dia_del_año'] = df_input['date'].dt.dayofyear
        # Rellenamos NaN ANTES de calcular el rango para evitar errores
        df_input['TMAX'] = df_input['TMAX'].fillna(0)
        df_input['TMIN'] = df_input['TMIN'].fillna(0)
        df_input['rango_temp_diario'] = df_input['TMAX'] - df_input['TMIN']
        
        # C. Asegurar que todas las columnas esperadas existan
        expected_features = scaler.feature_names_in_
        for col in expected_features:
            if col not in df_input.columns:
                df_input[col] = 0.0

        # Rellenamos cualquier posible nulo con 0 antes de reordenar y escalar
        df_input = df_input.fillna(0)
        df_input = df_input[expected_features]
        
        X_tabular_scaled = scaler.transform(df_input)

        # D. Lógica de Imagen (con fallback)
        key_archivo_real = None
        now_utc = datetime.now(timezone.utc)
        try:
            s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
            bucket_name = 'noaa-goes19'
            for i in range(4):
                hora_a_buscar = now_utc - timedelta(hours=i)
                prefix = f"ABI-L2-CMIPF/{hora_a_buscar.year}/{hora_a_buscar.timetuple().tm_yday:03d}/{hora_a_buscar.hour:02d}/"
                response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
                if 'Contents' in response:
                    for file in reversed(response['Contents']):
                        if 'C13' in file['Key']:
                            key_archivo_real = file['Key']
                            break
                if key_archivo_real: break
            
            if not key_archivo_real:
                raise FileNotFoundError("No se encontró imagen en tiempo real.")

            nombre_archivo_temp = "temp_image.nc"
            s3.download_file(bucket_name, key_archivo_real, nombre_archivo_temp)
            ruta_imagen_a_procesar = nombre_archivo_temp
        except Exception:
            print("AVISO: Usando imagen de muestra como fallback.")
            ruta_imagen_a_procesar = os.path.join("..", "..", "data", "raw", "imagenes_satelitales_muestra", "2021-02-17_granizo", "2021-02-17_2000_UTC_C13.nc")
            key_archivo_real = "Muestra local"

        imagen_procesada = procesar_imagen_api(ruta_imagen_a_procesar)
        X_image_input = np.stack([imagen_procesada] * 5, axis=-1)
        X_image_input = np.expand_dims(X_image_input, axis=0)

        # E. Hacer la Predicción
        prediccion_prob = model.predict([X_tabular_scaled, X_image_input])[0][0]

        # F. Devolver el Resultado
        UMBRAL_OPTIMO = 0.56
        return {
            "probabilidad_granizo": float(prediccion_prob),
            "umbral_aplicado": UMBRAL_OPTIMO,
            "alerta_sugerida": "Sí" if prediccion_prob > UMBRAL_OPTIMO else "No",
            "timestamp_prediccion_utc": now_utc.isoformat(),
            "fuente_imagen_utilizada": key_archivo_real
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno durante la predicción: {str(e)}")