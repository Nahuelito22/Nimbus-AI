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

                # Agrupar por band_palette usando regex robusto
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
                                print(f"INFO: Eliminada: {os.path.basename(file_info['path'])}")
                            except Exception as e:
                                print(f"WARNING: Error al eliminar {file_info['path']}: {e}")

                now = time.time()
                max_age_seconds = MAX_AGE_HOURS * 3600
                for file_path in png_files:
                    if now - os.path.getmtime(file_path) > max_age_seconds:
                        try:
                            os.remove(file_path)
                            total_deleted += 1
                            print(f"INFO: Eliminada por edad: {os.path.basename(file_path)}")
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
        # redondear a 4 decimales para evitar demasiadas versiones
        lat_s = f"{round(float(user_lat), 4):.4f}"
        lon_s = f"{round(float(user_lon), 4):.4f}"
        # se agrega prefijo marker para identificar fácilmente
        marker_suffix = f"_marker_{lat_s}_{lon_s}"

    # Mantener el formato que esperaba el resto del código (band_palette_time+marker)
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
                    # construir legend path coherente con el nombre que generamos más abajo
                    # la leyenda se genera como legend_{palette}_{cache_key}.png en este módulo,
                    # por lo que intentamos reconstruirla:
                    # extraer palette del cache_key (cache_key = band_palette_time[_marker...])
                    try:
                        parts = cache_key.split('_')
                        # parts[1] es palette según get_cache_key
                        palette = parts[1]
                        legend_name = f"legend_{palette}_{cache_key}.png"
                        legend_path = os.path.join(path_dir, legend_name)
                    except Exception:
                        legend_path = os.path.join(path_dir, filename.replace('latest_band', 'legend'))

                    if os.path.exists(image_path) and os.path.exists(legend_path):
                        # Verificar si aún es válida
                        file_time = datetime.fromtimestamp(os.path.getmtime(image_path))
                        if datetime.utcnow() - file_time < timedelta(minutes=CACHE_DURATION_MINUTES):
                            return image_path, legend_path
    
    return None, None

def get_latest_goes_image_url(band: int, palette: str = 'inferno', force_refresh: bool = False, user_lat: float = None, user_lon: float = None, show_marker: bool = False):
    """Obtiene la imagen más reciente de GOES-19, con opción para marcar la ubicación del usuario."""
    try:
        # Validar paleta
        VALID_PALETTES = {
            'inferno': 'inferno',
            'viridis': 'viridis',
            'plasma': 'plasma',
            'gray': 'gray'
        }
        
        if palette not in VALID_PALETTES:
            palette = 'inferno'
        
        cmap_name = VALID_PALETTES[palette]
        
        # Generar clave de caché (ahora puede incluir marker)
        cache_key = get_cache_key(band, palette, user_lat=user_lat, user_lon=user_lon, show_marker=show_marker)
        
        # Verificar caché si no se fuerza actualización
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
        
        # Ejecutar limpieza probabilísticamente
        if np.random.rand() < CLEANUP_PROBABILITY:
            cleanup_old_images()
        
        # Generar nueva imagen
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
        
        # Usar clave de caché en el nombre del archivo
        output_png_path = os.path.join(STATIC_FOLDER, f'latest_band_{band}_{palette}_{cache_key}.png')
        output_legend_path = os.path.join(STATIC_FOLDER, f'legend_{palette}_{cache_key}.png')

        print(f"🛰️ Descargando: {file_key}")
        s3.download_file(BUCKET_NAME, file_key, local_nc_path)

        with xr.open_dataset(local_nc_path) as ds:
            # Configurar proyección
            proj_info = ds.goes_imager_projection
            h_sat, lon_cen = proj_info.perspective_point_height, proj_info.longitude_of_projection_origin
            p = Proj(proj='geos', h=h_sat, lon_0=lon_cen)
            
            # Convertir coordenadas de Mendoza (bbox usado para recorte)
            x1, y1 = p(-70.5, -37.5)
            x2, y2 = p(-66.5, -32.0)
            
            # Escalar coordenadas
            ds['x'] = ds['x'] * h_sat
            ds['y'] = ds['y'] * h_sat
            
            # Realizar recorte (igual que en la versión funcional)
            recorte = ds.sel(x=slice(x1, x2), y=slice(y2, y1))['CMI'].values
            
            # Aplicar conversión de temperatura según la banda
            if band >= 7:
                recorte = recorte - 273.15
                vmin, vmax = -80, 40
            else:
                vmin, vmax = 0, 1
            
            # Limpiar valores NaN
            recorte_limpio = np.nan_to_num(recorte)

            # Generar imagen principal
            fig = plt.figure(figsize=(5, 5), dpi=100)
            ax = fig.add_subplot(1, 1, 1)
            im = ax.imshow(recorte_limpio, cmap=cmap_name, vmin=vmin, vmax=vmax, origin='upper')
            
            # Agregar marcador de ubicación del usuario si se proporciona
            if show_marker and (user_lat is not None) and (user_lon is not None):
                try:
                    # Convertir coordenadas del usuario a la proyección del satélite
                    user_x, user_y = p(user_lon, user_lat)
                    
                    # Verificar si la ubicación está dentro del área recortada
                    if (min(x1, x2) <= user_x <= max(x1, x2) and 
                        min(y1, y2) <= user_y <= max(y1, y2)):
                        
                        # Convertir a coordenadas de píxeles (x horizontal, y vertical)
                        width = recorte_limpio.shape[1]
                        height = recorte_limpio.shape[0]
                        pixel_x = np.interp(user_x, [min(x1, x2), max(x1, x2)], [0, width - 1])
                        pixel_y = np.interp(user_y, [min(y1, y2), max(y1, y2)], [0, height - 1])

                        # DEBUG: imprimir info para verificar coordenadas (revisa logs del servidor)
                        print(f"[DEBUG MARKER] user_lat={user_lat}, user_lon={user_lon} -> proj({user_x:.2f},{user_y:.2f}) -> px={pixel_x:.1f}, py={pixel_y:.1f}, w={width}, h={height}", flush=True)

                        # Dibujar marcador visible: punto verde con borde negro
                        ax.scatter([pixel_x], [pixel_y],marker='o', s=600, facecolors='green', edgecolors='black', linewidths=1.8, zorder=5, alpha=0.95)
                        print(f"Ubicación del usuario marcada en ({user_lat}, {user_lon}) -> (px: {pixel_x:.1f}, py: {pixel_y:.1f})")
                    else:
                        print(f"La ubicación del usuario ({user_lat}, {user_lon}) está fuera del área recortada")
                        
                except Exception as e:
                    print(f"Error al procesar la ubicación del usuario: {str(e)}")
            
            ax.axis('off')
            fig.tight_layout(pad=0)
            plt.savefig(output_png_path, bbox_inches='tight', pad_inches=0, transparent=True)
            plt.close(fig)

            # Generar leyenda
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
        
        print(f"Generada: {os.path.basename(output_png_path)}")
        print(f"Generada: {os.path.basename(output_legend_path)}")

        return {
            "url": relative_url,
            "legend_url": relative_legend_url,
            "timestamp": now_utc.isoformat(),
            "cached": False
        }

    except Exception as e:
        print(f" Error: {str(e)}")
        return {"error": f"Error al procesar imagen satelital: {str(e)}"}
