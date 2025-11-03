import sys
import os

# Forzar codificación UTF-8 para evitar errores 'charmap' en Windows
if sys.platform == 'win32':
    try:
        os.environ['PYTHONUTF8'] = '1'
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
        print("INFO: Codificación UTF-8 forzada para stdout/stderr.")
    except Exception as e:
        print(f"WARNING: No se pudo forzar la codificación UTF-8: {e}")

from flask import send_from_directory
import random
import string
import click
from functools import wraps

# Añade el directorio raíz del proyecto al path de Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, jsonify, request, send_from_directory, send_file
import io
from datetime import datetime
from src.services.report_service import generate_report_pdf
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from flask_mail import Mail
from flask_migrate import Migrate

# Importaciones existentes
from src.services.clima import get_clima
from src.services.news_service import get_news_safe
from src.services.meteo import get_weather_by_coords, get_clima_by_ip, get_clima_ciudad
from src.services.orchestration import get_hail_prediction, get_dashboard_weather, get_hail_prediction_with_details
from src.services.goes_service import get_latest_goes_image_url, get_latest_goes_product
from src.services.email_service import send_verification_email
from src.database import db  # Importar db desde nuestro archivo database.py
from src.services.logger import app_logger
from src.services.civil_defense_service import get_civil_defense_data
from src.services.admin_services import (
    get_all_users_service,
    approve_user_service,
    reject_user_service,
    change_user_role_service,
    suspend_user_service,
    unban_user_service
)

# 1. Inicialización de la App con configuración de archivos estáticos
app = Flask(__name__, 
            static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static')),
            static_url_path='/static')
app.config.from_object('src.config.Config')

# 2. Inicialización de las extensiones
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Configurar CORS explícitamente
db.init_app(app)  # Inicializar db con la app
migrate = Migrate(app, db) # Inicializar Flask-Migrate
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mail = Mail(app)

# Importar el modelo de usuario DESPUÉS de inicializar db
from src.models.user import User

# Decorador para proteger rutas y requerir rol de 'admin'
def admin_required():
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            # Permitir acceso si el rol es 'admin' o 'superadmin'
            if claims.get("role") in ["admin", "superadmin"]:
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="¡Acceso denegado! Se requiere rol de administrador."), 403
        return decorator
    return wrapper

# Decorador para proteger rutas y requerir un rol profesional
def professional_required():
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            allowed_roles = ["admin", "superadmin", "meteorologo", "defensa_civil", "cientifico_datos"]
            if claims.get("role") in allowed_roles:
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="¡Acceso denegado! Se requiere un rol profesional o de administrador."), 403
        return decorator
    return wrapper

# 3. Comando para inicializar la base de datos
@app.cli.command("create-db")
def create_db():
    """Crea las tablas de la base de datos."""
    try:
        print(f"Creando base de datos en: {app.config['SQLALCHEMY_DATABASE_URI']}")
        with app.app_context():
            db.create_all()
        print("Base de datos y tablas creadas exitosamente.")
    except Exception as e:
        print(f"Error al crear la base de datos: {e}")


@app.cli.command("set-admin")
@click.argument("email")
@click.option('--role', default='admin', help='Rol a asignar (admin, superadmin).')
def set_admin(email, role):
    """Otorga privilegios de administrador o superadministrador a un usuario."""
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if user:
            if role not in ['admin', 'superadmin']:
                print(f"Error: Rol '{role}' no es válido. Use 'admin' o 'superadmin'.")
                return
            user.role = role
            db.session.commit()
            print(f"El usuario {user.email} ahora tiene el rol de '{role}'.")
        else:
            print(f"Error: No se encontró ningún usuario con el email '{email}'.")
# 4. Manejadores de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Recurso no encontrado"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Error interno del servidor"}), 500

