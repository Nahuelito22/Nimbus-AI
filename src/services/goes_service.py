import boto3
from botocore import UNSIGNED
from botocore.config import Config
from datetime import datetime, timedelta, timezone
import os
import xarray as xr
from pyproj import Proj
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import time
import uuid
import hashlib
import glob
import re

# NOTE: Removed satpy and pyresample imports to simplify dependencies

BUCKET_NAME = 'noaa-goes19'
PRODUCT_NAME = 'ABI-L2-CMIPF'
STATIC_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images'))

# Configuración de caché y limpieza
CACHE_DURATION_MINUTES = 30  # Tiempo de caché en minutos
MAX_IMAGES_PER_CONFIG = 4    # Máximo de imágenes por configuración (banda+paleta)
MAX_AGE_HOURS = 24          # Edad máxima de imágenes (horas)
CLEANUP_PROBABILITY = 0.1   # Probabilidad de ejecutar limpieza (10%)

def cleanup_old_images():
    """Limpia imágenes antiguas para evitar saturación del servidor"""
    try:
        possible_paths = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'radar_images')),
            os.path.abspath(os.path.join(os.path.dirname(__file__), 'static', 'radar_images')),
        ]
        total_deleted = 0
        for path_dir in possible_paths:
            if os.path.exists(path_dir):
                png_files = glob.glob(os.path.join(path_dir, "*.png"))
                if not png_files:
                    continue

                config_groups = {}
                pattern = re.compile(r'latest_band_(\d+)_(\w+)_')  # captura band y palette
                for file_path in png_files:
                    filename = os.path.basename(file_path)
                    m = pattern.search(filename)
                    if m:
                        band = m.group(1)
                        palette = m.group(2)
                        config_key = f"{band}_{palette}"
                        if config_key not in config_groups:
                            config_groups[config_key] = []
                        config_groups[config_key].append({'path': file_path, 'mtime': os.path.getmtime(file_path)})

                for config_key, files in config_groups.items():
                    files.sort(key=lambda x: x['mtime'], reverse=True)
                    if len(files) > MAX_IMAGES_PER_CONFIG:
                        for file_info in files[MAX_IMAGES_PER_CONFIG:]:
                            try:
                                os.remove(file_info['path'])
                                total_deleted += 1
                            except Exception as e:
                                print(f"WARNING: Error al eliminar {file_info['path']}: {e}")

                now = time.time()
                max_age_seconds = MAX_AGE_HOURS * 3600
                for file_path in png_files:
                    if os.path.exists(file_path) and now - os.path.getmtime(file_path) > max_age_seconds:
                        try:
                            os.remove(file_path)
                            total_deleted += 1
                        except Exception as e:
                            print(f"WARNING: Error al eliminar {file_path} por edad: {e}")
        if total_deleted > 0:
            print(f"INFO: Limpieza completada: {total_deleted} imágenes eliminadas")
    except Exception as e:
        print(f"ERROR: Error en limpieza: {e}")

def get_cache_key(band, palette, user_lat=None, user_lon=None, show_marker=False):
    """Genera una clave de caché única que incluye opcionalmente la info del marcador."""
    now = datetime.utcnow()
    rounded_time = now.replace(
        minute=(now.minute // CACHE_DURATION_MINUTES) * CACHE_DURATION_MINUTES,
        second=0,
        microsecond=0
    )
    time_str = rounded_time.strftime("%Y%m%d_%H%M")

    marker_suffix = ""
    if show_marker and (user_lat is not None) and (user_lon is not None):
        lat_s = f"{round(float(user_lat), 4):.4f}"
        lon_s = f"{round(float(user_lon), 4):.4f}"
        marker_suffix = f"_marker_{lat_s}_{lon_s}"

    return f"{band}_{palette}_{time_str}{marker_suffix}"

def get_cached_image(cache_key):
    """Busca una imagen en caché válida (imagen + leyenda)."""
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images')),
        os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'radar_images')),
        os.path.abspath(os.path.join(os.path.dirname(__file__), 'static', 'radar_images')),
    ]
    
    for path_dir in possible_paths:
        if os.path.exists(path_dir):
            for filename in os.listdir(path_dir):
                if cache_key in filename:
                    image_path = os.path.join(path_dir, filename)
                    try:
                        parts = cache_key.split('_')
                        palette = parts[1]
                        legend_name = f"legend_{palette}_{cache_key}.png"
                        legend_path = os.path.join(path_dir, legend_name)
                    except Exception:
                        legend_path = os.path.join(path_dir, filename.replace('latest_band', 'legend'))

                    if os.path.exists(image_path) and os.path.exists(legend_path):
                        file_time = datetime.fromtimestamp(os.path.getmtime(image_path))
                        if datetime.utcnow() - file_time < timedelta(minutes=CACHE_DURATION_MINUTES):
                            return image_path, legend_path
    
    return None, None

