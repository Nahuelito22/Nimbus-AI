from flask import Blueprint, request, jsonify, send_file
from flask_cors import CORS
from src.services.data_scientist_service import data_scientist_service
import os
import pandas as pd
import io

data_scientist_api = Blueprint('data_scientist_api', __name__)
CORS(data_scientist_api) # Aplicar CORS a todas las rutas de este blueprint

@data_scientist_api.route('/api/filters', methods=['GET'])
def get_filters():
    try:
        filters = data_scientist_service.get_filter_options()
        return jsonify(filters)
    except Exception as e:
        return jsonify({"error": f"Ocurrió un error al obtener filtros: {e}"}), 500

@data_scientist_api.route('/api/head', methods=['GET'])
def get_head():
    try:
        num_rows = request.args.get('rows', 5, type=int)
        head_data = data_scientist_service.get_data_head(num_rows)
        return jsonify(head_data)
    except Exception as e:
        return jsonify({"error": f"Ocurrió un error al obtener la cabecera: {e}"}), 500

@data_scientist_api.route('/api/download-csv', methods=['GET'])
def download_csv():
    try:
        csv_path = data_scientist_service.get_csv_path()
        absolute_path = os.path.abspath(csv_path)
        if not os.path.exists(absolute_path):
            return jsonify({"error": "Archivo no encontrado."}), 404
        return send_file(absolute_path, as_attachment=True, download_name='dataset_completo_nimbus.csv')
    except Exception as e:
        return jsonify({"error": f"Error al descargar el archivo: {e}"}), 500

@data_scientist_api.route('/api/download-filtered-csv', methods=['POST'])
def download_filtered_csv():
    """Endpoint para descargar los datos filtrados como CSV."""
    try:
        filters = request.json
        if not filters:
            return jsonify({"error": "Los filtros son requeridos."}), 400

        # Obtener TODOS los datos filtrados, sin límite
        filtered_data_list = data_scientist_service.get_filtered_data(filters, limit=None)
        
        if not filtered_data_list:
            # Si no hay datos, podríamos devolver un 204 No Content o un JSON con mensaje
            return jsonify({"message": "No hay datos que coincidan con los filtros para descargar."}), 200

        # Convertir la lista de diccionarios de nuevo a un DataFrame
        df = pd.DataFrame(filtered_data_list)

        # Convertir el DataFrame a un string CSV en memoria
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False, encoding='utf-8')
        
        # Crear un buffer de bytes para send_file
        mem_buffer = io.BytesIO()
        mem_buffer.write(csv_buffer.getvalue().encode('utf-8'))
        mem_buffer.seek(0)

        return send_file(
            mem_buffer,
            as_attachment=True,
            download_name='datos_filtrados_nimbus.csv',
            mimetype='text/csv'
        )
    except Exception as e:
        return jsonify({"error": f"Error al generar el CSV filtrado: {e}"}), 500

@data_scientist_api.route('/api/query', methods=['POST'])
def query_data():
    try:
        filters = request.json
        if not filters:
            return jsonify({"error": "El cuerpo de la solicitud no puede estar vacío"}), 400
        data = data_scientist_service.get_filtered_data(filters) # Usa el límite por defecto de 1000
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": f"Ocurrió un error al consultar datos: {e}"}), 500