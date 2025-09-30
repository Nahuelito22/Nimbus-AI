const API_URL = 'http://localhost:5000/api';

/**
 * Obtiene todos los usuarios del sistema.
 * Requiere un token de administrador.
 */
export const getAllUsers = async () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No se encontró token de autenticación.');
  }

  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Error al obtener la lista de usuarios.');
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor.');
    }
    throw error;
  }
};