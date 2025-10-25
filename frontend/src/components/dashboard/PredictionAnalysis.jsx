import React, { useState } from 'react';
import { getPredictionWithDetails } from '../../api/professional';
import Gauge from './Gauge';

// Componente para mostrar los datos de entrada del modelo
const ModelInputTable = ({ data }) => {
    if (!data) return null;

    return (
        <div className="mt-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
            <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                    <tr>
                        <th scope="col" className="px-4 py-2">Parámetro</th>
                        <th scope="col" className="px-4 py-2">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-1 font-medium text-gray-900">{key}</td>
                            <td className="px-4 py-1">{typeof value === 'number' ? value.toFixed(4) : value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function PredictionAnalysis({ coords, onGenerateReport, isGeneratingReport, reportError }) {
    const [predictionData, setPredictionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePredict = async () => {
        setIsLoading(true);
        setError(null);
        setPredictionData(null);
        try {
            const data = await getPredictionWithDetails(coords);
            setPredictionData(data);
        } catch (err) {
            setError(err.message || 'Error al obtener la predicción.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Análisis de Predicción</h2>
            
            <div className="flex-grow">
                {/* Botón de Predicción */}
                <button 
                    onClick={handlePredict}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition duration-300 ease-in-out mb-4"
                >
                    {isLoading ? 'Analizando...' : 'Predecir Granizo (con detalles)'}
                </button>

                {/* Resultados */}
                {isLoading && <div className="text-center">Cargando predicción...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}

                {predictionData && (
                    <div>
                        <h3 className="text-lg font-semibold text-center">Probabilidad de Granizo</h3>
                        <Gauge probability={predictionData.prediction_output.probabilidad_granizo} />
                        <h3 className="text-lg font-semibold mt-4">Datos Enviados al Modelo</h3>
                        <ModelInputTable data={predictionData.model_input} />
                    </div>
                )}
            </div>

            {/* Herramientas Adicionales (Reporte) */}
            <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Herramientas</h3>
                 <button 
                    onClick={onGenerateReport}
                    disabled={isGeneratingReport}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-300 ease-in-out"
                >
                    {isGeneratingReport ? 'Generando Reporte...' : 'Generar Reporte PDF'}
                </button>
                {reportError && (
                    <div className="text-red-500 text-sm text-center mt-2">
                        {reportError}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PredictionAnalysis;
