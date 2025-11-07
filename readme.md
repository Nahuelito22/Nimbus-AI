---
title: Nimbus AI - Predictor de Granizo
emoji: ⛈️
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
---
# Nimbus AI 🌩️

![Estado](https://img.shields.io/badge/estado-Desplegado-success)
![Versión](https://img.shields.io/badge/modelo-V3.1%20Multimodal-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

**Nimbus AI** es un sistema de alerta temprana de granizo para la región de Mendoza, Argentina, basado en un modelo de machine learning multimodal. Su objetivo es predecir la probabilidad de granizo combinando datos meteorológicos y análisis de imágenes satelitales para la prevención de daños agrícolas y materiales.

---

## 📜 Tabla de Contenidos

1.  [El Problema](#-el-problema)
2.  [La Solución](#-la-solución)
3.  [Demostraciones Visuales](#-demostraciones-visuales)
4.  [Aplicación Web](#-aplicación-web)
5.  [Modelo de IA y API](#-modelo-de-ia-y-api)
6.  [Dataset](#-dataset)
7.  [Documentación Detallada](#-documentación-detallada)
8.  [Stack Tecnológico](#️-stack-tecnológico)
9.  [Guía de Inicio Rápido](#-guía-de-inicio-rápido-getting-started)
10. [Contribuciones](#-contribuciones)
11. [Agradecimientos](#-agradecimientos)
12. [Licencia](#-licencia)

---

## 🎯 El Problema

El granizo representa una amenaza significativa en regiones agrícolas como Mendoza, causando anualmente pérdidas millonarias en cultivos, así como daños a propiedades y vehículos. Los sistemas de alerta tradicionales a menudo carecen de la especificidad y anticipación necesarias para una prevención eficaz.

## ✨ La Solución

Nimbus AI ofrece una solución proactiva y focalizada:

*   **Modelo Multimodal:** Fusiona datos numéricos (temperatura, humedad, viento) con datos visuales (imágenes satelitales del satélite GOES-16) para una predicción más robusta y precisa.
*   **Salida Probabilística:** Entrega una probabilidad de granizo, permitiendo a los usuarios tomar decisiones informadas basadas en su propio umbral de riesgo.
*   **Plataforma Centralizada:** Provee una interfaz web con dashboards especializados para diferentes roles (Administrador, Defensa Civil, Meteorólogo, Científico de Datos y Usuario General).

---

## 🖼️ Demostraciones Visuales

*Arquitectura del sistema.*

`
![Arquitectura del sistema](imagenes_github\diagrama_estructura.png)
`

*Login.*

`
![Login Nimbus](imagenes_github\app_funcional.png)
`

---

## 🔗 Aplicación Web

*   **Acceso a la plataforma:** [https://nimbus-ai-mdz.vercel.app/](https://nimbus-ai-mdz.vercel.app/)

---

## 🤖 Modelo de IA y API

### Rendimiento del Modelo (V3.1)

| Métrica                 | Valor    | Descripción                                                                                   |
| :---------------------- | :------: | :-------------------------------------------------------------------------------------------- |
| **Recall (Sensibilidad)** | **100%** | El modelo fue capaz de identificar **todos** los eventos de granizo reales en el set de prueba.     |
| **Precisión**             | **~14%** | De todas las alertas generadas, el 14% fueron correctas, minimizando las falsas alarmas.        |
| **F1-Score**              | **~0.24**| Un balance saludable entre Precisión y Recall para un problema altamente desbalanceado.        |

### Interpretación de Métricas

Dado que los eventos de granizo son **raros**, el modelo fue optimizado intencionalmente para **no omitir ningún evento real** (logrando un Recall del 100%). Esto significa:

*   ✅ **Se detectan todos los granizos que ocurren**, lo cual es crítico para la prevención.
*   ⚠️ Se generan algunas falsas alarmas (Precisión del 14%). En la práctica, **de cada 7 alertas, 1 corresponderá a un evento de granizo real**.

Este balance es preferible a no alertar sobre un evento de granizo que sí ocurre.

### Reproducibilidad de Métricas

Las métricas fueron calculadas sobre un conjunto de prueba que corresponde al **20%** del dataset final, utilizando una división estratificada para mantener la proporción de clases. El 80% restante se utilizó para el entrenamiento del modelo.

### API Desplegada

El modelo está desplegado y accesible a través de los siguientes endpoints en Hugging Face:

*   **Documentación Interactiva (Swagger):** [https://nahuelito22-nimbus-ai.hf.space/api/docs](https://nahuelito22-nimbus-ai.hf.space/api/docs)
*   **Health Check:** [https://nahuelito22-nimbus-ai.hf.space/api/health](https://nahuelito22-nimbus-ai.hf.space/api/health)

### Ejemplos de Uso

**`curl`**
```bash
curl -X POST "https://nahuelito22-nimbus-ai.hf.space/api/predict" \
     -H "Content-Type: application/json" \
     -d '{
           "meteorological_data": {
             "temperature": 25.5, "humidity": 65, "wind_speed": 12.3, "pressure": 1013.2
           },
           "satellite_image_url": "https://example.com/satellite_image.jpg"
         }'
```

**`Python (requests)`**
```python
import requests
import json

api_url = "https://nahuelito22-nimbus-ai.hf.space/api/predict"

payload = {
    "meteorological_data": {
        "temperature": 25.5,
        "humidity": 65,
        "wind_speed": 12.3,
        "pressure": 1013.2
    },
    "satellite_image_url": "https://example.com/satellite_image.jpg"
}

response = requests.post(api_url, data=json.dumps(payload), headers={"Content-Type": "application/json"})

print(response.json())
```

### Ejemplo de Respuesta de la API

```json
{
  "prediction": {
    "probability": 0.87,
    "label": "Granizo Probable"
  },
  "model_version": "v3.1"
}
```

---

## 💾 Dataset

La construcción del dataset fue un proceso iterativo y de enriquecimiento progresivo:

1.  **Línea Base (NOAA):** Se partió de un dataset con registros climáticos de Mendoza desde 1970 hasta 2024, provisto por la NOAA.
2.  **Enriquecimiento de Features (Open-Meteo):** Para mejorar la granularidad, se añadieron más variables climáticas utilizando la API de Open-Meteo, acotando el período de 2000 a 2024.
3.  **Etiquetado de Eventos (Web Scraping):** El desafío principal fue obtener etiquetas precisas de eventos de granizo. Se realizó web scraping sobre el portal `TuTiempo.net` y se complementó con una exhaustiva verificación manual de noticias y registros históricos entre 2000 y 2024. El resultado fue el archivo `dataset_final_enriquecido.csv`.
4.  **Incorporación de Imágenes Satelitales (GOES-16):** Para el modelo multimodal (v3.0), se recolectaron imágenes del satélite GOES-16 para cada fecha etiquetada como "evento" y "no evento" a partir de 2017 (año de despliegue del satélite).

Este dataset multimodal fue el utilizado para entrenar el modelo final v3.1, optimizado con Keras Tuner.

---

## 📚 Documentación Detallada

Para una exploración más profunda de la arquitectura, el análisis exploratorio de datos (EDA), el entrenamiento del modelo y las decisiones de diseño, puedes consultar la documentación completa en Deepwiki:

*   **Wiki del Proyecto:** [https://deepwiki.com/Nahuelito22/Nimbus-AI](https://deepwiki.com/Nahuelito22/Nimbus-AI)

---

## 🛠️ Stack Tecnológico

*   **Backend:** Python, FastAPI, SQLAlchemy
*   **Frontend:** React.js, Vite, Tailwind CSS
*   **Data Science:** TensorFlow/Keras, Pandas, Scikit-learn, Xarray
*   **Base de Datos:** PostgreSQL
*   **Despliegue:** Render (Backend), Vercel (Frontend), Docker (Modelo IA)

---

## 🏁 Guía de Inicio Rápido (Getting Started)

Sigue estos pasos para levantar el proyecto en un entorno local.

### Prerrequisitos

*   Python 3.9+ y `pip`
*   Node.js 18+ y `npm`
*   Git

### 1. Configuración del Backend

```bash
# Clona, crea entorno virtual e instala dependencias
git clone https://github.com/tu-usuario/Nimbus_AI.git
cd Nimbus_AI
python -m venv venv
source venv/bin/activate  # En Windows: venv\\Scripts\\activate
pip install -r requirements.txt

# Configura y corre el servidor
cp .env.example .env # Ajusta tus variables en .env
uvicorn src.app:app --reload
```

### 2. Configuración del Frontend

```bash
# En otra terminal, navega al frontend, instala y corre
cd frontend
npm install
npm run dev
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto, por favor, abre un *issue* para discutir los cambios o envía un *pull request*.

---

## 🙏 Agradecimientos

*   A la **NOAA** por proveer los datos climáticos históricos.
*   A **Open-Meteo** por su increíble API de datos meteorológicos.
*   A la comunidad de código abierto por las herramientas que hicieron posible este proyecto.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👥 Equipo y Contacto

*   **Nahuel Ghilardi:** Data Science, Backend & Frontend Development
*   **Gustavo Garcia:** MVP Manager, Backend Development & QA

Para reportar un problema o hacer una pregunta, por favor, abre un [issue en GitHub](https://github.com/tu-usuario/Nimbus_AI/issues).
