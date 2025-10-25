import React, { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SatelliteViewer from '../components/dashboard/SatelliteViewer';
import WeatherDisplay from '../components/dashboard/WeatherDisplay';
import InstabilityIndices from '../components/dashboard/InstabilityIndices';
import MapComponent from '../components/dashboard/MapComponent'; // Importar el mapa
import { generateReport } from '../api/reports';

// --- Corrección del ícono de Leaflet ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MeteorologistDashboard() {
    // --- Estados para el Mapa y Reportes ---
    const [coords, setCoords] = useState({ lat: -32.89, lon: -68.84 });
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportError, setReportError] = useState(null);

    // --- Manejadores ---
    const handleMapClick = (latlng) => {
        setCoords({ lat: latlng.lat, lon: latlng.lng });
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setReportError(null);
        try {
            // Usar las coordenadas del estado del mapa
            await generateReport(coords.lat, coords.lon);
        } catch (err) {
            setReportError(err.message || 'Ocurrió un error al generar el reporte.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard del Meteorólogo</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna Izquierda: Mapa y Herramientas */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="h-96 bg-white rounded-lg shadow-md">
                         <MapComponent 
                            coords={coords} 
                            onMapClick={handleMapClick} 
                        />
                    </div>
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
                            {reportError && (
                                <div className="text-red-500 text-sm text-center">
                                    {reportError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Datos Climáticos y Satélite */}
                <div className="lg:col-span-2 space-y-8">
                    <WeatherDisplay coords={coords} />
                    <InstabilityIndices coords={coords} />
                    <SatelliteViewer coords={coords} /> 
                </div>

            </div>
        </div>
    );
}

export default MeteorologistDashboard;
