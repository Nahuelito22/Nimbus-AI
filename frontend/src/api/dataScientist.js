const API_URL = '/api/ds'; // Base URL for Data Scientist endpoints

const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Token de autenticación no encontrado.');
  }
  return token;
};

/**
 * Obtiene las opciones de filtros para el dashboard del científico de datos.
 */
export const getDataScientistFilters = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/filters`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudieron cargar las opciones de filtros.');
    }

    return response.json();
  } catch (err) {
    console.error('Error in getDataScientistFilters:', err);
    throw err;
  }
};

/**
 * Obtiene los datos filtrados desde el backend.
 * @param {object} filters - El objeto con los filtros a aplicar.
 */
export const getFilteredData = async (filters) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudieron obtener los datos filtrados.');
    }

    return response.json();
  } catch (err) {
    console.error('Error in getFilteredData:', err);
    throw err;
  }
};

/**
 * Envía datos al modelo para obtener una predicción.
 * @param {object} data - Los datos de entrada para el modelo.
 */
export const getPrediction = async (data) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo obtener la predicción del modelo.');
    }

    return response.json();
  } catch (err) {
    console.error('Error in getPrediction:', err);
    throw err;
  }
};
