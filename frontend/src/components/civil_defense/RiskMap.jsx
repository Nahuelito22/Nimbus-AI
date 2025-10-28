import React from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordenadas aproximadas de Mendoza
const mendozaPosition = [-32.8908, -68.8272];

// Datos de ejemplo para las zonas de riesgo. Esto vendrá de la API.
const riskZones = [
  {
    name: 'Zona Roja',
    color: 'red',
    bounds: [
      [-33.0, -68.9],
      [-33.1, -68.9],
      [-33.1, -68.8],
      [-33.0, -68.8],
    ]
  },
  {
    name: 'Zona Naranja',
    color: 'orange',
    bounds: [
      [-32.8, -68.7],
      [-32.9, -68.7],
      [-32.9, -68.6],
      [-32.8, -68.6],
    ]
  }
];

const RiskMap = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mapa de Zonas de Riesgo</h2>
      <div className="h-96 w-full rounded-md" style={{ height: '600px' }}>
        <MapContainer center={mendozaPosition} zoom={9} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Placeholder para las zonas de riesgo */}
          {/* En el futuro, estos polígonos se generarán dinámicamente con datos de la API */}
          {riskZones.map(zone => (
            <Polygon key={zone.name} pathOptions={{ color: zone.color }} positions={zone.bounds} />
          ))}

        </MapContainer>
      </div>
    </div>
  );
};

export default RiskMap;
