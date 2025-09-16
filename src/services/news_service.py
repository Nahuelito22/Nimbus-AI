import requests
from src.config import Config
import time
import unicodedata

# Cache simple para evitar requests repetidas
news_cache = {}
cache_timeout = 300  # 5 minutos en segundos

def get_news(category='general', limit=5):
    """
    Obtiene noticias de forma eficiente respetando los límites de la API
    """
    # Verificar cache primero
    cache_key = f"{category}_{limit}"
    current_time = time.time()
    
    if cache_key in news_cache:
        cached_data, timestamp = news_cache[cache_key]
        if current_time - timestamp < cache_timeout:
            print(f"✅ Usando cache para {category}")
            return cached_data
    
    # Parámetros optimizados para ahorrar créditos
    params = {
        'apikey': Config.NEWSDATA_API_KEY,
        'language': 'es',
        'country': 'ar',  # Solo Argentina
        'size': min(limit, 5),  # Máximo 5 noticias por request
        'prioritydomain': 'top'  # Noticias más importantes primero
    }
    
    # Búsquedas específicas pero eficientes
    search_queries = {
        'general': 'Argentina OR Mendoza',
        'deportes': 'fútbol OR deportes',
        'clima': 'clima OR meteorología',
        'politica': 'política OR gobierno',
        'economia': 'economía OR negocios'
    }
    
    params['q'] = search_queries.get(category, 'Argentina')
    
    try:
        print(f"📡 Solicitando {min(limit, 5)} noticias de {category}...")
        response = requests.get(Config.NEWSDATA_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])
            
            # Guardar en cache
            news_cache[cache_key] = (results, current_time)
            
            return results[:limit]  # Limitar al número solicitado
            
        elif response.status_code == 429:
            print("⚠️ Límite de requests alcanzado - Usando cache")
            return []
        else:
            print(f"❌ Error API: {response.status_code}")
            return []
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {str(e)}")
        return []

def format_news(news_data):
    if not news_data:
        return []

    formatted_news = []

    for news in news_data:
        # Aplicamos la normalización para convertir caracteres combinantes a su forma simple
        titulo = normalize_unicode(news.get('title', 'Sin título'))
        descripcion = normalize_unicode(news.get('description', 'Sin descripción'))

        formatted_news.append({
            'titulo': titulo,
            'descripcion': (descripcion[:100] + '...') if descripcion and descripcion != 'Sin descripción' else 'Sin descripción',
            'fuente': news.get('source_id', 'Fuente desconocida'),
            'fecha': news.get('pubDate', '').split('T')[0] if news.get('pubDate') else 'Fecha desconocida',
            'url': news.get('link', '#'),
            'categoria': news.get('category', ['general'])[0] if news.get('category') else 'general'
        })

    return formatted_news

def normalize_unicode(text):
    """
    Normaliza el texto para convertir caracteres combinantes a su forma canónica.
    Ejemplo: "o\u0301" -> "ó"
    """
    if not isinstance(text, str):
        return text
    
    # La forma NFKC es la más recomendada para compatibilidad
    return unicodedata.normalize('NFKC', text)

def get_news_safe(category='general', limit=3):
    """
    Versión segura que siempre limita a máximo 3 noticias
    """
    return get_news(category, min(limit, 3))