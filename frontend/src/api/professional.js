const API_URL = import.meta.env.VITE_API_URL;

export const getPredictionWithDetails = async (coords) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No se encontró token de autenticación.');
  }

  const params = new URLSearchParams();
  params.append('lat', coords.lat);
  params.append('lon', coords.lon);

  const url = `${API_URL}/meteorologist/predict-with-details?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo obtener la predicción detallada.');
    }

    return response.json();
  } catch (err) {
    console.error('Error in getPredictionWithDetails:', err);
    throw err;
  }
};