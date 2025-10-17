import React from 'react';
import SatelliteViewer from '../components/dashboard/SatelliteViewer';
import WeatherDisplay from '../components/dashboard/WeatherDisplay';
import InstabilityIndices from '../components/dashboard/InstabilityIndices';

function MeteorologistDashboard() {
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
                        <div className="bg-gray-200 h-48 flex items-center justify-center rounded-md">
                            <p className="text-gray-500">La generación de reportes se implementará aquí.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MeteorologistDashboard;
