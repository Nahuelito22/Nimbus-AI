from flask import Flask, jsonify
from src.api.clima import get_clima
from src.services.news_service import get_news, format_news, get_news_safe
from src.config import Config

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False  # ← AGREGA ESTA LÍNEA IMPORTANTE

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


@app.route('/api/noticias/<category>', methods=['GET'])
def get_news_by_category(category):
    categorias_permitidas=['general','deportes','clima','politica','economia']

    if category not in categorias_permitidas:
        return jsonify({"error": f"Categoría no válida. Use: {', '.join(categorias_permitidas)}"}), 400
    
    news_data=get_news_safe(category, limit=3)
    formatted_news=format_news(news_data)

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
        news_data = get_news_safe(category, limit=2)  # Solo 2 por categoría para no saturar
        all_news[category] = format_news(news_data)
    
    return jsonify({
        'total_categorias': len(categorias),
        'noticias': all_news
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Endpoint para verificar que la API está funcionando
    """
    return jsonify({"status": "healthy", "message": "Nimbus API is running!"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)