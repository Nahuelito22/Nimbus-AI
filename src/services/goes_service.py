import boto3
from botocore import UNSIGNED
from botocore.config import Config
from datetime import datetime, timedelta, timezone
import os
import xarray as xr
from pyproj import Proj
import matplotlib
matplotlib.use('Agg')  # <-- AGREGAR ESTO: Usar backend no interactivo
import matplotlib.pyplot as plt
import numpy as np
import time
import uuid  # <-- AGREGAR ESTO: Para nombres únicos

BUCKET_NAME = 'noaa-goes19'
PRODUCT_NAME = 'ABI-L2-CMIPF'
STATIC_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images'))

# Mapeo de paletas válidas
VALID_PALETTES = {
    'inferno': 'inferno',
    'viridis': 'viridis',
    'plasma': 'plasma',
    'gray': 'gray'
}

def get_latest_goes_image_url(band: int, palette: str = 'inferno'):
    """
    Encuentra, descarga, procesa y guarda la imagen más reciente de GOES-19.
    Devuelve la URL local de la imagen PNG generada y la URL de la leyenda.
    """
    try:
        # Validar paleta
        if palette not in VALID_PALETTES:
            palette = 'inferno'
        
        cmap_name = VALID_PALETTES[palette]
        
        os.makedirs(STATIC_FOLDER, exist_ok=True)

        s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
        now_utc = datetime.now(timezone.utc)
        
        file_key = None
        for i in range(4):
            search_time = now_utc - timedelta(hours=i)
            prefix = f"{PRODUCT_NAME}/{search_time.year}/{search_time.timetuple().tm_yday:03d}/{search_time.hour:02d}/"
            
            response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
            
            if 'Contents' in response:
                band_str = f'C{band:02d}'
                for file in reversed(response['Contents']):
                    if band_str in file['Key']:
                        file_key = file['Key']
                        break
            if file_key:
                break

        if not file_key:
            return {"error": "No se encontraron imágenes satelitales recientes."}

        # <-- CAMBIO IMPORTANTE: Usar UUID para nombres únicos y evitar conflictos
        unique_id = str(uuid.uuid4())
        local_nc_path = os.path.join(STATIC_FOLDER, f'temp_goes_image_{unique_id}.nc')
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        output_png_path = os.path.join(STATIC_FOLDER, f'latest_band_{band}_{palette}_{timestamp}.png')
        output_legend_path = os.path.join(STATIC_FOLDER, f'legend_{palette}_{timestamp}.png')

        print(f"🛰️ Descargando archivo: {file_key}")
        s3.download_file(BUCKET_NAME, file_key, local_nc_path)

        # <-- CAMBIO IMPORTANTE: Usar 'with' para asegurar que el archivo se cierre correctamente
        with xr.open_dataset(local_nc_path) as ds:
            proj_info = ds.goes_imager_projection
            h_sat, lon_cen = proj_info.perspective_point_height, proj_info.longitude_of_projection_origin
            p = Proj(proj='geos', h=h_sat, lon_0=lon_cen)
            x1, y1 = p(-70.5, -37.5)
            x2, y2 = p(-66.5, -32.0)
            
            ds['x'] = ds['x'] * h_sat
            ds['y'] = ds['y'] * h_sat
            
            recorte = ds.sel(x=slice(x1, x2), y=slice(y2, y1))['CMI'].values

            if band >= 7:
                recorte = recorte - 273.15
                vmin, vmax = -80, 40
            else:
                vmin, vmax = 0, 1

            recorte_limpio = np.nan_to_num(recorte)

            # Generar la imagen principal
            fig = plt.figure(figsize=(5, 5), dpi=100)
            ax = fig.add_subplot(1, 1, 1)
            im = ax.imshow(recorte_limpio, cmap=cmap_name, vmin=vmin, vmax=vmax)
            ax.axis('off')
            fig.tight_layout(pad=0)
            plt.savefig(output_png_path, bbox_inches='tight', pad_inches=0, transparent=True)
            plt.close(fig)

            # Generar la imagen de la leyenda
            fig_legend = plt.figure(figsize=(6, 1), dpi=100)
            ax_legend = fig_legend.add_subplot(111)
            
            # Crear un gradiente para la leyenda
            gradient = np.linspace(vmin, vmax, 256)
            gradient = np.vstack((gradient, gradient))
            
            im_legend = ax_legend.imshow(gradient, aspect='auto', cmap=cmap_name)
            ax_legend.set_xticks([0, 64, 128, 192, 255])
            ax_legend.set_xticklabels([
                f'{vmin:.0f}°C',
                f'{vmin+(vmax-vmin)*0.25:.0f}°C',
                f'{vmin+(vmax-vmin)*0.5:.0f}°C',
                f'{vmin+(vmax-vmin)*0.75:.0f}°C',
                f'{vmax:.0f}°C'
            ])
            ax_legend.set_yticks([])
            
            plt.savefig(output_legend_path, bbox_inches='tight', pad_inches=0)
            plt.close(fig_legend)

        # <-- CAMBIO IMPORTANTE: Asegurarse de que el archivo se cierre antes de eliminarlo
        try:
            os.remove(local_nc_path)
        except Exception as e:
            print(f"Advertencia: no se pudo eliminar el archivo temporal: {e}")

        relative_url = f"/static/radar_images/{os.path.basename(output_png_path)}"
        relative_legend_url = f"/static/radar_images/{os.path.basename(output_legend_path)}"
        
        print(f"✅ Imagen generada: {relative_url}")
        print(f"✅ Leyenda generada: {relative_legend_url}")

        return {
            "url": relative_url,
            "legend_url": relative_legend_url,
            "timestamp": now_utc.isoformat()
        }

    except Exception as e:
        print(f"❌ Error en goes_service: {str(e)}")
        return {"error": f"Error al procesar la imagen satelital: {str(e)}"}