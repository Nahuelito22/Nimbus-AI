import sys
import os

# Agregar la ruta principal al path de Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importar desde la ubicación correcta
from src.api.clima import get_clima

print("🔍 Probando función get_clima...")
resultado = get_clima("san_rafael")  # ← debe ser minúscula como en config.py
print(resultado)