# src/api/clima.py
import requests  # Importa la librería requests para hacer peticiones HTTP

# URLs de las APIs que vamos a usar
GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"  # API para convertir nombre de ciudad a coordenadas
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"  # API para obtener el pronóstico del tiempo
IP_API_BASE = "http://ip-api.com/json/"  # API para obtener ubicación basada en dirección IP

def _get_json(url, params=None, timeout=8):
    """
    Función interna para hacer peticiones HTTP y obtener respuestas en formato JSON.
    Args:
        url: La URL a la que hacer la petición
        params: Parámetros para la consulta (opcional)
        timeout: Tiempo máximo de espera en segundos (por defecto 8)
    Returns:
        Diccionario con la respuesta JSON o un diccionario de error si falla
    """
    try:
        r = requests.get(url, params=params, timeout=timeout)  # Hace la petición GET
        r.raise_for_status()  # Lanza excepción si el status code es de error (4xx o 5xx)
        return r.json()  # Convierte la respuesta a formato JSON y la retorna
    except requests.RequestException as e:
        return {"error": f"request error: {e}"}  # Si hay error, retorna diccionario con mensaje de error

def geocode_city(city_name):
    """
    Convierte un nombre de ciudad en coordenadas geográficas (latitud y longitud).
    Args:
        city_name: Nombre de la ciudad a buscar (ej: "Mendoza")
    Returns:
        Diccionario con lat, lon, name y country, o diccionario de error si falla
    """
    j = _get_json(GEOCODE_URL, params={"name": city_name, "count": 1, "language": "es"})  # Busca la ciudad
    if "error" in j:  # Si hubo error en la petición
        return {"error": j["error"]}
    if not j.get("results"):  # Si no se encontraron resultados para la ciudad
        return {"error": f"Ciudad '{city_name}' no encontrada"}
    res = j["results"][0]  # Toma el primer resultado de la búsqueda
    return {"lat": res["latitude"], "lon": res["longitude"], "name": res.get("name"), "country": res.get("country")}

def get_weather_by_coords(lat, lon):
    """
    Obtiene el pronóstico del tiempo para unas coordenadas específicas.
    Args:
        lat: Latitud
        lon: Longitud
    Returns:
        Diccionario con información del clima o error si falla
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": True,  # Solicita datos del clima actual
        "timezone": "auto"  # Detecta la zona horaria automáticamente
    }
    # ELIMINADO: parámetros hourly_fields ya que solo queremos datos actuales
    
    j = _get_json(WEATHER_URL, params=params)  # Obtiene datos del clima
    if "error" in j:  # Si hubo error
        return {"error": j["error"]}
    
    resp = {  # Construye respuesta con los datos más importantes
        "latitude": j.get("latitude"),
        "longitude": j.get("longitude"),
        "timezone": j.get("timezone"),
        "current_weather": j.get("current_weather")  # Datos del clima actual (temperatura, viento, etc.)
    }
    
    # ELIMINADO: filtrado de datos horarios ya que no los solicitamos
    
    return resp

def get_clima_ciudad(city_name):
    """
    Función principal: Obtiene el clima para una ciudad por su nombre.
    Args:
        city_name: Nombre de la ciudad (ej: "Mendoza")
    Returns:
        Diccionario completo con información de ubicación y clima, o error
    """
    geo = geocode_city(city_name)  # Primero obtiene las coordenadas de la ciudad
    if "error" in geo:  # Si falla la geocodificación
        return {"error": geo["error"]}
    
    # CAMBIO IMPORTANTE: Eliminado hourly_fields - solo obtenemos datos actuales
    weather = get_weather_by_coords(geo["lat"], geo["lon"])  # Sin hourly_fields
    
    if "error" in weather:  # Si falla la obtención del clima
        return {"error": weather["error"]}
    
    return {  # Retorna toda la información combinada
        "source": "geocoding",  # Indica que se usó geocodificación por nombre de ciudad
        "city": geo.get("name") or city_name,  # Nombre de la ciudad (usa el de la API o el original)
        "country": geo.get("country"),  # País
        "lat": geo.get("lat"),  # Latitud
        "lon": geo.get("lon"),  # Longitud
        "weather": weather  # Datos del clima (solo current_weather)
    }

def get_clima_by_ip(ip=None):
    """
    Obtiene el clima basado en la ubicación de una dirección IP.
    Args:
        ip: Dirección IP (si es None, usa la IP del cliente que hace la petición)
    Returns:
        Diccionario con información de ubicación y clima, o error
    """
    url = IP_API_BASE + (ip if ip else "")  # Construye la URL: con IP específica o vacía para IP actual
    j = _get_json(url)  # Obtiene información de geolocalización por IP
    if "error" in j:  # Si hubo error en la petición
        return {"error": j["error"]}
    
    # ip-api devuelve {"status":"fail", "message": "..."} cuando falla
    if j.get("status") != "success":  # Si la API reporta fallo
        return {"error": j.get("message") or "ip-api falló al geolocalizar"}
    
    lat = j.get("lat")  # Extrae latitud
    lon = j.get("lon")  # Extrae longitud
    if lat is None or lon is None:  # Si no vienen coordenadas
        return {"error": "ip-api no devolvió coordenadas para la IP"}
    
    # CAMBIO IMPORTANTE: Eliminado hourly_fields - solo obtenemos datos actuales
    weather = get_weather_by_coords(lat, lon)  # Sin hourly_fields
    
    if "error" in weather:  # Si falla la obtención del clima
        return {"error": weather["error"]}
    
    return {  # Retorna toda la información combinada
        "source": "ip-api",  # Indica que se usó geolocalización por IP
        "ip": j.get("query"),  # Dirección IP usada
        "city": j.get("city"),  # Ciudad
        "region": j.get("regionName"),  # Región/Provincia
        "country": j.get("country"),  # País
        "lat": lat,  # Latitud
        "lon": lon,  # Longitud
        "weather": weather  # Datos del clima (solo current_weather)
    }