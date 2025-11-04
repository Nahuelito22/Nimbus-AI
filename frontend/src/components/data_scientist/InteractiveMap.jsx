import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Estilos para los íconos de los marcadores
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

function InteractiveMap({ stations, onSelectionChange }) {
  const [selectedStations, setSelectedStations] = useState(new Set());

  const handleMarkerClick = (stationName) => {
    const newSelection = new Set(selectedStations);
    if (newSelection.has(stationName)) {
      newSelection.delete(stationName);
    } else {
      newSelection.add(stationName);
    }
    setSelectedStations(newSelection);
  };

  useEffect(() => {
    // Notificar al componente padre cuando la selección cambie
    onSelectionChange(Array.from(selectedStations));
  }, [selectedStations, onSelectionChange]);

  // Coordenadas del centro de Mendoza
  const mapCenter = [-34.6, -68.5];

  return (
    <MapContainer center={mapCenter} zoom={7} style={{ height: '400px', width: '100%' }} className="rounded-lg">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stations.map(station => (
        <Marker 
          key={station.station_name}
          position={[station.latitude, station.longitude]}
          icon={selectedStations.has(station.station_name) ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => handleMarkerClick(station.station_name),
          }}
        >
          <Popup>
            {station.station_name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default InteractiveMap;
