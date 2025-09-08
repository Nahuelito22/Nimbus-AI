import requests
from src.config import Config
import unicodedata

def test_unicode_fix():
    # Hacer una request directa a newsdata.io
    params = {
        'apikey': Config.NEWSDATA_API_KEY,
        'language': 'es',
        'country': 'ar',
        'size': 1
    }
    
    response = requests.get("https://newsdata.io/api/1/news", params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data.get('results'):
            news = data['results'][0]
            title = news.get('title', '')
            description = news.get('description', '')
            
            print("🎯 RAW DATA FROM NEWSDATA.IO:")
            print(f"Título crudo: {repr(title)}")  # ← Usamos repr para ver caracteres especiales
            print(f"Descripción cruda: {repr(description)}")
            print()
            
            print("🔧 AFTER unicodedata.normalize:")
            normalized_title = unicodedata.normalize('NFKC', title)
            normalized_desc = unicodedata.normalize('NFKC', description)
            print(f"Título normalizado: {normalized_title}")
            print(f"Descripción normalizada: {normalized_desc}")
            print()
            
            print("📋 ANALYSIS:")
            print(f"Tipo del título: {type(title)}")
            print(f"¿Contiene secuencias Unicode?: {'\\\\u' in str(title)}")  # ← Corregido

if __name__ == "__main__":
    test_unicode_fix()