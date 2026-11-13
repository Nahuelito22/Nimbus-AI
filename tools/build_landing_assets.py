"""Genera los datos y las imágenes que muestra la landing a partir del repo.

Salidas:
  frontend/src/components/landing/data/landingData.js  (estadísticas + mapa SVG)
  frontend/public/landing/goes_*.jpg                    (recortes GOES-16 banda 13)

Uso (desde la raíz del repo, con el venv del proyecto):
  python tools/build_landing_assets.py
"""
import json
import os

import cv2
import numpy as np
import pandas as pd
import xarray as xr
from matplotlib import colors
from pyproj import Proj
from shapely.geometry import shape
from shapely.ops import unary_union

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET = os.path.join(ROOT, "data", "processed", "dataset_final_enriquecido.csv")
GEOJSON = os.path.join(ROOT, "data", "raw", "departamentos-mendoza.json")
SAMPLES = os.path.join(ROOT, "data", "raw", "imagenes_satelitales_muestra")
OUT_JS = os.path.join(ROOT, "frontend", "src", "components", "landing", "data", "landingData.js")
OUT_IMG = os.path.join(ROOT, "frontend", "public", "landing")

# Misma caja que usa el modelo para recortar las imágenes GOES (no la del mapa)
BBOX = {"lon_min": -70.5, "lon_max": -66.5, "lat_min": -37.5, "lat_max": -32.0}
MAP_W = 400
NOMBRES = {"MALARGUE, AR": "Malargüe", "SAN MARTIN, AR": "San Martín"}
MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]


def _map_bounds():
    """Límites reales de la provincia (con un margen), independientes de la caja GOES."""
    gj = json.load(open(GEOJSON, encoding="utf-8"))
    lon_min, lat_min, lon_max, lat_max = unary_union([shape(f["geometry"]) for f in gj["features"]]).bounds
    pad = 0.05
    return lon_min - pad, lat_min - pad, lon_max + pad, lat_max + pad


MAP_BOUNDS = _map_bounds()


def project(lon, lat):
    """Equirectangular corregida por coseno de la latitud media, en px de un SVG de MAP_W de ancho."""
    lon_min, lat_min, lon_max, lat_max = MAP_BOUNDS
    k = np.cos(np.radians((lat_min + lat_max) / 2))
    scale = MAP_W / ((lon_max - lon_min) * k)
    x = (lon - lon_min) * k * scale
    y = (lat_max - lat) * scale
    return round(float(x), 1), round(float(y), 1)


def map_height():
    return project(MAP_BOUNDS[0], MAP_BOUNDS[1])[1]


def _path(geom):
    """Geometría (Polygon o MultiPolygon, exteriores) a un atributo d de SVG."""
    polys = geom.geoms if geom.geom_type == "MultiPolygon" else [geom]
    return "".join("M" + "L".join(f"{x},{y}" for x, y in (project(lon, lat) for lon, lat in p.exterior.coords)) + "Z"
                   for p in polys)


def build_stats():
    df = pd.read_csv(DATASET, parse_dates=["date"])
    pos = df[df.granizo == 1]
    fechas = pos.drop_duplicates("date")

    por_mes = fechas.date.dt.month.value_counts().reindex(range(1, 13), fill_value=0)
    por_anio = fechas.date.dt.year.value_counts().reindex(range(2000, 2025), fill_value=0)

    estaciones = []
    coords = df.dropna(subset=["latitude", "longitude"]).groupby("station_name")[["latitude", "longitude"]].first()
    for nombre, n in pos.station_name.value_counts().items():
        lat, lon = coords.loc[nombre, "latitude"], coords.loc[nombre, "longitude"]
        x, y = project(lon, lat)
        estaciones.append({
            "nombre": NOMBRES.get(nombre, nombre.replace(", AR", "").title()),
            "eventos": int(n),
            "dias": int((df.station_name == nombre).sum()),
            "x": x, "y": y,
        })

    temporada = int(por_mes.loc[[11, 12, 1, 2]].sum())
    return {
        "resumen": {
            "filas": int(len(df)),
            "estaciones": int(df.station_name.nunique()),
            "fechasGranizo": int(len(fechas)),
            "filasGranizo": int(len(pos)),
            "desde": int(df.date.dt.year.min()),
            "hasta": int(df.date.dt.year.max()),
            "pctTemporada": round(100 * temporada / len(fechas)),
        },
        "porMes": [{"mes": MESES[m - 1], "eventos": int(por_mes[m])} for m in range(1, 13)],
        "porAnio": [{"anio": int(a), "eventos": int(n)} for a, n in por_anio.items()],
        "estaciones": estaciones,
    }


