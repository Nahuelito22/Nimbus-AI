import random
from datetime import datetime, timedelta
import time
from .logger import app_logger
from .orchestration import get_hail_prediction

# Extendemos los datos con puntos representativos para cada departamento.
# En una implementación real, esto podría ser más sofisticado (ej. centroide, puntos ponderados por población, etc.)
DEPARTMENT_DATA = {
    "Las Heras": {
        "bounds": [[-32.8, -68.9], [-32.9, -68.9], [-32.9, -68.8], [-32.8, -68.8]],
        "points": [[-32.85, -68.85]]
    },
    "Godoy Cruz": {
        "bounds": [[-32.92, -68.85], [-32.95, -68.85], [-32.95, -68.82], [-32.92, -68.82]],
        "points": [[-32.93, -68.83]]
    },
    "Guaymallén": {
        "bounds": [[-32.88, -68.8], [-32.92, -68.8], [-32.92, -68.75], [-32.88, -68.75]],
        "points": [[-32.90, -68.77]]
    },
    "Luján de Cuyo": {
        "bounds": [[-33.0, -68.95], [-33.1, -68.95], [-33.1, -68.85], [-33.0, -68.85]],
        "points": [[-33.05, -68.9]]
    },
    "Maipú": {
        "bounds": [[-32.95, -68.78], [-33.05, -68.78], [-33.05, -68.68], [-32.95, -68.68]],
        "points": [[-33.00, -68.73]]
    },
    "Valle de Uco": {
        "bounds": [[-33.5, -69.2], [-33.7, -69.2], [-33.7, -69.0], [-33.5, -69.0]],
        "points": [[-33.6, -69.1]]
    },
    "Zona Este": {
        "bounds": [[-33.2, -68.5], [-33.4, -68.5], [-33.4, -68.3], [-33.2, -68.3]],
        "points": [[-33.3, -68.4]]
    },
}

def get_civil_defense_data():
    """
    Genera datos para el dashboard de Defensa Civil utilizando el modelo de predicción real.
    """
    app_logger.info("Iniciando la generación de datos para Defensa Civil con predicciones reales.")
    risk_zones = []
    alerts = []
    alert_id_counter = 1

    for dept_name, data in DEPARTMENT_DATA.items():
        max_prob = 0
        app_logger.info(f"Procesando departamento: {dept_name}")

        for i, point in enumerate(data["points"]):
            lat, lon = point
            app_logger.debug(f"  - Obteniendo predicción para el punto {i+1}/{len(data['points'])} ({lat}, {lon})")
            
            prediction_result = get_hail_prediction(lat, lon)
            
            if "error" in prediction_result:
                app_logger.error(f"Error al obtener predicción para {dept_name}: {prediction_result['error']}")
                # Si falla una predicción, continuamos con la siguiente para no bloquear todo el proceso
                continue

            # La probabilidad viene como un string "X.Y%", necesitamos el número
            try:
                prob_str = prediction_result.get("prob_granizo", "0.0%").replace('%_de_probabilidad_de_granizo','').strip()
                current_prob = float(prob_str)
                if current_prob > max_prob:
                    max_prob = current_prob
            except (ValueError, TypeError) as e:
                app_logger.error(f"Error al parsear la probabilidad '{prediction_result.get('prob_granizo')}': {e}")
                continue

            # Pequeña pausa para no sobrecargar el servicio de predicción
            time.sleep(0.2)

        app_logger.info(f"Probabilidad máxima para {dept_name}: {max_prob}%")

        # Asignar nivel de riesgo y crear alerta si la probabilidad es significativa
        if max_prob >= 85:
            color = "red"
            title = "ALERTA ROJA: GRANIZO INMINENTE"
        elif max_prob >= 65:
            color = "orange"
            title = "ALERTA NARANJA: ALTA PROBABILIDAD"
        elif max_prob >= 40:
            color = "yellow"
            title = "PRECAUCIÓN: POSIBLE GRANIZO"
        else:
            # Si no hay riesgo significativo, no se genera ni zona ni alerta para este departamento
            continue

        risk_zones.append({
            "name": dept_name,
            "color": color,
            "probability": round(max_prob, 2),
            "bounds": data["bounds"]
        })

        alerts.append({
            "id": alert_id_counter,
            "title": title,
            "region": dept_name,
            "probability": round(max_prob, 2),
            "time": datetime.now().strftime("%H:%M"),
            "color": color
        })
        alert_id_counter += 1

    # Ordenar alertas por probabilidad descendente para la UI
    alerts.sort(key=lambda x: x["probability"], reverse=True)

    app_logger.info(f"Generación de datos completada. {len(alerts)} alertas creadas.")

    return {
        "risk_zones": risk_zones,
        "alerts": alerts
    }