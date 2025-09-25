import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

// --- Componente para eventos del mapa (interno a MapComponent) ---
function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// --- Placeholder para el mapa mientras carga ---
const MapPlaceholder = (
  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
    <p>Cargando mapa...</p>
  </div>
);

const MapComponent = ({ coords, isLoading, onMapClick, onPredict }) => {
  return (
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
          <MapEvents onMapClick={onMapClick} />
        </MapContainer>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          id="predict-btn"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition disabled:bg-gray-400"
          onClick={onPredict}
          disabled={isLoading}
        >
          {isLoading ? 'Prediciendo...' : 'Predecir Granizo en la Ubicación'}
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
