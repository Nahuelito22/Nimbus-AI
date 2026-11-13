"""Chequeo de entorno previo al hackathon: confirma acceso a datos NASA.

No contiene lógica de ningún desafío; solo verifica que las cuentas y las
librerías funcionan antes de llegar al evento.

Uso:
    pip install -r requirements-hackathon.txt
    python tools/check_earthdata.py
"""
import sys

import requests

MENDOZA = {"lat": -32.89, "lon": -68.84}


def check_power():
    """NASA POWER no requiere cuenta: sirve para probar la conexión."""
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "parameters": "T2M",
        "community": "AG",
        "latitude": MENDOZA["lat"],
        "longitude": MENDOZA["lon"],
        "start": "20240101",
        "end": "20240103",
        "format": "JSON",
    }
    r = requests.get(url, params=params, timeout=60)
    r.raise_for_status()
    t2m = r.json()["properties"]["parameter"]["T2M"]
    print(f"OK  NASA POWER respondió ({len(t2m)} días de T2M)")


def check_earthaccess():
    """Earthdata Login: pide usuario y contraseña la primera vez y los guarda en ~/.netrc."""
    import earthaccess

    earthaccess.login(strategy="interactive", persist=True)
    results = earthaccess.search_data(
        short_name="GPM_3IMERGDF",
        bounding_box=(-70.5, -37.5, -66.5, -32.0),
        temporal=("2024-01-01", "2024-01-01"),
        count=1,
    )
    if not results:
        raise RuntimeError("La búsqueda en CMR no devolvió resultados")
    print(f"OK  Earthdata Login y búsqueda CMR ({len(results)} granulo de GPM IMERG)")


if __name__ == "__main__":
    failures = 0
    for check in (check_power, check_earthaccess):
        try:
            check()
        except Exception as e:  # el objetivo es reportar todo, no frenar en el primer fallo
            failures += 1
            print(f"ERR {check.__name__}: {e}")
    sys.exit(1 if failures else 0)
