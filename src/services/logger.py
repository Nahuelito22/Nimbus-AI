import logging
import os
from logging.handlers import RotatingFileHandler

# Crear directorio de logs si no existe
LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'logs'))
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

LOG_FILE = os.path.join(LOG_DIR, 'app.log')

# Configurar el logger principal
app_logger = logging.getLogger('nimbus_ai')
app_logger.setLevel(logging.INFO)

# Formateador para los logs
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Handler para archivo con rotación
file_handler = RotatingFileHandler(LOG_FILE, maxBytes=1024*1024*5, backupCount=3, encoding='utf-8')  # Agregar encoding='utf-8'
file_handler.setFormatter(formatter)
app_logger.addHandler(file_handler)

# Handler para consola (opcional, útil durante desarrollo)
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
app_logger.addHandler(console_handler)

# Evitar que los logs se propaguen al logger raíz
app_logger.propagate = False

# Logger específico para errores de la API
api_error_logger = logging.getLogger('nimbus_ai.api_errors')
api_error_logger.setLevel(logging.ERROR)
api_error_handler = RotatingFileHandler(LOG_FILE, maxBytes=1024*1024*5, backupCount=3, encoding='utf-8')  # Agregar encoding='utf-8'
api_error_handler.setFormatter(formatter)
api_error_logger.addHandler(api_error_handler)
api_error_logger.propagate = False