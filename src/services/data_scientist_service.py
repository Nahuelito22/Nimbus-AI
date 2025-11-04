import pandas as pd
import json
from shapely.geometry import Point, Polygon

# --- Carga y Preparación de Datos ---

def load_department_polygons(json_path):
    """
    Carga los polígonos de los departamentos desde un archivo GeoJSON.
    """
    polygons = []
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for feature in data['features']:
        dept_name = feature['properties']['departamento']
        # Asegurarse de que la geometría es un polígono o multipolígono
        if feature['geometry']['type'] in ['Polygon', 'MultiPolygon']:
            polygons.append({
                'name': dept_name,
                'shape': Polygon(feature['geometry']['coordinates'][0]) # Simplificado para polígonos simples
            })
    return polygons

def get_department_for_coordinate(latitude, longitude, department_polygons):
    """
    Encuentra el departamento para una coordenada dada.
    """
    if pd.isna(latitude) or pd.isna(longitude):
        return "Sin Departamento"
    
    point = Point(longitude, latitude)
    for dept in department_polygons:
        if dept['shape'].contains(point):
            return dept['name']
    return "Fuera de Mendoza"

def load_and_enrich_data(csv_path, json_path):
    """
    Carga el dataset principal y lo enriquece con la información de departamento.
    """
    # Cargar datos principales
    df = pd.read_csv(csv_path)
    
    # Cargar polígonos
    department_polygons = load_department_polygons(json_path)
    
    # Aplicar la función para obtener departamentos
    # Se usa una muestra para acelerar el desarrollo, quitar .head() para producción
    df['departamento'] = df.apply(
        lambda row: get_department_for_coordinate(row['latitude'], row['longitude'], department_polygons),
        axis=1
    )
    
    return df

# --- Lógica de Negocio para el Dashboard ---

class DataScientistService:
    def __init__(self, csv_path, json_path):
        print("Cargando y enriqueciendo datos para el dashboard científico...")
        self.df = load_and_enrich_data(csv_path, json_path)
        print("Datos listos.")

    def get_filter_options(self):
        """
        Devuelve las opciones disponibles para los filtros del frontend.
        """
        date_min = self.df['date'].min()
        date_max = self.df['date'].max()
        
        stations = self.df['station_name'].unique().tolist()
        departments = self.df['departamento'].unique().tolist()
        
        return {
            "dateRange": {
                "min": date_min,
                "max": date_max
            },
            "stations": sorted(stations),
            "departments": sorted(departments)
        }

    def get_filtered_data(self, filters):
        """
        Filtra el dataframe principal basado en los filtros proporcionados.
        """
        filtered_df = self.df.copy()
        
        # Filtro por rango de fechas
        if 'startDate' in filters and filters['startDate']:
            filtered_df = filtered_df[filtered_df['date'] >= filters['startDate']]
        if 'endDate' in filters and filters['endDate']:
            filtered_df = filtered_df[filtered_df['date'] <= filters['endDate']]
            
        # Filtro por estaciones
        if 'stations' in filters and filters['stations']:
            filtered_df = filtered_df[filtered_df['station_name'].isin(filters['stations'])]
            
        # Filtro por departamentos
        if 'departments' in filters and filters['departments']:
            filtered_df = filtered_df[filtered_df['departamento'].isin(filters['departments'])]
            
        # Limitar a 1000 registros para no sobrecargar el frontend
        return filtered_df.head(1000).to_dict(orient='records')

# --- Instancia del Servicio (Singleton) ---
# Se asumen las rutas relativas al root del proyecto
CSV_DATA_PATH = 'data/processed/dataset_final_enriquecido.csv'
JSON_DEPT_PATH = 'data/raw/departamentos-mendoza.json'

# Esta instancia se importará en la API
data_scientist_service = DataScientistService(CSV_DATA_PATH, JSON_DEPT_PATH)