# 5. Rutas de Autenticación
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'user')

        if not email or not password or not name:
            return jsonify({"msg": "Email, contraseña y nombre son requeridos"}), 400

        user_exists = User.query.filter_by(email=email).first()
        if user_exists:
            return jsonify({"msg": "El email ya está registrado"}), 400

        # Crear nuevo usuario con campos básicos
        new_user = User(
            email=email,
            name=name,
            role=role
        )
        
        # Usar el método del modelo para establecer la contraseña
        new_user.set_password(password)
        
        # Agregar campos adicionales según el rol
        if role == 'defensa_civil':
            new_user.institution = data.get('institution', '')
            new_user.employee_id = data.get('employeeId', '')
            new_user.institutional_email = data.get('institutionalEmail', '')
        elif role == 'meteorologo':
            new_user.license_number = data.get('licenseNumber', '')
            new_user.workplace = data.get('workplace', '')
            new_user.linkedin_profile = data.get('linkedinProfile', '')
        elif role == 'cientifico_datos':
            new_user.organization = data.get('organization', '')
            new_user.github_profile = data.get('githubProfile', '')
            new_user.interest_description = data.get('interestDescription', '')
        
        # Generar código de verificación para TODOS los usuarios
        new_user.verification_code = ''.join(random.choices(string.digits, k=6))
        
        db.session.add(new_user)
        db.session.commit()

        # Enviar correo de verificación
        send_verification_email(mail, new_user.email, new_user.verification_code)

        # Preparar respuesta segura
        response_data = {"msg": "Usuario creado exitosamente. Revisa tu correo para verificar tu cuenta."}

        return jsonify(response_data), 201
    except Exception as e:
        app_logger.error(f"Error en el registro de {email}: {str(e)}")
        return jsonify({"msg": f"Error en el registro: {str(e)}"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"msg": "Email y contraseña son requeridos"}), 400

        user = User.query.filter_by(email=email).first()

        if user and user.is_suspended:
            return jsonify({"msg": "Tu cuenta ha sido suspendida. Contacta al administrador."}), 403

        # Añadir comprobación de verificación de email
        if user and not user.is_verified:
            # Devolvemos un error específico para que el frontend pueda manejarlo
            return jsonify({"error": "ACCOUNT_NOT_VERIFIED", "msg": "Tu cuenta no ha sido verificada."}), 401

        if user and user.check_password(password):  # Usar el método del modelo
            # Añadir ID y nombre al token para uso en el frontend
            additional_claims = {
                "role": user.role,
                "id": user.id,
                "name": user.name
            }
            access_token = create_access_token(identity=user.email, additional_claims=additional_claims)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"msg": "Email o contraseña incorrectos"}), 401
    except Exception as e:
        return jsonify({"msg": f"Error en el login: {str(e)}"}), 500

