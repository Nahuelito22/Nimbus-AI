import React from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Coordenadas aproximadas de Mendoza
const mendozaPosition = [-32.8908, -68.8272];

const RiskMap = ({ riskZones, onManualZoneDrawn }) => {

  const handleOnCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon' || layerType === 'rectangle') {
      const coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
      // Cierra el polígono si no lo está
      if (coordinates.length > 2 && (coordinates[0][0] !== coordinates[coordinates.length - 1][0] || coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
          coordinates.push(coordinates[0]);
      }
      onManualZoneDrawn(coordinates);
      // Pequeño hack para evitar que la capa de dibujo se quede en el mapa después de crearla
      e.layer.remove();
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
          
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleOnCreate}
              draw={{
                rectangle: true,
                polygon: true,
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

            {riskZones && riskZones.length > 0 ? (
              riskZones.map(zone => (
                <Polygon key={zone.name} pathOptions={{ color: zone.color, fillOpacity: 0.5 }} positions={zone.bounds}>
                  <Tooltip sticky>
                    <strong>{zone.name}</strong><br />
                    {zone.isManual ? "(Alerta Manual)" : `Probabilidad: ${zone.probability}%`}
                  </Tooltip>
                </Polygon>
              ))
            ) : (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 401 }}>
                <p className="text-gray-500 bg-white p-4 rounded-md shadow-lg">No hay zonas de riesgo automáticas para mostrar. Puede crear una alerta manual.</p>
              </div>
            )}
          </FeatureGroup>

        </MapContainer>
      </div>
    </div>
  );
};

export default RiskMap;

