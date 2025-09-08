import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.services.news_service import get_news_safe, format_news

print("🧪 Probando servicio OPTIMIZADO...")
print("✅ Máximo 3 noticias por categoría")
print("✅ Cache de 5 minutos")
print("✅ Límites seguros para plan básico\n")

categories = ['general', 'deportes', 'clima']

for category in categories:
    print(f"📰 {category.upper()}:")
    news = get_news_safe(category, 3)
    formatted = format_news(news)
    
    for i, noticia in enumerate(formatted, 1):
        print(f"   {i}. {noticia['titulo'][:50]}...")
    
    print(f"   Total: {len(formatted)} noticias\n")