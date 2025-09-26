import os
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

class Config:
    # Configuración de APIs
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

    # Claves secretas para firmar la sesión y los tokens JWT
    SECRET_KEY = os.getenv('SECRET_KEY', 'una-clave-secreta-muy-dificil-de-adivinar')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'otra-clave-secreta-para-jwt')
    
    # Configuración de JWT
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # 1 hora en segundos
    JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
    
    # Configuración de Bcrypt
    BCRYPT_LOG_ROUNDS = int(os.getenv('BCRYPT_LOG_ROUNDS', 12))  # Número de rondas de hashing
    
    # Configuración de CORS (para producción, restringe los orígenes)
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')

    # Configuración de la base de datos
    # Usa la variable de entorno DATABASE_URL si existe, si no, usa un archivo local sqlite.
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///nimbus_v2.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False