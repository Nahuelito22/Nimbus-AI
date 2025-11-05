import React, { useState, useEffect } from 'react';
import { getKeepAliveStatus, toggleKeepAlive } from '../../api/admin';

function KeepAliveManager() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getKeepAliveStatus();
                setIsEnabled(data.is_enabled);
            } catch (err) {
                setError('No se pudo obtener el estado del servicio. Asegúrate de tener permisos de Superadmin.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();
    }, []);

    const handleToggle = async () => {
        try {
            const data = await toggleKeepAlive();
            setIsEnabled(data.is_enabled);
        } catch (err) {
            setError('Error al cambiar el estado del servicio.');
            console.error(err);
        }
    };

    if (isLoading) {
        return <div>Cargando configuración de Keep-Alive...</div>;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-bold text-white mb-2">Gestor Keep-Alive para Hugging Face</h3>
            <p className="text-gray-400 mb-4">
                Esta función envía una petición automática cada 45 horas al contenedor del modelo de IA en Hugging Face para evitar que se suspenda por inactividad.
            </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex items-center justify-between">
                <div className="text-white">
                    <span>Estado actual: </span>
                    <span className={`font-bold ${isEnabled ? 'text-green-400' : 'text-red-400'}`}>
                        {isEnabled ? 'Activado' : 'Desactivado'}
                    </span>
                </div>
                <button 
                    onClick={handleToggle}
                    className={`px-4 py-2 rounded font-semibold text-white transition-colors ${isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                    {isEnabled ? 'Desactivar' : 'Activar'}
                </button>
            </div>
        </div>
    );
}

export default KeepAliveManager;
