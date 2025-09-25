import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getHailPrediction } from '../api/predictions';
import { getSatelliteImage } from '../api/satellite';
import Gauge from '../components/dashboard/Gauge';
import NewsSection from '../components/dashboard/NewsSection';
import PredictionPanel from '../components/dashboard/PredictionPanel';
import RadarSection from '../components/dashboard/RadarSection';
import MapComponent from '../components/dashboard/MapComponent';

// --- Corrección del ícono de Leaflet ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});





// --- Componente Principal del Dashboard ---
function DashboardPage() {
  // Estados para la predicción de granizo
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para el mapa
  const [coords, setCoords] = useState({ lat: -32.8895, lon: -68.8458 });

  

  // Función para predicción de granizo
  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const data = await getHailPrediction(coords);
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar coordenadas con clic en mapa
  const handleMapClick = (latlng) => {
    setCoords({ lat: latlng.lat, lon: latlng.lng });
  };

  

  

  return (
    <div className="p-6 bg-gray-50">
      {/* --- Grid Principal: Mapa y Predicción --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MapComponent 
          coords={coords} 
          isLoading={isLoading} 
          onMapClick={handleMapClick} 
          onPredict={handlePredict} 
        />

        <PredictionPanel isLoading={isLoading} error={error} prediction={prediction} />
      </div>

      {/* --- Grid Secundario: Noticias y Radar --- */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <NewsSection />

        <RadarSection />
      </div>
    </div>
  );
}

export default DashboardPage;
