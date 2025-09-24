import React from 'react';

function DashboardPage() {
  return (
    <div className="p-6 bg-gray-50">
      {/* Grid principal para Mapa y Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna del Mapa */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Mapa de Mendoza</h2>
          <div id="map" className="h-96 rounded-lg bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">[Mapa Interactivo]</p>
          </div>
          <div className="mt-4 flex justify-center">
            <button id="predict-btn" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition">
              Predecir Granizo en la Ubicación
            </button>
          </div>
        </div>

        {/* Panel de Resultados de Predicción */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Resultado de Predicción</h2>
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle id="gauge-progress" cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="10"
                  strokeDasharray="283" strokeDashoffset="70" // Ejemplo: 75%
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="30" fill="#f9fafb" />
                <text x="50" y="50" textAnchor="middle" dy="7" fontSize="16" fontWeight="bold" id="percentage-text">75%</text>
              </svg>
            </div>
            <div id="alert-box" className="p-3 rounded-md bg-red-100 border border-red-400 text-red-700">
              <p className="font-semibold">Alerta Sugerida: <span id="alert-status">Sí</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid para Noticias y Radar */}
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