@app.route('/api/verify-email', methods=['POST'])
def verify_email():
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')

        if not email or not code:
            return jsonify({"msg": "Email y código son requeridos"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        if user.is_verified:
            return jsonify({"msg": "Esta cuenta ya ha sido verificada"}), 400

        if user.verification_code == code:
            user.is_verified = True
            user.verification_code = None  # Limpiar el código después de usarlo
            db.session.commit()
            return jsonify({"msg": "Tu cuenta ha sido verificada exitosamente"}), 200
        else:
            return jsonify({"msg": "Código de verificación inválido"}), 400
    
    except Exception as e:
        app_logger.error(f"Error en la verificación de email para {email}: {str(e)}")
        return jsonify({"msg": f"Error en el proceso de verificación: {str(e)}"}), 500

@app.route('/api/auth/resend-verification', methods=['POST'])
def resend_verification():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"msg": "Email es requerido"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            # No revelamos si el usuario existe o no por seguridad
            return jsonify({"msg": "Si existe una cuenta con este email, se ha enviado un nuevo código de verificación."}), 200

        if user.is_verified:
            return jsonify({"msg": "Esta cuenta ya ha sido verificada."}), 400

        # Generar un nuevo código y reenviar
        user.verification_code = ''.join(random.choices(string.digits, k=6))
        db.session.commit()
        
        send_verification_email(mail, user.email, user.verification_code)

        return jsonify({"msg": "Se ha enviado un nuevo código de verificación a tu correo."}), 200

    except Exception as e:
        app_logger.error(f"Error en resend_verification para {email}: {str(e)}")
        return jsonify({"msg": f"Error al reenviar la verificación: {str(e)}"}), 500


# --- RUTAS DE ADMINISTRACIÓN ---
@app.route('/api/admin/users', methods=['GET'])
@admin_required()
def get_all_users():
    """Endpoint para que los administradores obtengan todos los usuarios."""
    result = get_all_users_service()
    if result["success"]:
        return jsonify(result["users"])
    else:
        return jsonify({"error": result["error"]}), 500

@app.route('/api/admin/approve/<int:user_id>', methods=['POST'])
@admin_required()
def approve_user(user_id):
    """Endpoint para que un administrador apruebe a un usuario."""
    result = approve_user_service(user_id)
    if result["success"]:
        return jsonify({"msg": result["msg"]})
    else:
        return jsonify({"error": result["error"]}), 404 if "no encontrado" in result["error"] else 500

@app.route('/api/admin/reject/<int:user_id>', methods=['POST'])
@admin_required()
def reject_user(user_id):
    """Endpoint para que un administrador rechace (elimine) a un usuario."""
    result = reject_user_service(user_id)
    if result["success"]:
        return jsonify({"msg": result["msg"]})
    else:
        return jsonify({"error": result["error"]}), 404 if "no encontrado" in result["error"] else 500

@app.route('/api/admin/suspend/<int:user_id>', methods=['POST'])
@admin_required()
def suspend_user(user_id):
    """Endpoint para suspender a un usuario."""
    result = suspend_user_service(user_id)
    if result["success"]:
        return jsonify({"msg": result["msg"]})
    else:
        return jsonify({"error": result["error"]}), 404 if "no encontrado" in result["error"] else 500

@app.route('/api/admin/unban/<int:user_id>', methods=['POST'])
@admin_required()
def unban_user(user_id):
    """Endpoint para levantar la suspensión de un usuario."""
    result = unban_user_service(user_id)
    if result["success"]:
        return jsonify({"msg": result["msg"]})
    else:
        return jsonify({"error": result["error"]}), 404 if "no encontrado" in result["error"] else 500

@app.route('/api/admin/role/<int:user_id>', methods=['PUT'])
@admin_required()
def change_user_role(user_id):
    """Endpoint para cambiar el rol de un usuario."""
    data = request.get_json()
    new_role = data.get('role')
    if not new_role:
        return jsonify({"error": "El nuevo rol es requerido"}), 400
    
    result = change_user_role_service(user_id, new_role)
    if result["success"]:
        return jsonify({"msg": result["msg"]})
    else:
        return jsonify({"error": result["error"]}), 400 if "Rol no válido" in result["error"] else (404 if "no encontrado" in result["error"] else 500)

@app.route('/api/admin/logs', methods=['GET'])
@admin_required()
def get_logs():
    """Endpoint para ver los logs de la aplicación."""
    try:
        log_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'logs', 'app.log'))
        if not os.path.exists(log_file_path):
            return jsonify({"error": "El archivo de logs no se ha creado todavía."}), 404
        
        # Leer las últimas N líneas del log (ej. 100)
        with open(log_file_path, 'r') as f:
            lines = f.readlines()[-100:]
        
        return jsonify({"logs": '\n'.join(lines)})
    except Exception as e:
        app_logger.error(f"Error al leer el archivo de logs: {str(e)}")
        return jsonify({"error": "No se pudo leer el archivo de logs."}), 500

@app.route('/api/admin/test/open-meteo', methods=['GET'])
@admin_required()
def test_open_meteo():
    """Endpoint de prueba para el servicio Open-Meteo."""
    try:
        # Usar una ubicación de prueba, por ejemplo, Mendoza
        result = get_clima_ciudad("Mendoza")
        return jsonify({"status": "success", "data": result})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/admin/test/goes-satellite', methods=['GET'])
@admin_required()
def test_goes_satellite():
    """Endpoint de prueba para el servicio de imágenes GOES."""
    try:
        # Forzar una actualización de la imagen de prueba
        result = get_latest_goes_image_url(band=13, palette='inferno', force_refresh=True)
        return jsonify({"status": "success", "data": result})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/admin/test/news', methods=['GET'])
@admin_required()
def test_news_api():
    """Endpoint de prueba para el servicio de Noticias (NewsAPI)."""
    try:
        # Probar con una categoría general y un límite bajo
        result = get_news_safe(category='general', limit=1)
        return jsonify({"status": "success", "data": result})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/admin/test/huggingface', methods=['GET'])
@admin_required()
def test_huggingface_model():
    """Endpoint de prueba para el modelo de IA en Hugging Face."""
    try:
        # Usar coordenadas de prueba (ej. Mendoza, Argentina)
        lat, lon = -32.89, -68.84 
        result = get_hail_prediction(lat, lon)
        
        if "error" in result:
            # Si el servicio de orquestación devuelve un error, lo reflejamos
            return jsonify({"status": "error", "message": result["error"]}), 500
            
        return jsonify({"status": "success", "data": result})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# --- RUTA DE ORQUESTACIÓN PRINCIPAL ---
