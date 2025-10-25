import React, { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SatelliteViewer from '../components/dashboard/SatelliteViewer';
import WeatherDisplay from '../components/dashboard/WeatherDisplay';
import InstabilityIndices from '../components/dashboard/InstabilityIndices';
import MapComponent from '../components/dashboard/MapComponent';
import PredictionAnalysis from '../components/dashboard/PredictionAnalysis'; // 1. Importar nuevo componente
import { generateReport } from '../api/reports';

// --- Corrección del ícono de Leaflet ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MeteorologistDashboard() {
    const [coords, setCoords] = useState({ lat: -32.89, lon: -68.84 });
    const [reportError, setReportError] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleMapClick = (latlng) => {
        setCoords({ lat: latlng.lat, lon: latlng.lng });
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setReportError(null);
        try {
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
            
            {/* 2. Nueva estructura de layout con dos filas */}
            <div className="space-y-8">

                {/* Fila Superior: Mapa y Predicción */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[500px] bg-white rounded-lg shadow-md">
                        <MapComponent 
                            coords={coords} 
                            onMapClick={handleMapClick}
                            showPredictButton={false}
                        />
                    </div>
                    <PredictionAnalysis 
                        coords={coords} 
                        onGenerateReport={handleGenerateReport}
                        isGeneratingReport={isGenerating}
                        reportError={reportError}
                    />
                </div>

                {/* Fila Inferior: Paneles de Datos */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <WeatherDisplay coords={coords} />
                    <InstabilityIndices coords={coords} />
                    <SatelliteViewer coords={coords} /> 
                </div>

            </div>
        </div>
    );
}

export default MeteorologistDashboard;
