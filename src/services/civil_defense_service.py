
import random
from datetime import datetime, timedelta

# Datos geoespaciales de ejemplo para los departamentos de Mendoza
# En una implementación real, esto podría venir de una base de datos geoespacial (ej. PostGIS)
DEPARTMENT_BOUNDS = {
    "Las Heras": [[-32.8, -68.9], [-32.9, -68.9], [-32.9, -68.8], [-32.8, -68.8]],
    "Godoy Cruz": [[-32.92, -68.85], [-32.95, -68.85], [-32.95, -68.82], [-32.92, -68.82]],
    "Guaymallén": [[-32.88, -68.8], [-32.92, -68.8], [-32.92, -68.75], [-32.88, -68.75]],
    "Luján de Cuyo": [[-33.0, -68.95], [-33.1, -68.95], [-33.1, -68.85], [-33.0, -68.85]],
    "Maipú": [[-32.95, -68.78], [-33.05, -68.78], [-33.05, -68.68], [-32.95, -68.68]],
    "Valle de Uco": [[-33.5, -69.2], [-33.7, -69.2], [-33.7, -69.0], [-33.5, -69.0]],
    "Zona Este": [[-33.2, -68.5], [-33.4, -68.5], [-33.4, -68.3], [-33.2, -68.3]],
}

def get_civil_defense_data():
    """
    Genera datos simulados para el dashboard de Defensa Civil.
    En el futuro, esta función se conectará a modelos de predicción reales
    y bases de datos geoespaciales.
    """
    risk_zones = []
    alerts = []
    
    # Simular diferentes niveles de riesgo para algunos departamentos
    departments = list(DEPARTMENT_BOUNDS.keys())
    random.shuffle(departments)
    
    # Aseguramos que siempre haya al menos una alerta roja y una naranja para el demo
    high_risk_departments = random.sample(departments, 3)
    
    # 1. Alerta Roja
    dep_roja = high_risk_departments[0]
    prob_roja = random.randint(85, 100)
    risk_zones.append({
        "name": dep_roja,
        "color": "red",
        "probability": prob_roja,
        "bounds": DEPARTMENT_BOUNDS[dep_roja]
    })
    alerts.append({
        "id": 1,
        "title": "ALERTA ROJA: GRANIZO INMINENTE",
        "region": dep_roja,
        "probability": prob_roja,
        "time": (datetime.now() - timedelta(minutes=random.randint(1, 10))).strftime("%H:%M")
    })

    # 2. Alerta Naranja
    dep_naranja = high_risk_departments[1]
    prob_naranja = random.randint(65, 84)
    risk_zones.append({
        "name": dep_naranja,
        "color": "orange",
        "probability": prob_naranja,
        "bounds": DEPARTMENT_BOUNDS[dep_naranja]
    })
    alerts.append({
        "id": 2,
        "title": "ALERTA NARANJA: ALTA PROBABILIDAD",
        "region": dep_naranja,
        "probability": prob_naranja,
        "time": (datetime.now() - timedelta(minutes=random.randint(10, 25))).strftime("%H:%M")
    })

    # 3. Alerta Amarilla
    dep_amarilla = high_risk_departments[2]
    prob_amarilla = random.randint(40, 64)
    risk_zones.append({
        "name": dep_amarilla,
        "color": "yellow",
        "probability": prob_amarilla,
        "bounds": DEPARTMENT_BOUNDS[dep_amarilla]
    })
    alerts.append({
        "id": 3,
        "title": "PRECAUCIÓN: POSIBLE GRANIZO",
        "region": dep_amarilla,
        "probability": prob_amarilla,
        "time": (datetime.now() - timedelta(minutes=random.randint(25, 45))).strftime("%H:%M")
    })

    # Ordenar alertas de más reciente a más antigua para la UI
    alerts.sort(key=lambda x: x["time"], reverse=True)

    return {
        "risk_zones": risk_zones,
        "alerts": alerts
    }

