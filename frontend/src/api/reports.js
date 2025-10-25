const API_URL = '/api';

export const generateReport = async (lat, lon) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No se encontró token de autenticación.');
    }

    try {
        const response = await fetch(`${API_URL}/meteorologist/generate-report?lat=${lat}&lon=${lon}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            // Si la respuesta no es OK, el cuerpo puede contener un error en JSON
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el servidor al generar el reporte');
        }

        // El cuerpo de la respuesta es el blob del PDF
        const blob = await response.blob();

        // Crear una URL para el blob
        const url = window.URL.createObjectURL(blob);
        
        // Crear un enlace temporal para iniciar la descarga
        const link = document.createElement('a');
        link.href = url;
        
        // Extraer el nombre del archivo de los encabezados de respuesta
        const contentDisposition = response.headers.get('content-disposition');
        let fileName = 'reporte.pdf'; // Nombre por defecto
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch && fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
            }
        }
        
        link.setAttribute('download', fileName);
        
        // Añadir, simular clic y remover el enlace
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        // Limpiar la URL del objeto
        window.URL.revokeObjectURL(url);

        return { success: true };

    } catch (error) {
        // Manejar errores de red u otros
        if (error.message === 'Failed to fetch') {
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }
        // Re-lanzar el error para que el componente de UI lo pueda manejar
        throw error;
    }
};