const API_URL = import.meta.env.VITE_API_URL;

export const getHailPrediction = async (coords) => {
  const { lat, lon } = coords;

  // El backend espera las coordenadas como parámetros en la URL.
  const url = `${API_URL}/predict?lat=${lat}&lon=${lon}`;

  // La petición al backend es un GET, no un POST.
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Si el endpoint requiriera autenticación, se añadiría el token aquí.
      // Ejemplo: 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // El backend devuelve el error en una clave "error".
    const errorMessage = data.error || 'Error al obtener la predicción desde el backend.';
    throw new Error(errorMessage);
  }

  // La respuesta del backend ya es la respuesta final del modelo.
  return data;
};