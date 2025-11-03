import React from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordenadas aproximadas de Mendoza
const mendozaPosition = [-32.8908, -68.8272];

const RiskMap = ({ riskZones }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mapa de Zonas de Riesgo</h2>
      <div className="h-96 w-full rounded-md" style={{ height: '600px' }}>
        <MapContainer center={mendozaPosition} zoom={9} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {riskZones && riskZones.length > 0 ? (
            riskZones.map(zone => (
              <Polygon key={zone.name} pathOptions={{ color: zone.color, fillOpacity: 0.5 }} positions={zone.bounds}>
                <Tooltip sticky>
                  <strong>{zone.name}</strong><br />
                  Probabilidad: {zone.probability}%
                </Tooltip>
              </Polygon>
            ))
          ) : (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
              <p className="text-gray-500 bg-white p-4 rounded-md shadow-lg">No hay zonas de riesgo definidas para mostrar.</p>
            </div>
          )}

        </MapContainer>
      </div>
    </div>
  );
};

export default RiskMap;

