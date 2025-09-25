const API_URL = 'http://localhost:5000/api';

export const getSatelliteImage = async (band) => {
  const response = await fetch(`${API_URL}/satellite-image?band=${band}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo cargar la imagen del radar.');
  }

  return data;
};
