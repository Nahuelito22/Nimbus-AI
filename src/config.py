import os
from dotenv import load_dotenv

# Construir la ruta explícita al archivo .env en la raíz del proyecto
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
dotenv_path = os.path.join(basedir, '.env')

# Cargar el archivo .env
load_dotenv(dotenv_path=dotenv_path)

class Config:
    # Configuración de APIs
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
    NEWSAPI_KEY = os.getenv('NEWSAPI_KEY')
    HUGGINGFACE_HEALTH_URL = os.getenv('HUGGINGFACE_HEALTH_URL', 'https://nahuelito22-nimbus-ai.hf.space/api/health')
    
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
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        r"https://nimbus-.*-nahuelito22s-projects.vercel.app", # Regex para previews de Vercel
        "https://nimbus-ai-mdz.vercel.app"  # URL de producción principal
    ]
    
    # Permitir añadir más orígenes desde variables de entorno
    cors_origins_env = os.getenv('CORS_ORIGINS')
    if cors_origins_env:
        CORS_ORIGINS.extend(cors_origins_env.split(','))

    # Configuración de la base de datos
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'instance', 'nimbus_v2.db'))
    
    # Lógica para la URL de la base de datos
    database_url = os.getenv('DATABASE_URL')
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = database_url or f'sqlite:///{db_path}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Configuración de Brevo
    BREVO_API_KEY = os.getenv('BREVO_API_KEY')
    BREVO_DEFAULT_SENDER = os.getenv('BREVO_DEFAULT_SENDER', 'noreply@nimbus-ai.com')