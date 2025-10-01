const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Base del backend (quita el /api si está presente)
const BACKEND_BASE = API_URL.replace(/\/api\/?$/, '');

export const getSatelliteImage = async (band, palette, opts = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('band', band);
    params.append('palette', palette || 'inferno');

    if (opts.forceRefresh) params.append('force_refresh', 'true');

    if (opts.showMarker) {
      params.append('show_marker', 'true');
      if (typeof opts.lat === 'number' && typeof opts.lon === 'number') {
        params.append('lat', String(opts.lat));
        params.append('lon', String(opts.lon));
      }
    } else {
      params.append('show_marker', 'false');
    }

    const url = `${API_URL.replace(/\/$/, '')}/satellite-image?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        /* ignore parse error */
      }
      throw new Error(errorData.error || 'No se pudo cargar la imagen del radar.');
    }

    const data = await response.json();
    console.log('Respuesta de la API (satellite):', data);

    // Normalizar la respuesta para que el frontend siempre reciba:
    // { url, legend_url, cached, timestamp, error }
    const normalized = {
      url: null,
      legend_url: null,
      cached: Boolean(data.cached),
      timestamp: data.timestamp || null,
      error: data.error || null
    };

    // 1) si el backend ya nos devolvió `url`, úsala
    if (data.url) {
      normalized.url = data.url;
    }

    // 2) si el backend devolvió `image` como data-uri (base64), úsala
    if (!normalized.url && data.image) {
      normalized.url = data.image;
    }

    // 3) si el backend devolvió una ruta relativa (ej. "/static/..."), convertirla a absoluta hacia el backend
    //    (evita que el navegador la pida al dev server del frontend)
    if (normalized.url && typeof normalized.url === 'string' && normalized.url.startsWith('/')) {
      normalized.url = BACKEND_BASE + normalized.url;
    }

    // 4) leyenda: puede llegar en legend_url o legend (o legend como datauri)
    if (data.legend_url) {
      normalized.legend_url = data.legend_url;
    } else if (data.legend) {
      normalized.legend_url = data.legend;
    }

    if (normalized.legend_url && typeof normalized.legend_url === 'string' && normalized.legend_url.startsWith('/')) {
      normalized.legend_url = BACKEND_BASE + normalized.legend_url;
    }

    // Si por algún motivo no hay url pero sí error, pasarlo
    if (!normalized.url && data.error) {
      normalized.error = data.error;
    }

    return normalized;
  } catch (err) {
    console.error('Error en getSatelliteImage:', err);
    throw err;
  }
};