def get_latest_goes_image_url(band: int, palette: str = 'inferno', force_refresh: bool = False, user_lat: float = None, user_lon: float = None, show_marker: bool = False):
    """Obtiene la imagen más reciente de GOES-19, con opción para marcar la ubicación del usuario."""
    try:
        VALID_PALETTES = {
            'inferno': 'inferno',
            'viridis': 'viridis',
            'plasma': 'plasma',
            'gray': 'gray'
        }
        
        if palette not in VALID_PALETTES:
            palette = 'inferno'
        
        cmap_name = VALID_PALETTES[palette]
        
        cache_key = get_cache_key(band, palette, user_lat=user_lat, user_lon=user_lon, show_marker=show_marker)
        
        if not force_refresh:
            cached_image, cached_legend = get_cached_image(cache_key)
            if cached_image and cached_legend:
                print(f"Usando imagen en caché: {os.path.basename(cached_image)}")
                return {
                    "url": cached_image,
                    "legend_url": cached_legend,
                    "timestamp": datetime.utcnow().isoformat(),
                    "cached": True
                }
        
        if np.random.rand() < CLEANUP_PROBABILITY:
            cleanup_old_images()
        
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

        unique_id = str(uuid.uuid4())
        local_nc_path = os.path.join(STATIC_FOLDER, f'temp_goes_image_{unique_id}.nc')
        
        output_png_path = os.path.join(STATIC_FOLDER, f'latest_band_{band}_{palette}_{cache_key}.png')
        output_legend_path = os.path.join(STATIC_FOLDER, f'legend_{palette}_{cache_key}.png')

        print(f"🛰️ Descargando: {file_key}")
        s3.download_file(BUCKET_NAME, file_key, local_nc_path)

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

            fig = plt.figure(figsize=(5, 5), dpi=100)
            ax = fig.add_subplot(1, 1, 1)
            im = ax.imshow(recorte_limpio, cmap=cmap_name, vmin=vmin, vmax=vmax, origin='upper')
            
            if show_marker and (user_lat is not None) and (user_lon is not None):
                try:
                    user_x, user_y = p(user_lon, user_lat)
                    
                    if (min(x1, x2) <= user_x <= max(x1, x2) and min(y1, y2) <= user_y <= max(y1, y2)):
                        width = recorte_limpio.shape[1]
                        height = recorte_limpio.shape[0]
                        pixel_x = np.interp(user_x, [min(x1, x2), max(x1, x2)], [0, width - 1])
                        pixel_y = np.interp(user_y, [min(y1, y2), max(y1, y2)], [height - 1, 0])

                        ax.scatter([pixel_x], [pixel_y],marker='o', s=100, facecolors='green', edgecolors='black', linewidths=1, zorder=5, alpha=0.85)
                except Exception as e:
                    print(f"Error al procesar la ubicación del usuario: {str(e)}")
            
            ax.axis('off')
            fig.tight_layout(pad=0)
            plt.savefig(output_png_path, bbox_inches='tight', pad_inches=0, transparent=True)
            plt.close(fig)

            fig_legend = plt.figure(figsize=(6, 1), dpi=100)
            ax_legend = fig_legend.add_subplot(111)
            
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

        try:
            os.remove(local_nc_path)
        except Exception as e:
            print(f"Advertencia: no se pudo eliminar temporal: {e}")

        relative_url = f"/static/radar_images/{os.path.basename(output_png_path)}"
        relative_legend_url = f"/static/radar_images/{os.path.basename(output_legend_path)}"
        
        return {
            "url": relative_url,
            "legend_url": relative_legend_url,
            "timestamp": now_utc.isoformat(),
            "cached": False
        }

    except Exception as e:
        print(f" Error: {str(e)}")
        return {"error": f"Error al procesar imagen satelital: {str(e)}"}

# =============================================================================
#  NUEVA SECCIÓN PARA EL DASHBOARD DEL METEORÓLOGO (SIMPLIFICADA)
# =============================================================================

