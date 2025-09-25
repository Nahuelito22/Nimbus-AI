import boto3
from botocore import UNSIGNED
from botocore.config import Config
from datetime import datetime, timedelta, timezone
import os
import xarray as xr
from pyproj import Proj
import matplotlib.pyplot as plt
import numpy as np
import time


BUCKET_NAME = 'noaa-goes19'
PRODUCT_NAME = 'ABI-L2-CMIPF' # Full Disk
# La ruta se construye relativa a la ubicación de este archivo
STATIC_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images'))

def get_latest_goes_image_url(band: int, palette: str = 'inferno'):
    """
    Encuentra, descarga, procesa y guarda la imagen más reciente de GOES-19.
    Devuelve la URL local de la imagen PNG generada.
    """
    try:
        # Asegurarse que la carpeta de destino exista
        os.makedirs(STATIC_FOLDER, exist_ok=True)

        s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
        now_utc = datetime.now(timezone.utc)
        
        file_key = None
        # Busca en las últimas 4 horas hasta encontrar un archivo
        for i in range(4):
            search_time = now_utc - timedelta(hours=i)
            prefix = f"{PRODUCT_NAME}/{search_time.year}/{search_time.timetuple().tm_yday:03d}/{search_time.hour:02d}/"
            
            response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
            
            if 'Contents' in response:
                band_str = f'C{band:02d}'
                # Los archivos están ordenados por nombre, el último es el más reciente
                for file in reversed(response['Contents']):
                    if band_str in file['Key']:
                        file_key = file['Key']
                        break # Encontramos el más reciente para esta hora
            if file_key:
                break # Salimos del bucle de horas

        if not file_key:
            return {"error": "No se encontraron imágenes satelitales recientes."}

        # --- Procesamiento de la imagen ---
        local_nc_path = os.path.join(STATIC_FOLDER, 'temp_goes_image.nc')
        output_png_path = os.path.join(STATIC_FOLDER, f'latest_band_{band}.png')

        print(f"🛰️ Descargando archivo: {file_key}")
        s3.download_file(BUCKET_NAME, file_key, local_nc_path)

        # Abrir el dataset con xarray
        ds = xr.open_dataset(local_nc_path)
        
        # Proyección y recorte geográfico para la región de Mendoza/Cuyo
        proj_info = ds.goes_imager_projection
        h_sat, lon_cen = proj_info.perspective_point_height, proj_info.longitude_of_projection_origin
        p = Proj(proj='geos', h=h_sat, lon_0=lon_cen)
        x1, y1 = p(-70.5, -37.5) # Esquina inferior-izquierda
        x2, y2 = p(-66.5, -32.0) # Esquina superior-derecha
        
        ds['x'] = ds['x'] * h_sat
        ds['y'] = ds['y'] * h_sat
        
        recorte = ds.sel(x=slice(x1, x2), y=slice(y2, y1))['CMI'].values

        # Limpiar y normalizar los datos para visualización
        # Convertir de Kelvin a Celsius para bandas térmicas como la 13
        if band >= 7:
            recorte = recorte - 273.15
            vmin, vmax = -80, 40 # Rango típico en Celsius para nubes
        else:
            vmin, vmax = 0, 1 # Rango para bandas visibles

        recorte_limpio = np.nan_to_num(recorte)

        # Generar y guardar la imagen con Matplotlib
        fig = plt.figure(figsize=(5, 5), dpi=100)
        ax = fig.add_subplot(1, 1, 1)
        ax.imshow(recorte_limpio, cmap=palette, vmin=vmin, vmax=vmax)
        ax.axis('off')
        fig.tight_layout(pad=0)
        
        # Guardar la figura como PNG
        plt.savefig(output_png_path, bbox_inches='tight', pad_inches=0, transparent=True)
        plt.close(fig)
        
        # Limpiar archivo .nc temporal
        os.remove(local_nc_path)

        # Devolver la URL relativa del archivo estático, con un timestamp para evitar caché del navegador
        relative_url = f"/static/radar_images/{os.path.basename(output_png_path)}?t={time.time()}"
        print(f"✅ Imagen generada: {relative_url}")

        return {
            "url": relative_url,
            "timestamp": now_utc.isoformat()
        }

    except Exception as e:
        print(f"❌ Error en goes_service: {str(e)}")
        return {"error": f"Error al procesar la imagen satelital: {str(e)}"}
