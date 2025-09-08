import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.config import Config

print("🔑 Verificando configuración...")
print("OpenWeather Key:", Config.OPENWEATHER_API_KEY)
print("NewsData Key:", Config.NEWSDATA_API_KEY)
print("NewsData URL:", Config.NEWSDATA_URL)