from flask import Blueprint, request, jsonify, send_file
from src.services.data_scientist_service import data_scientist_service
import os

data_scientist_api = Blueprint('data_scientist_api', __name__)

@data_scientist_api.route('/api/ds/filters', methods=['GET'])
def get_filters():
    """Endpoint para obtener las opciones de los filtros (incluyendo estaciones con coords)."""
    try:
        filters = data_scientist_service.get_filter_options()
        return jsonify(filters)
    except Exception as e:
        print(f"Error al obtener filtros: {e}")
        return jsonify({"error": "Ocurrió un error al procesar la solicitud"}), 500

@data_scientist_api.route('/api/ds/head', methods=['GET'])
def get_head():
    """Endpoint para obtener las primeras filas del dataset."""
    try:
        num_rows = request.args.get('rows', 5, type=int)
        head_data = data_scientist_service.get_data_head(num_rows)
        return jsonify(head_data)
    except Exception as e:
        print(f"Error al obtener la cabecera de los datos: {e}")
        return jsonify({"error": "Ocurrió un error al procesar la solicitud"}), 500

@data_scientist_api.route('/api/ds/download-csv', methods=['GET'])
def download_csv():
    """Endpoint para descargar el dataset completo en formato CSV."""
    try:
        csv_path = data_scientist_service.get_csv_path()
        # La ruta debe ser absoluta para send_file
        absolute_path = os.path.abspath(csv_path)
        if not os.path.exists(absolute_path):
            return jsonify({"error": "Archivo no encontrado en el servidor."}), 404
        
        return send_file(absolute_path, as_attachment=True, download_name='dataset_nimbus_ai.csv')
    except Exception as e:
        print(f"Error al descargar el archivo CSV: {e}")
        return jsonify({"error": "Ocurrió un error al procesar la descarga"}), 500

@data_scientist_api.route('/api/ds/query', methods=['POST'])
def query_data():
    """Endpoint para obtener datos filtrados."""
    try:
        filters = request.json
        if not filters:
            return jsonify({"error": "El cuerpo de la solicitud no puede estar vacío"}), 400
            
        data = data_scientist_service.get_filtered_data(filters)
        return jsonify(data)
    except Exception as e:
        print(f"Error al consultar datos: {e}")
        return jsonify({"error": "Ocurrió un error al procesar la solicitud"}), 500