import requests
from src.config import Config
import time
import unicodedata

# Cache simple para evitar requests repetidas
news_cache = {}
cache_timeout = 300  # 5 minutos en segundos

def get_news(category='general', limit=5):
    """
    Obtiene noticias de NewsAPI.org de forma eficiente.
    """
    cache_key = f"{category}_{limit}"
    current_time = time.time()
    
    if cache_key in news_cache:
        cached_data, timestamp = news_cache[cache_key]
        if current_time - timestamp < cache_timeout:
            print(f"✅ Usando cache para noticias de {category}")
            return cached_data

    # Mapeo de categorías a queries de búsqueda para NewsAPI
    search_queries = {
        'clima': '(clima OR meteorología OR granizo) AND (Mendoza OR Argentina)',
        'general': 'Argentina',
        # Agrega otras categorías si es necesario
    }

    params = {
        'apiKey': Config.NEWSAPI_KEY,
        'q': search_queries.get(category, 'Argentina'),
        'language': 'es',
        'pageSize': min(limit, 100), # NewsAPI usa pageSize, max 100
        'sortBy': 'publishedAt', # Ordenar por más recientes
    }
    
    try:
        print(f"📡 Solicitando {params['pageSize']} noticias de '{params['q']}' a NewsAPI.org...")
        response = requests.get(Config.NEWSAPI_URL, params=params)
        response.raise_for_status()  # Lanza un error para respuestas 4xx/5xx
        
        data = response.json()
        articles = data.get('articles', [])
        
        # Guardar en cache
        news_cache[cache_key] = (articles, current_time)
        
        return articles
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión o API: {str(e)}")
        # En caso de error, podrías devolver un conjunto de noticias de ejemplo
        return []

def format_news(news_data):
    if not news_data:
        return []

    formatted_news = []
    for article in news_data:
        # Aplicamos la normalización para convertir caracteres combinantes a su forma simple
        titulo = normalize_unicode(article.get('title', 'Sin título'))
        descripcion = normalize_unicode(article.get('description', 'Sin descripción'))
        fuente = article.get('source', {}).get('name', 'Fuente desconocida')

        formatted_news.append({
            'titulo': titulo,
            'descripcion': (descripcion[:150] + '...') if descripcion and descripcion != 'Sin descripción' else 'Sin descripción',
            'fuente': fuente,
            'fecha': article.get('publishedAt', '').split('T')[0] if article.get('publishedAt') else 'Fecha desconocida',
            'url': article.get('url', '#'),
        })

    return formatted_news

def normalize_unicode(text):
    """
    Normaliza el texto para convertir caracteres combinantes a su forma canónica.
    """
    if not isinstance(text, str):
        return text
    return unicodedata.normalize('NFKC', text)

def get_news_safe(category='general', limit=5):
    """
    Versión segura que obtiene noticias y las formatea.
    """
    news_data = get_news(category, limit)
    return format_news(news_data)
