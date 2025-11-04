import sys
import os
import pytest
from unittest.mock import patch, Mock
# 🔧 CONFIGURACIÓN: Agregar la carpeta src al path de Python
# Esto permite importar tus módulos como "from src.api.clima import get_clima"
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# 📦 IMPORTS: Importar las funciones que vamos a testear
from src.services.clima import get_clima
from src.config import Config

class TestClima:
    """Tests para el módulo de clima usando MOCKS"""
    
    @patch('src.services.clima.requests.get')
    def test_get_clima_ciudad_valida(self, mock_requests):
        """
        TEST 1: Simula una respuesta EXITOSA de la API
        """
        # 🎯 PREPARACIÓN del MOCK
        # Creamos una respuesta FALSA que simula la API
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "name": "Malargüe",
            "main": {
                "temp": 15.5,
                "feels_like": 14.0,
                "humidity": 65
            },
            "weather": [
                {
                    "description": "cielo despejado",
                    "icon": "01d"
                }
            ]
        }
        mock_requests.return_value = mock_response
        
        # 🚀 EJECUCIÓN
        resultado = get_clima("malargue")
        
        # ✅ VERIFICACIONES
        assert "error" not in resultado
        assert resultado["ciudad"] == "Malargüe"
        assert resultado["temperatura"] == 15.5
        assert resultado["humedad"] == 65
    
    def test_get_clima_ciudad_no_configurada(self):
        """
        TEST 2: Ciudad que NO existe en Config (NO necesita mock)
        """
        resultado = get_clima("ciudad_inexistente_123")
        
        assert "error" in resultado
        assert "no configurada" in resultado["error"].lower()
    
    @patch('src.services.clima.requests.get')
    def test_get_clima_error_api(self, mock_requests):
        """
        TEST 3: Simula que la API falla (error 500)
        """
        # 🎯 MOCK de error
        mock_response = Mock()
        mock_response.status_code = 500  # Error del servidor
        mock_requests.return_value = mock_response
        
        resultado = get_clima("mendoza")
        
        assert "error" in resultado
        assert "Error API: 500" in resultado["error"]
    
    @patch('src.services.clima.requests.get')
    def test_get_clima_ciudad_valida_estructura_completa(self, mock_requests):
        """
        TEST 4: Verifica estructura completa con datos de prueba
        """
        # 🎯 MOCK con todos los campos
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "name": "San Rafael",
            "main": {
                "temp": 18.0,
                "feels_like": 17.0,
                "humidity": 70
            },
            "weather": [
                {
                    "description": "nubes dispersas",
                    "icon": "03d"
                }
            ]
        }
        mock_requests.return_value = mock_response
        
        resultado = get_clima("san_rafael")
        
        # ✅ Verifica TODOS los campos
        campos_esperados = ["ciudad", "temperatura", "sensacion_termica", "humedad", "clima", "icono"]
        for campo in campos_esperados:
            assert campo in resultado, f"Falta campo: {campo}"