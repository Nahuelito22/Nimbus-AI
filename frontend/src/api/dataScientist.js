const API_URL = import.meta.env.VITE_API_URL + '/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const getHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Ocurrió un error en la solicitud a la API.');
  }
  return response.json();
};

/**
 * Obtiene las opciones de filtros (estaciones, rango de fechas).
 */
export const getFilterOptions = () => {
  return fetch(`${API_URL}/filters`, { headers: getHeaders() }).then(handleResponse);
};

/**
 * Obtiene las primeras filas del dataset.
 */
export const getDataHead = () => {
  return fetch(`${API_URL}/head`, { headers: getHeaders() }).then(handleResponse);
};

/**
 * Obtiene los datos filtrados para la tabla.
 */
export const getFilteredData = (filters) => {
  return fetch(`${API_URL}/query`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(filters),
  }).then(handleResponse);
};

/**
 * Descarga los datos filtrados como un archivo CSV.
 */
export const downloadFilteredData = async (filters) => {
  try {
    const response = await fetch(`${API_URL}/download-filtered-csv`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo generar el archivo CSV.');
    }

    // Manejar el caso donde no hay datos para descargar
    if (response.headers.get('Content-Type').includes('application/json')) {
      const result = await response.json();
      alert(result.message || 'No hay datos para los filtros seleccionados.');
      return;
    }

    // Procesar la descarga del archivo
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'datos_filtrados.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error('Error al descargar los datos filtrados:', err);
    throw err; // Re-lanzar para que el componente pueda manejarlo
  }
};