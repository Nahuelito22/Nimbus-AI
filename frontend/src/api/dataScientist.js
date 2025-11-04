const API_URL = '/api/ds'; // Base URL for Data Scientist endpoints

const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }
  return token;
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json', // Default content type
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Ocurrió un error en la solicitud a la API.');
  }

  // Para send_file, la respuesta puede no ser JSON
  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return response.json();
  }
  return response; // Devolver la respuesta completa para otros tipos de contenido
};

/**
 * Obtiene las opciones de filtros (estaciones, rango de fechas).
 */
export const getFilterOptions = () => {
  return fetchWithAuth(`${API_URL}/filters`);
};

/**
 * Obtiene las primeras filas del dataset.
 */
export const getDataHead = () => {
  return fetchWithAuth(`${API_URL}/head`);
};

/**
 * Obtiene los datos filtrados desde el backend.
 * @param {object} filters - El objeto con los filtros a aplicar.
 */
export const getFilteredData = (filters) => {
  return fetchWithAuth(`${API_URL}/query`, {
    method: 'POST',
    body: JSON.stringify(filters),
  });
};
