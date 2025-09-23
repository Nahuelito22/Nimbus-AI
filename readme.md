---
title: Nimbus AI - Predictor de Granizo
emoji: ⛈️
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
---

# Nimbus AI 🌩️

![Estado](https://img.shields.io/badge/estado-Modelo%20V3.1%20Optimizado-brightgreen)

## Descripción del Proyecto

**Nimbus AI** es un sistema de alerta temprana de granizo basado en un modelo de machine learning multimodal. El objetivo es predecir la probabilidad de eventos de granizo combinando datos meteorológicos tabulares con el análisis de imágenes satelitales, proveyendo a los usuarios una herramienta precisa para la prevención de daños.

---

### El Problema

El granizo representa una amenaza significativa en regiones agrícolas como Mendoza, Argentina, causando anualmente pérdidas millonarias en cultivos, así como daños a propiedades y vehículos. Los sistemas de alerta actuales son a menudo genéricos y carecen de la especificidad necesaria para una prevención eficaz.

### La Solución

Nimbus AI propone una solución proactiva:
- **Modelo Multimodal:** Fusiona datos numéricos (temperatura, humedad, viento) con datos visuales (imágenes satelitales) para una predicción más robusta.
- **Salida Probabilística:** Entrega una probabilidad de granizo, permitiendo a los usuarios tomar decisiones basadas en su propio nivel de riesgo.
- **Plataforma Accesible:** La predicción está diseñada para ser consumida por una aplicación a través de esta API.

---

### Tech Stack

- **Data Science:** Python, Pandas, TensorFlow/Keras, Scikit-learn, Xarray, Plotly
- **Despliegue:** FastAPI, Docker, Hugging Face Spaces

---

### Equipo y Roles

- **Data Science & Model Lead:** Nahuel Ghilardi
- **Backend Development:** Nahuel Ghilardi, Gustavo Garcia

---

### Estado Actual

El proyecto ha completado el ciclo de desarrollo del **Modelo V3.1**, un modelo multimodal optimizado que está listo para ser desplegado a través de esta API. La fase actual es la de **despliegue en producción**.
