import requests
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
from src.models import SystemSetting
from src.database import db
from src.config import Config
from src.services.logger import app_logger

def ping_huggingface_space(app):
    """
    Realiza una petición GET al endpoint de health de Hugging Face 
    solo si la opción está activada en la base de datos.
    """
    with app.app_context():
        try:
            keep_alive_setting = SystemSetting.query.get('keep_alive_enabled')
            
            if keep_alive_setting and keep_alive_setting.value == 'true':
                health_url = app.config.get('HUGGINGFACE_HEALTH_URL')
                if not health_url:
                    app_logger.warning("Scheduler: HUGGINGFACE_HEALTH_URL no está configurada. No se puede hacer ping.")
                    return

                app_logger.info(f"Scheduler: Realizando ping a Hugging Face en {health_url}")
                response = requests.get(health_url, timeout=60) # Timeout de 60 segundos
                
                if response.status_code == 200:
                    app_logger.info(f"Scheduler: Ping a Hugging Face exitoso (Status: {response.status_code}). Contenedor activo.")
                else:
                    app_logger.error(f"Scheduler: Falló el ping a Hugging Face (Status: {response.status_code}). Respuesta: {response.text}")
            else:
                app_logger.info("Scheduler: El ping a Hugging Face está desactivado. No se realizará la petición.")

        except Exception as e:
            app_logger.error(f"Scheduler: Ocurrió un error inesperado durante el ping a Hugging Face: {e}")

scheduler = BackgroundScheduler(daemon=True)

def init_scheduler(app):
    """
    Inicializa y arranca el scheduler.
    """
    # Añadir el trabajo al scheduler para que se ejecute cada 45 horas
    scheduler.add_job(
        func=lambda: ping_huggingface_space(app),
        trigger='interval',
        hours=45,
        id='ping_hf_job', # ID único para el trabajo
        name='Ping Hugging Face Space to keep it alive',
        replace_existing=True
    )
    
    try:
        scheduler.start()
        app_logger.info("Scheduler iniciado exitosamente. El ping a Hugging Face se ejecutará cada 45 horas si está activado.")
        # Asegurarse de que el scheduler se apague correctamente cuando la app se detenga
        atexit.register(lambda: scheduler.shutdown())
    except Exception as e:
        app_logger.error(f"Error al iniciar el scheduler: {e}")
