import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const mendozaPosition = [-32.8908, -68.8272];

const RiskMap = ({ riskZones, onManualZoneDrawn, drawKey }) => {
  const [showHelpMessage, setShowHelpMessage] = useState(true);

  const handleOnCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon' || layerType === 'rectangle') {
      const coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
      if (coordinates.length > 2 && (coordinates[0][0] !== coordinates[coordinates.length - 1][0] || coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
          coordinates.push(coordinates[0]);
      }
      onManualZoneDrawn(coordinates);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mapa de Zonas de Riesgo</h2>
      <div className="h-96 w-full rounded-md" style={{ height: '600px' }}>
        <MapContainer center={mendozaPosition} zoom={9} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <FeatureGroup key={drawKey}>
            <EditControl
              position="topright"
              onCreated={handleOnCreate}
              draw={{
                rectangle: { showArea: false }, // Soluciona el bug de readableArea
                polygon: { showArea: false },   // Previene el mismo bug en polígonos
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
              edit={{
                edit: false,
                remove: false
              }}
            />

            {riskZones.map((zone, index) => (
              <Polygon key={zone.name + index} pathOptions={{ color: zone.color, fillOpacity: 0.5 }} positions={zone.bounds}>
                <Tooltip sticky>
                  <strong>{zone.name}</strong><br />
                  {zone.isManual ? "(Alerta Manual)" : `Probabilidad: ${zone.probability}%`}
                </Tooltip>
              </Polygon>
            ))}
          </FeatureGroup>

          {riskZones.length === 0 && showHelpMessage && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white/80 p-4 rounded-md shadow-lg text-center">
                <button 
                  onClick={() => setShowHelpMessage(false)} 
                  className="absolute top-0 right-0 px-2 py-1 text-lg font-bold text-gray-600 hover:text-black"
                >
                  &times;
                </button>
                <p className="text-gray-600 mt-2">
                  No hay zonas de riesgo activas.<br/>Use las herramientas del mapa para crear una alerta manual.
                </p>
            </div>
          )}

        </MapContainer>
      </div>
    </div>
  );
};

export default RiskMap;

