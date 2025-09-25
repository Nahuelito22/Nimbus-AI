const API_URL = 'http://localhost:5000/api';

export const getHailPrediction = async (coords) => {
  const { lat, lon } = coords;
  const response = await fetch(`${API_URL}/main-prediction?lat=${lat}&lon=${lon}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al obtener la predicción.');
  }

  return data;
};
