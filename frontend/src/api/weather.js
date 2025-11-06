const API_URL = import.meta.env.VITE_API_URL || '/api';

export const getWeatherByCity = async (cityName) => {
    try {
        const url = `${API_URL}/meteo/ciudad/${cityName}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Intenta obtener detalles del error
            throw new Error(errorData.error || 'No se pudo obtener el clima de la ciudad.');
        }

        return response.json();
    } catch (err) {
        console.error(`Error in getWeatherByCity for ${cityName}:`, err);
        throw err;
    }
};

export const getDashboardWeatherData = async ({ lat, lon }) => {
  try {
    const params = new URLSearchParams();
    params.append('lat', lat);
    params.append('lon', lon);

    const url = `${API_URL}/dashboard/weather-data?${params.toString()}`;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado.');
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudieron cargar los datos del dashboard.');
    }

    return response.json();

  } catch (err) {
    console.error('Error in getDashboardWeatherData:', err);
    throw err;
  }
};