@app.route('/api/main-prediction', methods=['GET'])
def main_prediction():
    """
    Endpoint de orquestación principal.
    Recibe lat y lon, obtiene datos de clima, llama al modelo de ML y devuelve la predicción.
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Se requieren los parámetros 'lat' y 'lon'"}), 400

    try:
        # Llama a la función orquestadora
        result = get_hail_prediction(float(lat), float(lon))
        
        if "error" in result:
            # Si el orquestador devuelve un error (ej: de la API de HF), lo pasamos al cliente
            return jsonify(result), 500

        return jsonify(result)

    except Exception as e:
        # Captura cualquier otro error inesperado durante el proceso
        return jsonify({"error": f"Ocurrió un error interno en el servidor: {e}"}), 500


# Reemplaza todo el bloque de RUTA DE IMÁGENES SATELITALES por esto:
# Reemplaza el endpoint de imagen satelital actual por este:
@app.route('/api/satellite-image', methods=['GET'])
def satellite_image():
    """
    Endpoint para obtener la imagen más reciente del satélite GOES-19 en formato base64.
    """
    try:
        band = request.args.get('band', default=13, type=int)
        palette = request.args.get('palette', default='inferno', type=str)
        force_refresh = request.args.get('refresh', default='false').lower() == 'true'
        user_lat = request.args.get('lat', type=float)
        user_lon = request.args.get('lon', type=float)
        # El frontend envía 'marker' como 'true' o 'false' en la URL
        show_marker = request.args.get('marker', default='true').lower() == 'true'

        # Llamar al servicio para obtener las imágenes, pasando el nuevo parámetro
        result = get_latest_goes_image_url(
            band=band, 
            palette=palette, 
            force_refresh=force_refresh, 
            user_lat=user_lat, 
            user_lon=user_lon,
            show_marker=show_marker
        )
        
        if "error" in result:
            app_logger.error(f"Error en goes_service: {result['error']}")
            return jsonify(result), 500
        
        # Importar base64
        import base64
        
        # DEFINITIVO: Probar ambas posibles rutas para encontrar las imágenes
        possible_paths = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'radar_images')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), 'static', 'radar_images')),
        ]
        
        image_filename = result["url"].split('/')[-1]
        legend_filename = result["legend_url"].split('/')[-1]
        
        image_path = None
        legend_path = None
        
        # Buscar las imágenes en todas las posibles rutas
        for path_dir in possible_paths:
            img_path = os.path.join(path_dir, image_filename)
            leg_path = os.path.join(path_dir, legend_filename)
            
            if os.path.exists(img_path) and image_path is None:
                image_path = img_path
                
            if os.path.exists(leg_path) and legend_path is None:
                legend_path = leg_path
        
        # Verificar si se encontraron las imágenes
        if image_path is None:
            return jsonify({"error": f"No se encontró la imagen: {image_filename} en ninguna de las rutas probadas"}), 500
        
        if legend_path is None:
            return jsonify({"error": f"No se encontró la leyenda: {legend_filename} en ninguna de las rutas probadas"}), 500
        
        # Convertir imágenes a base64
        with open(image_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        with open(legend_path, "rb") as legend_file:
            legend_data = base64.b64encode(legend_file.read()).decode('utf-8')
        
        return jsonify({
            "image": f"data:image/png;base64,{image_data}",
            "legend": f"data:image/png;base64,{legend_data}",
            "timestamp": result["timestamp"],
            "cached": result.get("cached", False)
        })
        
    except Exception as e:
        app_logger.error(f"Error general en satellite_image: {str(e)}")
        return jsonify({"error": f"Error general: {str(e)}"}), 500

@app.route('/api/meteorologist/satellite-product', methods=['GET'])
@professional_required()
def satellite_product():
    """
    Endpoint para que meteorólogos obtengan productos de imágenes satelitales (ej: GeoColor).
    Ahora acepta coordenadas para dibujar un marcador.
    """
    try:
        product_id = request.args.get('product', type=str)
        force_refresh = request.args.get('refresh', default='false').lower() == 'true'
        user_lat = request.args.get('lat', type=float)
        user_lon = request.args.get('lon', type=float)

        if not product_id:
            return jsonify({"error": "Se requiere el parámetro 'product'"}), 400

        result = get_latest_goes_product(
            product_id=product_id, 
            force_refresh=force_refresh,
            user_lat=user_lat,
            user_lon=user_lon
        )
        
        if "error" in result:
            app_logger.error(f"Error en get_latest_goes_product: {result['error']}")
            return jsonify(result), 500
        
        import base64
        
        possible_paths = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'radar_images')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), 'static', 'radar_images')),
        ]
        
        image_filename = result["url"].split('/')[-1]
        image_path = None
        for path_dir in possible_paths:
            path = os.path.join(path_dir, image_filename)
            if os.path.exists(path):
                image_path = path
                break
        
        if not image_path:
            return jsonify({"error": f"No se encontró la imagen generada: {image_filename}"}), 500

        with open(image_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        legend_data = None
        if result.get("legend_url"):
            legend_filename = result["legend_url"].split('/')[-1]
            legend_path = None
            for path_dir in possible_paths:
                path = os.path.join(path_dir, legend_filename)
                if os.path.exists(path):
                    legend_path = path
                    break
            
            if legend_path:
                with open(legend_path, "rb") as legend_file:
                    legend_data = base64.b64encode(legend_file.read()).decode('utf-8')

        return jsonify({
            "image": f"data:image/png;base64,{image_data}",
            "legend": f"data:image/png;base64,{legend_data}" if legend_data else None,
            "timestamp": result["timestamp"],
            "cached": result.get("cached", False)
        })

    except Exception as e:
        app_logger.error(f"Error general en satellite_product: {str(e)}")
        return jsonify({"error": f"Error general: {str(e)}"}), 500

@app.route('/api/meteorologist/generate-report', methods=['GET'])
@professional_required()
def generate_report():
    """
    Genera y devuelve un reporte en PDF con datos meteorológicos y satelitales.
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Se requieren los parámetros 'lat' y 'lon'"}), 400

    try:
        # 1. Obtener datos meteorológicos
        weather_data = get_dashboard_weather(float(lat), float(lon))
        if 'error' in weather_data:
            return jsonify(weather_data), 500

        # 2. Obtener la imagen satelital (usamos la banda 13 por defecto)
        image_result = get_latest_goes_product(
            product_id='band_13', 
            force_refresh=False,
            user_lat=float(lat),
            user_lon=float(lon)
        )
        image_path = None
        if 'error' not in image_result:
            # Construir la ruta absoluta a la imagen
            image_filename = image_result["url"].split('/')[-1]
            possible_paths = [
                os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images')),
                os.path.abspath(os.path.join(os.path.dirname(__file__), 'static', 'radar_images')),
            ]
            for path_dir in possible_paths:
                path = os.path.join(path_dir, image_filename)
                if os.path.exists(path):
                    image_path = path
                    break
        
        # 3. Generar el PDF
        pdf_bytes = generate_report_pdf(weather_data, image_path)
        
        # 4. Enviar el archivo PDF
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'reporte_nimbus_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        )

    except Exception as e:
        app_logger.error(f"Error al generar el reporte PDF: {str(e)}")
        return jsonify({"error": f"No se pudo generar el reporte: {str(e)}"}), 500

