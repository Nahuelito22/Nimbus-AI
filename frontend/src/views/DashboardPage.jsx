import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Corrección del ícono de Leaflet ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- Componente Gauge (velocímetro) ---
const Gauge = ({ probability }) => {
  const percentage = Math.round(probability * 100);
  const offset = 283 - (283 * percentage) / 100;
  let strokeColor = '#3b82f6';
  if (percentage > 50) strokeColor = '#f97316';
  if (percentage > 75) strokeColor = '#ef4444';

  return (
    <div className="relative w-48 h-48 mx-auto mb-4">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          id="gauge-progress"
          cx="50" cy="50" r="45" fill="none"
          stroke={strokeColor} strokeWidth="10"
          strokeDasharray="283" strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
        <circle cx="50" cy="50" r="30" fill="#f9fafb" />
        <text x="50" y="50" textAnchor="middle" dy="7" fontSize="16" fontWeight="bold">
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

// --- Componente para eventos del mapa ---
function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// --- Componente Principal del Dashboard ---
function DashboardPage() {
  // Estados para la predicción de granizo
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para el mapa
  const [coords, setCoords] = useState({ lat: -32.8895, lon: -68.8458 });

  // Estados para el radar
  const [band, setBand] = useState(13);
  const [radarImageUrl, setRadarImageUrl] = useState('https://via.placeholder.com/600x400.png/111827/FFFFFF?text=Radar+GOES-19');
  const [radarIsLoading, setRadarIsLoading] = useState(false);
  const [radarError, setRadarError] = useState(null);

  // Función para predicción de granizo
  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const response = await fetch(`http://localhost:5000/api/main-prediction?lat=${coords.lat}&lon=${coords.lon}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
      }
      const data = await response.json();
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

  // Placeholder para el mapa mientras carga
  const MapPlaceholder = (
    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
      <p>Cargando mapa...</p>
    </div>
  );

  // Función para buscar imagen del radar
  const handleFetchRadarImage = async () => {
    setRadarIsLoading(true);
    setRadarError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/satellite-image?band=${band}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo cargar la imagen del radar.');
      }
      const data = await response.json();
      setRadarImageUrl(data.url);
    } catch (err) {
      setRadarError(err.message);
      setRadarImageUrl('https://via.placeholder.com/600x400.png/111827/FFFFFF?text=Error+al+cargar+radar');
    } finally {
      setRadarIsLoading(false);
    }
  };

  // Cargar imagen del radar al iniciar
  useEffect(() => {
    handleFetchRadarImage();
  }, []);

  return (
    <div className="p-6 bg-gray-50">
      {/* --- Grid Principal: Mapa y Predicción --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna del Mapa */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Mapa de Mendoza</h2>
          <div id="map-container" className="h-96 rounded-lg z-0">
            <MapContainer
              center={[coords.lat, coords.lon]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              placeholder={MapPlaceholder}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lon]}>
                <Popup>Ubicación seleccionada para la predicción.</Popup>
              </Marker>
              <MapEvents onMapClick={handleMapClick} />
            </MapContainer>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              id="predict-btn"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition disabled:bg-gray-400"
              onClick={handlePredict}
              disabled={isLoading}
            >
              {isLoading ? 'Prediciendo...' : 'Predecir Granizo en la Ubicación'}
            </button>
          </div>
        </div>

        {/* Panel de Resultados de Predicción */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Resultado de Predicción</h2>
          <div className="text-center">
            {isLoading && <p>Obteniendo predicción...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {prediction ? (
              <>
                <Gauge probability={prediction.probabilidad_granizo} />
                <div className={`p-3 rounded-md ${prediction.alerta_sugerida === 'Sí' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
                  <p className="font-semibold">Alerta Sugerida: <span>{prediction.alerta_sugerida}</span></p>
                </div>
              </>
            ) : (
              !isLoading && <p className="text-gray-500">Haz clic en el mapa para seleccionar una ubicación y luego presiona "Predecir".</p>
            )}
          </div>
        </div>
      </div>

      {/* --- Grid Secundario: Noticias y Radar --- */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de Noticias */}
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Noticias Meteorológicas</h2>
            <div className="space-y-4">
                <div className="border-b pb-4">
                    <h3 className="font-bold text-lg mb-2">Tormentas severas en el este de Mendoza</h3>
                    <p className="text-gray-600 mb-3 text-sm">Se esperan fuertes lluvias y posible granizo en las próximas horas...</p>
                    <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">Leer más</a>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Nueva tecnología en predicción de granizo</h3>
                    <p className="text-gray-600 mb-3 text-sm">Científicos desarrollan modelos más precisos para predecir granizo...</p>
                    <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">Leer más</a>
                </div>
            </div>
        </div>

        {/* Sección de Radar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Radar Satelital GOES-19</h2>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">Banda:</label>
                    <select 
                      id="band-select" 
                      className="px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={band}
                      onChange={(e) => setBand(e.target.value)}
                    >
                        <option value="13">Banda 13 (Infrarroja)</option>
                        <option value="2">Banda 2 (Visible)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">Paleta:</label>
                    <select id="palette-select" className="px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="inferno">Inferno</option>
                        <option value="viridis">Viridis</option>
                        <option value="plasma">Plasma</option>
                    </select>
                </div>
                <button 
                  id="refresh-radar" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md self-end disabled:bg-gray-400"
                  onClick={handleFetchRadarImage}
                  disabled={radarIsLoading}
                >
                  {radarIsLoading ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>
            <div className="border rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center min-h-[200px]">
              {radarError && !radarIsLoading && <p className="text-red-400 p-4">{radarError}</p>}
              {radarIsLoading ? (
                <p className="text-white">Buscando imagen satelital más reciente...</p>
              ) : (
                <img id="radar-image" src={radarImageUrl} alt="Radar GOES-19" className="w-full h-auto" />
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
