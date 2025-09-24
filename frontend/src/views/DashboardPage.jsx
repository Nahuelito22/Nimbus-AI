import React from 'react';

function DashboardPage() {
  return (
    <div className="p-6 bg-gray-50">
      {/*
        Este es el contenedor principal del dashboard.
        En una aplicación más grande, los datos de la predicción (porcentaje, estado)
        vendrían del estado de la aplicación o de un "hook" personalizado.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna del Mapa */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Mapa de Mendoza</h2>
          {/*
            Este div es el contenedor para el mapa interactivo.
            En el futuro, esto sería un componente <MapComponent /> que usaría
            una librería como Leaflet o React Leaflet.
          */}
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
          {/*
            Esta sección se actualizaría después de una llamada a la API.
            El "velocímetro" podría ser su propio componente <GaugeComponent />.
          */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Gauge background */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                {/* Gauge progress - el valor de strokeDashoffset se calcularía dinámicamente */}
                <circle id="gauge-progress" cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="10"
                  strokeDasharray="283" strokeDashoffset="70" // Ejemplo: 75% -> 283 * (1 - 0.75) = 70
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)" />
                {/* Center circle */}
                <circle cx="50" cy="50" r="30" fill="#f9fafb" />
                {/* Percentage text */}
                <text x="50" y="50" textAnchor="middle" dy="7" fontSize="16" fontWeight="bold" id="percentage-text">75%</text>
              </svg>
            </div>
            <div id="alert-box" className="p-3 rounded-md bg-red-100 border border-red-400 text-red-700">
              <p className="font-semibold">Alerta Sugerida: <span id="alert-status">Sí</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;