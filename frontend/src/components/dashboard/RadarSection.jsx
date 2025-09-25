import React, { useState, useEffect } from 'react';
import { getSatelliteImage } from '../../api/satellite';

const RadarSection = () => {
  const [band, setBand] = useState(13);
  const [radarImageUrl, setRadarImageUrl] = useState('https://placehold.co/600x400/111827/FFFFFF?text=Radar+GOES-19');
  const [radarIsLoading, setRadarIsLoading] = useState(false);
  const [radarError, setRadarError] = useState(null);

  const handleFetchRadarImage = async () => {
    setRadarIsLoading(true);
    setRadarError(null);
    try {
      const data = await getSatelliteImage(band);
      setRadarImageUrl(data.url);
    } catch (err) {
      setRadarError(err.message);
      setRadarImageUrl('https://placehold.co/600x400/111827/FFFFFF?text=Error+al+cargar+radar');
    } finally {
      setRadarIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchRadarImage();
  }, []);

  return (
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
  );
};

export default RadarSection;
