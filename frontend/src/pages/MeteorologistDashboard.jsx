import React, { useState } from 'react';
import SatelliteViewer from '../components/dashboard/SatelliteViewer';
import WeatherDisplay from '../components/dashboard/WeatherDisplay';
import InstabilityIndices from '../components/dashboard/InstabilityIndices';
import { generateReport } from '../api/reports'; // Importar la función de la API

function MeteorologistDashboard() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            // Coordenadas fijas para Mendoza (temporalmente)
            const lat = -32.89;
            const lon = -68.84;
            
            await generateReport(lat, lon);

        } catch (err) {
            setError(err.message || 'Ocurrió un error al generar el reporte.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard del Meteorólogo</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Datos Climáticos y Satélite */}
                <div className="lg:col-span-2 space-y-8">
                    <WeatherDisplay />
                    
                    <InstabilityIndices />

                    <SatelliteViewer /> 
                </div>

                {/* Columna Derecha: Generación de Reportes y Herramientas */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Herramientas</h2>
                        
                        <div className="space-y-4">
                            <button 
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-300 ease-in-out"
                            >
                                {isGenerating ? 'Generando Reporte...' : 'Generar Reporte PDF'}
                            </button>
                            {error && (
                                <div className="text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 text-center mt-2">
                                El reporte se generará para la ubicación por defecto (Mendoza).
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MeteorologistDashboard;