def _get_product_cache_key(product_id: str, user_lat: float = None, user_lon: float = None):
    """Genera una clave de caché única para un producto de meteorólogo, incluyendo el marcador."""
    now = datetime.utcnow()
    rounded_time = now.replace(
        minute=(now.minute // CACHE_DURATION_MINUTES) * CACHE_DURATION_MINUTES,
        second=0,
        microsecond=0
    )
    time_str = rounded_time.strftime("%Y%m%d_%H%M")
    
    marker_suffix = ""
    if user_lat is not None and user_lon is not None:
        lat_s = f"{round(float(user_lat), 4):.4f}"
        lon_s = f"{round(float(user_lon), 4):.4f}"
        marker_suffix = f"_marker_{lat_s}_{lon_s}"

    return f"product_{product_id}_{time_str}{marker_suffix}"

def _get_product_cached_image(cache_key: str):
    """Busca una imagen de producto en caché (imagen + leyenda opcional)."""
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'radar_images')),
        os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'radar_images')),
        os.path.abspath(os.path.join(os.path.dirname(__file__), 'static', 'radar_images')),
    ]
    
    for path_dir in possible_paths:
        if os.path.exists(path_dir):
            image_filename = f"latest_{cache_key}.png"
            legend_filename = f"legend_{cache_key}.png"
            
            image_path = os.path.join(path_dir, image_filename)
            legend_path = os.path.join(path_dir, legend_filename)

            if os.path.exists(image_path):
                file_time = datetime.fromtimestamp(os.path.getmtime(image_path))
                if datetime.utcnow() - file_time < timedelta(minutes=CACHE_DURATION_MINUTES):
                    return image_path, legend_path if os.path.exists(legend_path) else None
    
    return None, None

