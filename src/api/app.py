from flask import Flask, jsonify
from src.api.clima import get_clima
from src.config import Config

app = Flask(__name__)

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
    
    for city_name in Config.CITIES:
        weather_data = get_clima(city_name)
        all_weather[city_name] = weather_data
    
    return jsonify(all_weather)

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Endpoint para verificar que la API está funcionando
    """
    return jsonify({"status": "healthy", "message": "Nimbus API is running!"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)