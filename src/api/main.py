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