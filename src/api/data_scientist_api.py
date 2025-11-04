from flask import Blueprint, request, jsonify
from src.services.data_scientist_service import data_scientist_service
# Importar el modelo y lógica de predicción (se completará)
# from src.services.prediction_service import model

data_scientist_api = Blueprint('data_scientist_api', __name__)

@data_scientist_api.route('/api/ds/filters', methods=['GET'])
def get_filters():
    """
    Endpoint para obtener las opciones de los filtros.
    """
    try:
        filters = data_scientist_service.get_filter_options()
        return jsonify(filters)
    except Exception as e:
        # En un futuro, usar un logger aquí
        print(f"Error al obtener filtros: {e}")
        return jsonify({"error": "Ocurrió un error al procesar la solicitud"}), 500

@data_scientist_api.route('/api/ds/query', methods=['POST'])
def query_data():
    """
    Endpoint para obtener datos filtrados.
    """
    try:
        filters = request.json
        if not filters:
            return jsonify({"error": "El cuerpo de la solicitud no puede estar vacío"}), 400
            
        data = data_scientist_service.get_filtered_data(filters)
        return jsonify(data)
    except Exception as e:
        print(f"Error al consultar datos: {e}")
        return jsonify({"error": "Ocurrió un error al procesar la solicitud"}), 500

@data_scientist_api.route('/api/ds/predict', methods=['POST'])
def predict():
    """
    Endpoint para realizar una predicción con el modelo.
    """
    try:
        # La data para predecir vendrá en el cuerpo de la solicitud
        prediction_data = request.json
        
        # --- Lógica de Predicción (Placeholder) ---
        # 1. Validar y pre-procesar `prediction_data` para que coincida con la entrada del modelo.
        # 2. Cargar el modelo si no está en memoria.
        # 3. Realizar la predicción: `probability = model.predict(processed_data)`
        # 4. Devolver el resultado.
        
        # Por ahora, devolvemos un valor de ejemplo.
        # Esto se reemplazará con la llamada real al modelo.
        mock_probability = 0.1234 # Valor de ejemplo
        
        return jsonify({"hail_probability": mock_probability})
    except Exception as e:
        print(f"Error en la predicción: {e}")
        return jsonify({"error": "Ocurrió un error al procesar la predicción"}), 500