def build_map():
    """Contorno provincial relleno + límites departamentales como líneas.

    Los departamentos se simplifican por separado, así que sus bordes compartidos no coinciden
    exactamente; dibujarlos como líneas sobre un único contorno evita huecos y solapamientos.
    """
    gj = json.load(open(GEOJSON, encoding="utf-8"))
    deptos = [(f["properties"]["departamento"].title(), shape(f["geometry"])) for f in gj["features"]]
    tol = 0.004  # grados (~400 m): menos de medio píxel a 400 px de ancho
    provincia = unary_union([g for _, g in deptos]).simplify(tol, preserve_topology=True)
    return {
        "width": MAP_W,
        "height": map_height(),
        "provincia": _path(provincia),
        "departamentos": [{"nombre": n, "d": _path(g.simplify(tol, preserve_topology=True))} for n, g in deptos],
    }


def render_goes(nc_path, out_name):
    """Recorte de Mendoza con temperatura de brillo absoluta (no min-max), para que dos días sean comparables."""
    ds = xr.open_dataset(nc_path)
    p = ds.goes_imager_projection
    h = p.perspective_point_height
    proj = Proj(proj="geos", h=h, lon_0=p.longitude_of_projection_origin)
    x1, y1 = proj(BBOX["lon_min"], BBOX["lat_min"])
    x2, y2 = proj(BBOX["lon_max"], BBOX["lat_max"])
    ds["x"] = ds["x"] * h
    ds["y"] = ds["y"] * h
    bt = ds.sel(x=slice(x1, x2), y=slice(y2, y1))["CMI"].values.astype("float32")
    bt = cv2.resize(np.nan_to_num(bt, nan=300.0), (800, int(800 * bt.shape[0] / bt.shape[1])), interpolation=cv2.INTER_CUBIC)

    # Escala fija 190–310 K (infrarrojo realzado): superficie cálida = pizarra oscura,
    # nubes = gris claro, topes por debajo de ~-40 °C = hielo. Frío = claro, como en meteorología.
    norm = colors.Normalize(vmin=190, vmax=310)
    realzado = colors.LinearSegmentedColormap.from_list("nimbus_ir", [
        (0.00, "#7fe3f0"),  # 190 K, topes muy fríos
        (0.25, "#e9f6f7"),  # 220 K
        (0.40, "#c3cbcc"),  # 238 K
        (0.75, "#3d4a4f"),  # 280 K
        (1.00, "#10171a"),  # 310 K
    ])
    rgb = (realzado(norm(bt))[..., :3] * 255).astype("uint8")
    os.makedirs(OUT_IMG, exist_ok=True)
    cv2.imwrite(os.path.join(OUT_IMG, out_name), cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 82])
    return {"archivo": f"/landing/{out_name}", "btMin": round(float(np.min(bt)) - 273.15, 1)}


def main():
    stats = build_stats()
    stats["mapa"] = build_map()
    stats["goes"] = {
        "granizo": {**render_goes(os.path.join(SAMPLES, "2017-03-25_granizo", "2017-03-25_2000_UTC_C13.nc"), "goes_2017-03-25.jpg"),
                    "fecha": "25/03/2017", "hora": "20:00 UTC"},
        "sinGranizo": {**render_goes(os.path.join(SAMPLES, "2017-09-09_no_granizo", "2017-09-09_2000_UTC_C13.nc"), "goes_2017-09-09.jpg"),
                       "fecha": "09/09/2017", "hora": "20:00 UTC"},
    }
    os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)
    with open(OUT_JS, "w", encoding="utf-8", newline="\n") as f:
        f.write("// Generado por tools/build_landing_assets.py — no editar a mano.\n")
        f.write("const landingData = " + json.dumps(stats, ensure_ascii=False, indent=2) + ";\n\nexport default landingData;\n")
    print(json.dumps(stats["resumen"], ensure_ascii=False), stats["goes"]["granizo"]["btMin"], stats["goes"]["sinGranizo"]["btMin"])


if __name__ == "__main__":
    main()
