const API_URL = '/api';

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

    const url = `${API_URL}/satellite-image?${params.toString()}`;
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

    // La respuesta del backend ya debería ser un JSON con las URLs en base64
    // o rutas relativas que el proxy manejará.
    return response.json();

  } catch (err) {
    console.error('Error en getSatelliteImage:', err);
    throw err;
  }
};
