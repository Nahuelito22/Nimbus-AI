import boto3
from botocore import UNSIGNED
from botocore.config import Config
from datetime import datetime, timedelta, timezone

BUCKET_NAME = 'noaa-goes19'
PRODUCT_NAME = 'ABI-L2-CMIPF' # Full Disk

def get_latest_goes_image_url(band: int):
    """
    Encuentra la URL pre-firmada de la imagen más reciente del satélite GOES-19 para una banda específica.

    Args:
        band: El número de la banda a buscar (ej: 13).

    Returns:
        Un diccionario con la URL de la imagen y la hora del archivo, o un diccionario de error.
    """
    try:
        s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
        now_utc = datetime.now(timezone.utc)
        
        # Busca en las últimas 4 horas hasta encontrar un archivo
        for i in range(4):
            search_time = now_utc - timedelta(hours=i)
            prefix = f"{PRODUCT_NAME}/{search_time.year}/{search_time.timetuple().tm_yday:03d}/{search_time.hour:02d}/"
            
            response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
            
            if 'Contents' in response:
                # Filtra por la banda correcta (ej: M6C13 para banda 13)
                band_str = f'C{band:02d}'
                
                # Encuentra el archivo más reciente en la lista que corresponde a la banda
                for file in reversed(response['Contents']):
                    if band_str in file['Key']:
                        file_key = file['Key']
                        
                        # Genera una URL pre-firmada que expira en 15 minutos
                        presigned_url = s3.generate_presigned_url(
                            'get_object',
                            Params={'Bucket': BUCKET_NAME, 'Key': file_key},
                            ExpiresIn=900
                        )
                        
                        return {
                            "url": presigned_url,
                            "file_key": file_key,
                            "timestamp": file['LastModified'].isoformat()
                        }

        return {"error": "No se encontraron imágenes satelitales recientes para la banda especificada."}

    except Exception as e:
        return {"error": f"Error al conectar con AWS S3: {str(e)}"}
