import pandas as pd
import json
from shapely.geometry import Point, Polygon
import os
import numpy as np

# --- Carga y Preparación de Datos ---

def load_department_polygons(json_path):
    polygons = []
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for feature in data['features']:
        dept_name = feature['properties']['departamento']
        if feature['geometry']['type'] == 'Polygon':
            polygons.append({
                'name': dept_name,
                'shape': Polygon(feature['geometry']['coordinates'][0])
            })
        elif feature['geometry']['type'] == 'MultiPolygon':
            from shapely.ops import unary_union
            multi_poly = [Polygon(p[0]) for p in feature['geometry']['coordinates']]
            polygons.append({
                'name': dept_name,
                'shape': unary_union(multi_poly)
            })
    return polygons

def get_department_for_coordinate(latitude, longitude, department_polygons):
    if pd.isna(latitude) or pd.isna(longitude):
        return "Sin Departamento"
    point = Point(longitude, latitude)
    for dept in department_polygons:
        if dept['shape'].contains(point):
            return dept['name']
    return "Fuera de Mendoza"

def load_and_enrich_data(csv_path, json_path):
    df = pd.read_csv(csv_path)
    department_polygons = load_department_polygons(json_path)
    df['departamento'] = df.apply(
        lambda row: get_department_for_coordinate(row['latitude'], row['longitude'], department_polygons),
        axis=1
    )
    return df

# --- Lógica de Negocio para el Dashboard ---

class DataScientistService:
    def __init__(self, csv_path, json_path):
        print("Cargando y enriqueciendo datos para el dashboard científico...")
        self.csv_path = csv_path
        self.df = load_and_enrich_data(csv_path, json_path)
        print("Datos listos.")

    def _dataframe_to_json_safe(self, df):
        df_filled = df.replace({np.nan: None})
        return df_filled.to_dict(orient='records')

    def get_filter_options(self):
        date_min = self.df['date'].min()
        date_max = self.df['date'].max()
        
        stations_df = self.df[['station_name', 'latitude', 'longitude']].drop_duplicates('station_name').dropna()
        stations = self._dataframe_to_json_safe(stations_df)

        departments = sorted(self.df['departamento'].unique().tolist())
        
        return {
            "dateRange": {"min": date_min, "max": date_max},
            "stations": stations,
            "departments": departments
        }

    def get_data_head(self, num_rows=5):
        head_df = self.df.head(num_rows)
        return self._dataframe_to_json_safe(head_df)

    def get_csv_path(self):
        return self.csv_path

    def get_filtered_data(self, filters, limit=1000):
        """Filtra los datos y aplica un límite opcional."""
        filtered_df = self.df.copy()
        
        if filters.get('startDate'):
            filtered_df = filtered_df[filtered_df['date'] >= filters['startDate']]
        if filters.get('endDate'):
            filtered_df = filtered_df[filtered_df['date'] <= filters['endDate']]
            
        if filters.get('stations') and len(filters['stations']) > 0:
            filtered_df = filtered_df[filtered_df['station_name'].isin(filters['stations'])]
        
        if limit is not None:
            filtered_df = filtered_df.head(limit)
            
        return self._dataframe_to_json_safe(filtered_df)

# --- Instancia del Servicio (Singleton) ---
CSV_DATA_PATH = 'data/processed/dataset_final_enriquecido.csv'
JSON_DEPT_PATH = 'data/raw/departamentos-mendoza.json'

data_scientist_service = DataScientistService(CSV_DATA_PATH, JSON_DEPT_PATH)