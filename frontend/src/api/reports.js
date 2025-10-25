import { getAuthenticatedApi } from './api';

export const generateReport = async (lat, lon) => {
    const api = getAuthenticatedApi();
    try {
        const response = await api.get('/meteorologist/generate-report', {
            params: {
                lat,
                lon
            },
            responseType: 'blob', // ¡Importante! Esperamos un archivo
        });

        // Crear una URL para el blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        
        // Crear un enlace temporal para iniciar la descarga
        const link = document.createElement('a');
        link.href = url;
        
        // Extraer el nombre del archivo de los encabezados de respuesta
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'reporte.pdf'; // Nombre por defecto
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
            }
        }
        
        link.setAttribute('download', fileName);
        
        // Añadir, simular clic y remover el enlace
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        return { success: true };

    } catch (error) {
        // Si el error es un blob, puede que contenga un mensaje de error en JSON
        if (error.response && error.response.data instanceof Blob) {
            const errorText = await error.response.data.text();
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || 'Error al generar el reporte');
        }
        throw new Error(error.response?.data?.error || error.message || 'Error desconocido al generar el reporte');
    }
};