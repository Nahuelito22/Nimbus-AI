import React from 'react';
import Gauge from './Gauge';

const PredictionPanel = ({ isLoading, error, prediction }) => {
  return (
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
          !isLoading && <p className="text-gray-500">Haz clic en el mapa para seleccionar una ubicación y luego presiona "Predecir".</p>
        )}
      </div>
    </div>
  );
};

export default PredictionPanel;
