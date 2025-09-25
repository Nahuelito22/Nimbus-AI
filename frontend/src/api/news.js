const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const fetchNews = async (category = 'clima') => {
  try {
    // El endpoint en Flask es /api/noticias/<categoria>
    const response = await fetch(`${API_URL}/api/noticias/${category}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // El endpoint de Flask devuelve un objeto { noticias: [...] }
    return data.noticias;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
};
