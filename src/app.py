import sys
import os

# Añade el directorio raíz del proyecto al path de Python para que encuentre el módulo 'src'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token

# Se mantienen las importaciones de las rutas existentes
from src.services.clima import get_clima
from src.services.news_service import get_news_safe
from src.services.meteo import get_weather_by_coords, get_clima_by_ip, get_clima_ciudad

# 1. Inicialización de la App y carga de configuración
app = Flask(__name__)
app.config.from_object('src.config.Config') # Carga la configuración desde config.py

# 2. Inicialización de las extensiones
CORS(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# 3. Definición del Modelo de Datos (SQLAlchemy)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(80), nullable=False, default='user')

    def __repr__(self):
        return f'<User {self.email}>'

# 4. Comando para inicializar la base de datos
@app.cli.command("create-db")
def create_db():
    """Crea las tablas de la base de datos."""
    db.create_all()
    print("Base de datos y tablas creadas.")

# 5. Rutas de Autenticación
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "El email ya está registrado"}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password_hash=password_hash, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        additional_claims = {"role": user.role}
        access_token = create_access_token(identity=user.email, additional_claims=additional_claims)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401


# --- RUTA DE ORQUESTACIÓN PRINCIPAL ---

from src.services.orchestration import get_hail_prediction

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


# --- RUTAS EXISTENTES (se mantienen sin cambios) ---

from src.services.goes_service import get_latest_goes_image_url

@app.route('/api/satellite-image', methods=['GET'])
def satellite_image():
    """
    Endpoint para obtener la URL de la imagen más reciente del satélite GOES-19.
    """
    band = request.args.get('band', default=13, type=int)
    palette = request.args.get('palette', default='inferno', type=str) # Nuevo parámetro
    result = get_latest_goes_image_url(band, palette) # Pasar la paleta
    
    if "error" in result:
        return jsonify(result), 500
    
    return jsonify(result)


@app.route('/api/clima/<city_name>', methods=['GET'])
def get_weather(city_name):
    """
    Endpoint para obtener el clima de una ciudad específica
    """
    result = get_clima(city_name)
    return jsonify(result)

@app.route('/api/clima', methods=['GET'])
def get_all_weather():
    """
    Endpoint para obtener el clima de TODAS las ciudades configuradas
    """
    all_weather = {}
    for city_name in app.config['CITIES']:
        weather_data = get_clima(city_name)
        all_weather[city_name] = weather_data
    
    return jsonify(all_weather)


@app.route('/api/noticias/<category>', methods=['GET'])
def get_news_by_category(category):
    categorias_permitidas=['general','deportes','clima','politica','economia']

    if category not in categorias_permitidas:
        return jsonify({"error": f"Categoría no válida. Use: {', '.join(categorias_permitidas)}"}), 400
    
    formatted_news = get_news_safe(category, limit=3)

    return jsonify({
        'categoria':category,
        'total_noticias':len(formatted_news),
        'noticias':formatted_news
    })


@app.route('/api/noticias', methods=['GET'])
def get_all_news():
    """
    Obtiene noticias de todas las categorías
    """
    categorias = ['general', 'deportes', 'clima']
    all_news = {}
    
    for category in categorias:
        all_news[category] = get_news_safe(category, limit=2)
    
    return jsonify({
        'total_categorias': len(categorias),
        'noticias': all_news
    })


@app.route('/api/meteo/ip', methods=['GET'])
def clima_por_ip():
    """
    Endpoint que obtiene clima según la IP del cliente
    """
    result = get_clima_by_ip()
    return jsonify(result)

@app.route('/api/meteo/coords', methods=['GET'])
def clima_por_coords():
    """
    Endpoint que obtiene clima según coordenadas (lat, lon)
    Ejemplo: /api/meteo/coords?lat=-32.889&lon=-68.845
    """
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Debes enviar lat y lon como parámetros"}), 400

    result = get_weather_by_coords(float(lat), float(lon))
    return jsonify(result)

@app.route('/api/meteo/ciudad/<city_name>', methods=['GET'])
def clima_por_ciudad(city_name):
    """
    Endpoint que obtiene clima de Open-Meteo según el nombre de la ciudad
    """
    result = get_clima_ciudad(city_name)
    return jsonify(result)


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Endpoint para verificar que la API está funcionando
    """
    return jsonify({"status": "healthy", "message": "Nimbus API is running!"})
    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
