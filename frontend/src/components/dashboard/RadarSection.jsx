import React, { useState, useEffect } from 'react';
import { getSatelliteImage } from '../../api/satellite';

const RadarSection = () => {
  const [band, setBand] = useState(13);
  const [palette, setPalette] = useState('inferno');
  const [radarImage, setRadarImage] = useState('');  // Ahora es un data URL
  const [legendImage, setLegendImage] = useState('');  // Ahora es un data URL
  const [radarIsLoading, setRadarIsLoading] = useState(false);
  const [radarError, setRadarError] = useState(null);

  const handleFetchRadarImage = async () => {
    setRadarIsLoading(true);
    setRadarError(null);
    try {
      const data = await getSatelliteImage(band, palette);
      if (data.image) {
        setRadarImage(data.image);
        setLegendImage(data.legend || '');
        console.log('Imagen recibida (base64):', data.image ? 'Sí' : 'No');
        console.log('Leyenda recibida (base64):', data.legend ? 'Sí' : 'No');
      } else {
        setRadarError(data.error || 'No se pudo cargar la imagen del radar.');
        setRadarImage('');
        setLegendImage('');
      }
    } catch (err) {
      setRadarError(err.message);
      setRadarImage('');
      setLegendImage('');
    } finally {
      setRadarIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchRadarImage();
  }, [band, palette]);

  // Explicación de colores según la paleta
  const getColorExplanation = () => {
    switch(palette) {
      case 'inferno':
        return (
          <p className="text-sm text-gray-600 text-center mt-2">
            <span className="text-purple-800 font-semibold">Morados</span>: Temperaturas muy frías 
            → <span className="text-yellow-500 font-semibold">Amarillos/Rojos</span>: Temperaturas cálidas
          </p>
        );
      case 'gray':
        return (
          <p className="text-sm text-gray-600 text-center mt-2">
            <span className="text-black font-semibold">Negros</span>: Temperaturas frías 
            → <span className="text-gray-400 font-semibold">Blancos</span>: Temperaturas cálidas
          </p>
        );
      default:
        return (
          <p className="text-sm text-gray-600 text-center mt-2">
            Paleta de colores para visualización de temperaturas
          </p>
        );
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Radar Satelital GOES-19</h2>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 mb-2 text-sm font-medium">Banda:</label>
          <select 
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            value={band}
            onChange={(e) => setBand(parseInt(e.target.value))}
          >
            <option value="13">Banda 13 (Infrarroja)</option>
            <option value="2">Banda 2 (Visible)</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 mb-2 text-sm font-medium">Paleta:</label>
          <select 
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            value={palette}
            onChange={(e) => setPalette(e.target.value)}
          >
            <option value="inferno">Inferno</option>
            <option value="viridis">Viridis</option>
            <option value="plasma">Plasma</option>
            <option value="gray">Normal (Escala de Grises)</option>
          </select>
        </div>
        
        <button 
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
        ) : radarImage ? (
          <img 
            id="radar-image" 
            src={radarImage} 
            alt="Radar GOES-19" 
            className="w-full h-auto" 
            onError={(e) => {
              console.error('Error al cargar la imagen:', e);
              e.target.src = 'https://placehold.co/600x400/111827/FFFFFF?text=Error+al+cargar+imagen';
            }}
          />
        ) : (
          <p className="text-white">No hay imagen disponible</p>
        )}
      </div>
      
      {legendImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-center">Leyenda de Temperatura</h3>
          <div className="flex justify-center items-center">
            <span className="text-sm mr-2">Frío</span>
            <img 
              src={legendImage} 
              alt="Leyenda de colores" 
              className="h-12 mx-2"
              onError={(e) => {
                console.error('Error al cargar la leyenda:', e);
                e.target.style.display = 'none';
              }}
            />
            <span className="text-sm ml-2">Cálido</span>
          </div>
          {getColorExplanation()}
        </div>
      )}
    </div>
  );
};

export default RadarSection;