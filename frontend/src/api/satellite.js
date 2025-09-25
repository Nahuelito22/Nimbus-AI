const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getSatelliteImage = async (band, palette) => {
  try {
    const response = await fetch(`${API_URL}/satellite-image?band=${band}&palette=${palette}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'No se pudo cargar la imagen del radar.');
    }
    
    const data = await response.json();
    console.log('Respuesta de la API:', data);
    return data;
  } catch (err) {
    console.error('Error en getSatelliteImage:', err);
    throw err;
  }
};