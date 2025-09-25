import React, { useState } from 'react';

// Componente para el velocímetro de riesgo
const Gauge = ({ probability }) => {
  const percentage = Math.round(probability * 100);
  // 283 es el perímetro del círculo (2 * pi * 45). El offset controla cuánto se "llena".
  const offset = 283 - (283 * percentage) / 100;

  let strokeColor = '#3b82f6'; // Azul por defecto
  if (percentage > 50) strokeColor = '#f97316'; // Naranja
  if (percentage > 75) strokeColor = '#ef4444'; // Rojo

  return (
    <div className="relative w-48 h-48 mx-auto mb-4">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          id="gauge-progress"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeDasharray="283"
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
        <circle cx="50" cy="50" r="30" fill="#f9fafb" />
        <text x="50" y="50" textAnchor="middle" dy="7" fontSize="16" fontWeight="bold" id="percentage-text">
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

function DashboardPage() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Coordenadas de ejemplo (Mendoza). Más adelante se tomarán del mapa.
  const [coords, setCoords] = useState({ lat: -32.8895, lon: -68.8458 });

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

  return (
    <div className="p-6 bg-gray-50">
      {/* Grid principal para Mapa y Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna del Mapa */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Mapa de Mendoza</h2>
          <div id="map" className="h-96 rounded-lg bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Ubicación seleccionada: {coords.lat}, {coords.lon}</p>
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
              !isLoading && <p className="text-gray-500">Presiona "Predecir" para ver el resultado.</p>
            )}
          </div>
        </div>
      </div>

      {/* Grid para Noticias y Radar (Restaurado) */}
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
                    <select id="band-select" className="px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
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
                <button id="refresh-radar" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md self-end">
                    Actualizar
                </button>
            </div>
            <div className="border rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center min-h-[200px]">
                {/* Usamos un placeholder para la imagen del radar */}
                <img id="radar-image" src="https://via.placeholder.com/600x400.png/111827/FFFFFF?text=Radar+GOES-19" alt="Radar GOES-19" className="w-full h-auto" />
            </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