def get_latest_goes_product(product_id: str, force_refresh: bool = False, user_lat: float = None, user_lon: float = None):
    """
    Obtiene el producto de imagen más reciente de GOES-19 para el dashboard del meteorólogo.
    Soporta bandas individuales y ahora puede dibujar un marcador de ubicación.
    """
    try:
        # --- 1. Configuración del Producto ---
        product_config = {
            'band_13': {'s3_product': 'ABI-L2-CMIPF', 'band_str': 'C13', 'palette': 'inferno', 'band_num': 13},
            'band_2': {'s3_product': 'ABI-L2-CMIPF', 'band_str': 'C02', 'palette': 'gray', 'band_num': 2},
            'band_7': {'s3_product': 'ABI-L2-CMIPF', 'band_str': 'C07', 'palette': 'viridis', 'band_num': 7},
            'band_9': {'s3_product': 'ABI-L2-CMIPF', 'band_str': 'C09', 'palette': 'plasma', 'band_num': 9},
            'band_14': {'s3_product': 'ABI-L2-CMIPF', 'band_str': 'C14', 'palette': 'inferno', 'band_num': 14},
        }

        if product_id not in product_config:
            return {"error": f"ID de producto no válido: {product_id}"}

        config = product_config[product_id]
        cache_key = _get_product_cache_key(product_id, user_lat, user_lon)

        # --- 2. Verificación de Caché ---
        if not force_refresh:
            cached_image, cached_legend = _get_product_cached_image(cache_key)
            if cached_image:
                print(f"Usando producto en caché: {os.path.basename(cached_image)}")
                return {
                    "url": f"/static/radar_images/{os.path.basename(cached_image)}",
                    "legend_url": f"/static/radar_images/{os.path.basename(cached_legend)}" if cached_legend else None,
                    "timestamp": datetime.utcnow().isoformat(),
                    "cached": True
                }

        # --- 3. Preparación y Limpieza ---
        if np.random.rand() < CLEANUP_PROBABILITY:
            cleanup_old_images()
        
        os.makedirs(STATIC_FOLDER, exist_ok=True)
        s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
        now_utc = datetime.now(timezone.utc)

        # --- 4. Búsqueda del Fichero en S3 ---
        file_key = None
        for i in range(4):
            search_time = now_utc - timedelta(hours=i)
            prefix = f"{config['s3_product']}/{search_time.year}/{search_time.timetuple().tm_yday:03d}/{search_time.hour:02d}/"
            response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
            
            if 'Contents' in response:
                for file in reversed(response['Contents']):
                    if config['band_str'] in file['Key']:
                        file_key = file['Key']
                        break
            if file_key:
                break

        if not file_key:
            return {"error": f"No se encontraron imágenes para el producto '{product_id}'."}

        # --- 5. Descarga y Procesamiento ---
        unique_id = str(uuid.uuid4())
        local_nc_path = os.path.join(STATIC_FOLDER, f'temp_goes_product_{unique_id}.nc')
        output_png_path = os.path.join(STATIC_FOLDER, f'latest_{cache_key}.png')
        output_legend_path = os.path.join(STATIC_FOLDER, f'legend_{cache_key}.png')

        print(f"🛰️ Descargando producto '{product_id}': {file_key}")
        s3.download_file(BUCKET_NAME, file_key, local_nc_path)

        # --- 6. Generación de Imagen con Matplotlib ---
        print("Procesando con Matplotlib...")
        with xr.open_dataset(local_nc_path) as ds:
            proj_info = ds.goes_imager_projection
            h_sat, lon_cen = proj_info.perspective_point_height, proj_info.longitude_of_projection_origin
            p = Proj(proj='geos', h=h_sat, lon_0=lon_cen)
            
            x1, y1 = p(-70.5, -37.5)
            x2, y2 = p(-66.5, -32.0)
            
            ds['x'] = ds['x'] * h_sat
            ds['y'] = ds['y'] * h_sat
            
            recorte = ds.sel(x=slice(x1, x2), y=slice(y2, y1))['CMI'].values
            
            band = config['band_num']
            if band >= 7:
                recorte = recorte - 273.15
                vmin, vmax = -80, 40
            else:
                vmin, vmax = 0, 1
            
            recorte_limpio = np.nan_to_num(recorte)

            fig = plt.figure(figsize=(5, 5), dpi=150)
            ax = fig.add_subplot(1, 1, 1)
            ax.imshow(recorte_limpio, cmap=config['palette'], vmin=vmin, vmax=vmax, origin='upper')
            
            # --- INICIO: Lógica del marcador --- 
            if user_lat is not None and user_lon is not None:
                try:
                    user_x, user_y = p(user_lon, user_lat)
                    if (min(x1, x2) <= user_x <= max(x1, x2) and min(y1, y2) <= user_y <= max(y1, y2)):
                        width = recorte_limpio.shape[1]
                        height = recorte_limpio.shape[0]
                        pixel_x = np.interp(user_x, [min(x1, x2), max(x1, x2)], [0, width - 1])
                        pixel_y = np.interp(user_y, [min(y1, y2), max(y1, y2)], [height - 1, 0])
                        ax.scatter([pixel_x], [pixel_y], marker='o', s=100, facecolors='green', edgecolors='black', linewidths=1.5, zorder=10, alpha=0.9)
                except Exception as e:
                    print(f"Error al procesar la ubicación del usuario para el marcador: {str(e)}")
            # --- FIN: Lógica del marcador ---

            ax.axis('off')
            fig.tight_layout(pad=0)
            plt.savefig(output_png_path, bbox_inches='tight', pad_inches=0, transparent=True)
            plt.close(fig)
            print(f"Generada (Matplotlib): {os.path.basename(output_png_path)}")

            if band >= 7:
                fig_legend = plt.figure(figsize=(6, 1), dpi=100)
                ax_legend = fig_legend.add_subplot(111)
                gradient = np.linspace(vmin, vmax, 256)
                gradient = np.vstack((gradient, gradient))
                ax_legend.imshow(gradient, aspect='auto', cmap=config['palette'])
                ax_legend.set_xticks([0, 64, 128, 192, 255])
                ax_legend.set_xticklabels([f'{vmin:.0f}°C', f'{vmin+(vmax-vmin)*0.25:.0f}°C', f'{vmin+(vmax-vmin)*0.5:.0f}°C', f'{vmin+(vmax-vmin)*0.75:.0f}°C', f'{vmax:.0f}°C'])
                ax_legend.set_yticks([])
                plt.savefig(output_legend_path, bbox_inches='tight', pad_inches=0)
                plt.close(fig_legend)
                print(f"Generada Leyenda: {os.path.basename(output_legend_path)}")
            else:
                output_legend_path = None

        # --- 7. Limpieza y Retorno ---
        try:
            os.remove(local_nc_path)
        except Exception as e:
            print(f"Advertencia: no se pudo eliminar temporal: {e}")

        return {
            "url": f"/static/radar_images/{os.path.basename(output_png_path)}",
            "legend_url": f"/static/radar_images/{os.path.basename(output_legend_path)}" if output_legend_path else None,
            "timestamp": now_utc.isoformat(),
            "cached": False
        }

    except Exception as e:
        print(f" Error en get_latest_goes_product: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": f"Error al procesar producto satelital: {str(e)}"}
