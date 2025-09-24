---
title: Nimbus AI - Predictor de Granizo
emoji: ⛈️
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
---

# Nimbus AI 🌩️

![Estado](https://img.shields.io/badge/estado-Desplegado%20en%20Producción-success)
![Versión](https://img.shields.io/badge/modelo-V3.1%20Multimodal-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

## Descripción del Proyecto

**Nimbus AI** es un sistema de alerta temprana de granizo basado en un modelo de machine learning multimodal. El objetivo es predecir la probabilidad de eventos de granizo combinando datos meteorológicos tabulares con el análisis de imágenes satelitales, proveyendo a los usuarios una herramienta precisa para la prevención de daños.

---

### API Desplegada

El modelo V3.1 está actualmente desplegado y accesible a través de los siguientes endpoints:

- **Documentación Interactiva (Swagger UI):** [https://nahuelito22-nimbus-ai.hf.space/api/docs](https://nahuelito22-nimbus-ai.hf.space/api/docs)
- **Documentación Alternativa (Redoc):** [https://nahuelito22-nimbus-ai.hf.space/api/redoc](https://nahuelito22-nimbus-ai.hf.space/api/redoc)
- **Health Check (Estado del Servicio):** [https://nahuelito22-nimbus-ai.hf.space/api/health](https://nahuelito22-nimbus-ai.hf.space/api/health)
- **OpenAPI Schema (JSON):** [https://nahuelito22-nimbus-ai.hf.space/api/openapi.json](https://nahuelito22-nimbus-ai.hf.space/api/openapi.json)

---

### El Problema

El granizo representa una amenaza significativa en regiones agrícolas como Mendoza, Argentina, causando anualmente pérdidas millonarias en cultivos, así como daños a propiedades y vehículos. Los sistemas de alerta actuales son a menudo genéricos y carecen de la especificidad necesaria para una prevención eficaz.

### La Solución

Nimbus AI propone una solución proactiva:
- **Modelo Multimodal:** Fusiona datos numéricos (temperatura, humedad, viento) con datos visuales (imágenes satelitales) para una predicción más robusta.
- **Salida Probabilística:** Entrega una probabilidad de granizo, permitiendo a los usuarios tomar decisiones basadas en su propio nivel de riesgo.
- **Plataforma Accesible:** La predicción está diseñada para ser consumida por una aplicación a través de esta API.

---

### Rendimiento del Modelo

El modelo V3.1, tras ser optimizado y evaluado en el conjunto de prueba, logró las siguientes métricas clave para la detección de granizo:

| Métrica | Valor | Descripción |
| :--- | :---: | :--- |
| **Recall (Sensibilidad)** | **100%** | El modelo fue capaz de identificar todos los eventos de granizo reales en el set de prueba. |
| **Precisión** | **~14%** | De todas las alertas generadas, el 14% fueron correctas, una mejora significativa sobre modelos anteriores. |
| **F1-Score** | **~0.24** | Un balance saludable entre Precisión y Recall para un problema altamente desbalanceado. |

*Nota: Estas métricas reflejan el rendimiento del modelo en el conjunto de datos de prueba con el umbral optimizado. La exactitud (accuracy) general fue del 33%, lo cual es esperado en un modelo enfocado en maximizar la detección de un evento raro.*

---

### Ejemplos de Uso

A continuación se muestra un ejemplo de cómo consumir el endpoint de predicción utilizando `curl`:

```bash
curl -X POST "https://nahuelito22-nimbus-ai.hf.space/api/predict" \
     -H "Content-Type: application/json" \
     -d '{
           "meteorological_data": {
             "temperature": 25.5,
             "humidity": 65,
             "wind_speed": 12.3,
             "pressure": 1013.2
           },
           "satellite_image_url": "https://example.com/satellite_image.jpg"
         }'
```

---

## Tech Stack

* Data Science: Python, Pandas, TensorFlow/Keras, Scikit-learn, Xarray, Plotly
* Despliegue: FastAPI, Docker, Hugging Face Spaces

---

## Equipo y Roles

* Data Science & Model Lead: Nahuel Ghilardi
* Backend Development: Nahuel Ghilardi, Gustavo Garcia

---

## Estado Actual

El proyecto ha completado el ciclo de desarrollo y optimización del Modelo V3.1, y la API se encuentra desplegada y operativa en Hugging Face Spaces.

---

## Roadmap

Próximas mejoras planeadas:

 * Incorporar datos de radar meteorológico para mejorar la precisión en tiempo real
 * Implementar datos nacionales y internacionales para mejorar el rendimiento de un proximo modelo v4.0
 * Expandir la cobertura a otras regiones de Argentina
 * Implementar un sistema de retroalimentación para mejorar continuamente el modelo