@app.route('/api/meteorologist/predict-with-details', methods=['GET'])
@professional_required()
def predict_with_details():
    """
    Endpoint para que meteorólogos obtengan una predicción detallada, incluyendo la entrada del modelo.
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Se requieren los parámetros 'lat' y 'lon'"}), 400

    try:
        result = get_hail_prediction_with_details(float(lat), float(lon))
        if 'error' in result:
            return jsonify(result), 500
        return jsonify(result)

    except Exception as e:
        app_logger.error(f"Error en la predicción detallada: {str(e)}")
        return jsonify({"error": f"Ocurrió un error en la predicción detallada: {str(e)}"}), 500

@app.route('/api/civil-defense/dashboard', methods=['GET'])
@professional_required()
def civil_defense_dashboard():
    """
    Endpoint para que Defensa Civil obtenga datos de alertas y zonas de riesgo.
    """
    try:
        data = get_civil_defense_data()
        return jsonify(data)
    except Exception as e:
        app_logger.error(f"Error en el dashboard de Defensa Civil: {str(e)}")
        return jsonify({"error": f"Ocurrió un error en el dashboard de Defensa Civil: {str(e)}"}), 500

@app.route('/api/dashboard/weather-data', methods=['GET'])
@professional_required()
def dashboard_weather_data():
    """
    Endpoint para que los dashboards profesionales obtengan datos meteorológicos completos.
    """
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Se requieren los parámetros 'lat' y 'lon'"}), 400

    try:
        # Llama a la función orquestadora que devuelve los datos crudos
        result = get_dashboard_weather(float(lat), float(lon))
        
        if "error" in result:
            app_logger.error(f"Error en get_dashboard_weather: {result['error']}")
            return jsonify(result), 500

        return jsonify(result)

    except Exception as e:
        app_logger.error(f"Error general en dashboard_weather_data: {str(e)}")
        return jsonify({"error": f"Ocurrió un error interno en el servidor: {e}"}), 500


# --- RUTAS EXISTENTES ---
@app.route('/api/clima/<city_name>', methods=['GET'])
def get_weather(city_name):
    """Endpoint para obtener el clima de una ciudad específica"""
    try:
        result = get_clima(city_name)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/clima', methods=['GET'])
def get_all_weather():
    """Endpoint para obtener el clima de TODAS las ciudades configuradas"""
    try:
        all_weather = {}
        for city_name in app.config['CITIES']:
            weather_data = get_clima(city_name)
            all_weather[city_name] = weather_data
        
        return jsonify(all_weather)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/noticias/<category>', methods=['GET'])
def get_news_by_category(category):
    """Endpoint para obtener noticias por categoría"""
    try:
        categorias_permitidas=['general','deportes','clima','politica','economia']

        if category not in categorias_permitidas:
            return jsonify({"error": f"Categoría no válida. Use: {', '.join(categorias_permitidas)}"}), 400
        
        formatted_news = get_news_safe(category, limit=3)

        return jsonify({
            'categoria':category,
            'total_noticias':len(formatted_news),
            'noticias':formatted_news
        })
    except Exception as e:
        app_logger.error(f"Error en get_news_by_category: {str(e)}")
        return jsonify({"error": f"Error al obtener noticias: {str(e)}"}), 500

@app.route('/api/noticias', methods=['GET'])
def get_all_news():
    """Obtiene noticias de todas las categorías"""
    try:
        categorias = ['general', 'deportes', 'clima']
        all_news = {}
        
        for category in categorias:
            all_news[category] = get_news_safe(category, limit=2)
        
        return jsonify({
            'total_categorias': len(categorias),
            'noticias': all_news
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/meteo/ip', methods=['GET'])
def clima_por_ip():
    """Endpoint que obtiene clima según la IP del cliente"""
    try:
        result = get_clima_by_ip()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/meteo/coords', methods=['GET'])
def clima_por_coords():
    """Endpoint que obtiene clima según coordenadas (lat, lon)"""
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Debes enviar lat y lon como parámetros"}), 400

    try:
        result = get_weather_by_coords(float(lat), float(lon))
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/meteo/ciudad/<city_name>', methods=['GET'])
def clima_por_ciudad(city_name):
    """Endpoint que obtiene clima de Open-Meteo según el nombre de la ciudad"""
    try:
        result = get_clima_ciudad(city_name)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que la API está funcionando"""
    return jsonify({"status": "healthy", "message": "Nimbus API is running!"})

