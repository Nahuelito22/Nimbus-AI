import React, { useState, useEffect } from 'react';
import { getSatelliteImage } from '../../api/satellite';

const RadarSection = () => {
  const [band, setBand] = useState(13);
  const [palette, setPalette] = useState('inferno');
  const [radarImage, setRadarImage] = useState('');
  const [legendImage, setLegendImage] = useState('');
  const [radarIsLoading, setRadarIsLoading] = useState(false);
  const [radarError, setRadarError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showZoomControls, setShowZoomControls] = useState(false);

  const handleFetchRadarImage = async (forceRefresh = false) => {
    setRadarIsLoading(true);
    setRadarError(null);
    try {
      const data = await getSatelliteImage(band, palette, forceRefresh);
      if (data.image) {
        setRadarImage(data.image);
        setLegendImage(data.legend || '');
        setIsCached(data.cached || false);
        console.log('Imagen recibida (base64):', data.image ? 'Sí' : 'No');
        console.log('Leyenda recibida (base64):', data.legend ? 'Sí' : 'No');
        console.log('¿Usando caché?:', data.cached ? 'Sí' : 'No');
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

  const handleRefresh = () => {
    handleFetchRadarImage(true);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

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
            <option value="gray">Normal (Escala de Grises)</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
            onClick={handleRefresh}
            disabled={radarIsLoading}
          >
            {radarIsLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
          {isCached && (
            <span className="text-xs text-green-600 text-center">
              Imagen en caché
            </span>
          )}
        </div>
      </div>
      
      <div 
        className="border rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center min-h-[200px] relative"
        onMouseEnter={() => setShowZoomControls(true)}
        onMouseLeave={() => setShowZoomControls(false)}
      >
        {radarError && !radarIsLoading && <p className="text-red-400 p-4">{radarError}</p>}
        {radarIsLoading ? (
          <p className="text-white">Buscando imagen satelital más reciente...</p>
        ) : radarImage ? (
          <>
            <img 
              id="radar-image" 
              src={radarImage} 
              alt="Radar GOES-19" 
              className="w-full h-auto transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
              onError={(e) => {
                console.error('Error al cargar la imagen:', e);
                e.target.src = 'https://placehold.co/600x400/111827/FFFFFF?text=Error+al+cargar+imagen';
              }}
            />
            
            {showZoomControls && (
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <button 
                  className="bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  title="Acercar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button 
                  className="bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                  title="Alejar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Indicador de zoom */}
            {zoomLevel !== 1 && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Zoom: {Math.round(zoomLevel * 100)}%
              </div>
            )}
          </>
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