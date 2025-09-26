const API_URL = 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Error al iniciar sesión.');
    }

    return data;
  } catch (error) {
    // Manejar errores de red
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Manejar diferentes tipos de errores
      if (response.status === 400 && data.msg.includes('ya está registrado')) {
        throw new Error('El email ya está registrado. Por favor, inicia sesión o usa otro email.');
      } else if (response.status === 400 && data.msg.includes('requeridos')) {
        throw new Error('Por favor, completa todos los campos requeridos.');
      } else {
        throw new Error(data.msg || 'Error al registrar el usuario.');
      }
    }

    // Si el registro es exitoso y se generó un código de verificación (para roles profesionales)
    if (data.verification_code) {
      console.log('Código de verificación:', data.verification_code);
      // Aquí podrías mostrar el código en la interfaz o enviarlo por email (aún no implementado)
    }

    return data;
  } catch (error) {
    // Si el error es de red o el servidor no responde
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
    }
    // Re-lanzar otros errores
    throw error;
  }
};