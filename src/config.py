import os
from dotenv import load_dotenv


# Cargar variables del archivo .env
load_dotenv()

class Config:
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
    NEWSAPI_KEY = os.getenv('NEWSAPI_KEY')
    
    # Ciudades de Mendoza que vamos a monitorear
    CITIES = {
        "mendoza": {"id": 3844421, "name": "Mendoza"},
        "san_rafael": {"id": 3836669, "name": "San Rafael"},
        "tunuyan": {"id": 3833520, "name": "Tunuyán"},
        "malargue": {"id": 3845181, "name": "Malargüe"},
        "las_heras": {"id": 3848354, "name": "Las Heras"},  
        "rivadavia": {"id": 3838759, "name": "Rivadavia"} 
    }
    
    NEWSAPI_URL = "https://newsapi.org/v2/everything"

    # Clave secreta para firmar la sesión y los tokens JWT
    SECRET_KEY = os.getenv('SECRET_KEY', 'una-clave-secreta-muy-dificil-de-adivinar')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'otra-clave-secreta-para-jwt')

    # Configuración de la base de datos
    # Usa la variable de entorno DATABASE_URL si existe, si no, usa un archivo local sqlite.
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///nimbus.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False