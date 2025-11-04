import React, { useState, useEffect } from 'react';
import { getDiskUsage } from '../api/admin';

const DiskUsageMonitor = () => {
    const [diskUsage, setDiskUsage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDiskUsage = async () => {
        setLoading(true);
        try {
            const data = await getDiskUsage();
            setDiskUsage(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiskUsage();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <p className="text-center text-gray-500">Cargando datos de uso de disco...</p>;
        }

        if (error) {
            return <p className="text-center text-red-500">Error: {error}</p>;
        }

        if (!diskUsage) {
            return <p className="text-center text-gray-500">No se pudieron obtener los datos.</p>;
        }

        // Función para formatear la fecha de forma segura
        const formatDate = (fileInfo) => {
            if (!fileInfo || !fileInfo.date) return 'N/A';
            try {
                // Opciones para un formato más legible
                const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                return new Date(fileInfo.date).toLocaleDateString('es-ES', options);
            } catch (e) {
                return 'Fecha inválida';
            }
        };

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-blue-600">{diskUsage.total_size_mb} MB</p>
                    <p className="text-sm text-gray-600">Espacio Total Utilizado</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-blue-600">{diskUsage.file_count}</p>
                    <p className="text-sm text-gray-600">Nº de Imágenes</p>
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-800 truncate" title={diskUsage.newest_file?.name}>
                        {formatDate(diskUsage.newest_file)}
                    </p>
                    <p className="text-sm text-gray-600">Archivo Más Reciente</p>
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-800 truncate" title={diskUsage.oldest_file?.name}>
                        {formatDate(diskUsage.oldest_file)}
                    </p>
                    <p className="text-sm text-gray-600">Archivo Más Antiguo</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Monitor de Disco de Imágenes</h2>
                <button
                    onClick={fetchDiskUsage}
                    disabled={loading}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    Actualizar
                </button>
            </div>
            {renderContent()}
        </div>
    );
};

export default DiskUsageMonitor;
