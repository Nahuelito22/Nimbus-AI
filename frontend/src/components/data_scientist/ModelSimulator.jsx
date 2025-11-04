import React, { useState } from 'react';
// import { getPrediction } from '../../api/dataScientist'; // Se importará más adelante

function ModelSimulator({ selectedRow }) {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!selectedRow) return;

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // const result = await getPrediction(selectedRow);
      // setPrediction(result.hail_probability);
      
      // --- Placeholder --- 
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockResult = { hail_probability: Math.random() };
      setPrediction(mockResult.hail_probability);
      // --- Fin Placeholder ---

    } catch (err) {
      setError(err.message || 'Error al obtener la predicción.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedRow) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        <p>Selecciona una fila de la tabla de datos para simular una predicción.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Simulación para la fila seleccionada:</h3>
        <p className="text-sm text-gray-600">Fecha: {selectedRow.date}, Estación: {selectedRow.station_name}</p>
      </div>
      
      {/* Aquí se podrían poner inputs para modificar los valores */}
      <div className="p-4 border rounded-md bg-gray-50">
        <p className="text-sm">Funcionalidad para modificar valores (en construcción).</p>
      </div>

      <button
        onClick={handlePredict}
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
      >
        {isLoading ? 'Calculando...' : 'Predecir Probabilidad de Granizo'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p>Error: {error}</p>
        </div>
      )}

      {prediction !== null && (
        <div className="mt-4 p-4 bg-blue-100 rounded-lg text-center">
          <p className="text-lg font-semibold text-blue-800">Probabilidad de Granizo</p>
          <p className="text-3xl font-bold text-blue-900">{(prediction * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default ModelSimulator;
