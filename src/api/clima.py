import requests
from src.config import Config

def get_clima(city_name):
    """
    Obtiene datos del clima para una ciudad de Mendoza
    """
    # Verificar si la ciudad está en nuestra configuración
    if city_name not in Config.CITIES:
        return {"error": "Ciudad no configurada"}
    
    city_id = Config.CITIES[city_name]["id"]
    
    url = f"https://api.openweathermap.org/data/2.5/weather?id={city_id}&appid={Config.OPENWEATHER_API_KEY}&units=metric&lang=es"
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "ciudad": data["name"],
                "temperatura": data["main"]["temp"],
                "sensacion_termica": data["main"]["feels_like"],
                "humedad": data["main"]["humidity"],
                "clima": data["weather"][0]["description"],
                "icono": data["weather"][0]["icon"],
            }
        else:
            return {"error": f"Error API: {response.status_code}"}
            
    except requests.exceptions.RequestException as e:
        return {"error": f"Error de conexión: {str(e)}"}