@app.route('/api/disk-usage', methods=['GET'])
def disk_usage():
    """Endpoint para monitorear el uso de disco de imágenes"""
    try:
        possible_paths = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'radar_images')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), 'static', 'radar_images')),
        ]
        
        total_size = 0
        file_count = 0
        oldest_file = None
        newest_file = None
        
        for path_dir in possible_paths:
            if os.path.exists(path_dir):
                for root, dirs, files in os.walk(path_dir):
                    for file in files:
                        if file.endswith('.png'):
                            file_path = os.path.join(root, file)
                            file_size = os.path.getsize(file_path)
                            file_time = os.path.getmtime(file_path)
                            
                            total_size += file_size
                            file_count += 1
                            
                            if oldest_file is None or file_time < oldest_file['time']:
                                oldest_file = {'name': file, 'time': file_time}
                            if newest_file is None or file_time > newest_file['time']:
                                newest_file = {'name': file, 'time': file_time}
        
        return jsonify({
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "file_count": file_count,
            "oldest_file": oldest_file['name'] if oldest_file else None,
            "newest_file": newest_file['name'] if newest_file else None,
            "max_age_hours": 24,  # Valor por defecto
            "max_images_per_config": 4,  # Valor por defecto
            "cache_duration_minutes": 30  # Valor por defecto
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- BLOQUE PRINCIPAL ---
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
