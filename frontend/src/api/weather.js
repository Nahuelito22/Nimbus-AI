const API_URL = '/api';

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
