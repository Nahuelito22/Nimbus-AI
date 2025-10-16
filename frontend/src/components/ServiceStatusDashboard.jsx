import React, { useState } from 'react';
import * as adminApi from '../api/admin';

const ServiceStatusDashboard = () => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState({});

    const handleTest = async (serviceName, apiCall) => {
        setLoading(prev => ({ ...prev, [serviceName]: true }));
        const startTime = performance.now();
        try {
            const response = await apiCall();
            const endTime = performance.now();
            const latency = (endTime - startTime).toFixed(2);
            setResults(prev => ({
                ...prev,
                [serviceName]: { status: 'success', data: response, latency }
            }));
        } catch (error) {
            const endTime = performance.now();
            const latency = (endTime - startTime).toFixed(2);
            setResults(prev => ({
                ...prev,
                [serviceName]: { status: 'error', message: error.message, latency }
            }));
        } finally {
            setLoading(prev => ({ ...prev, [serviceName]: false }));
        }
    };

    const services = [
        { name: 'Open-Meteo', serviceKey: 'openMeteo', test: () => handleTest('openMeteo', adminApi.testOpenMeteo) },
        { name: 'GOES Satellite', serviceKey: 'goesSatellite', test: () => handleTest('goesSatellite', adminApi.testGoesSatellite) },
        { name: 'News API', serviceKey: 'newsApi', test: () => handleTest('newsApi', adminApi.testNewsApi) },
        { name: 'Hugging Face Model', serviceKey: 'huggingFace', test: () => handleTest('huggingFace', adminApi.testHuggingFace) },
        { name: 'Application Logs', serviceKey: 'logs', test: () => handleTest('logs', adminApi.getLogs) }
    ];

    const renderResult = (serviceKey) => {
        const result = results[serviceKey];
        if (!result) return null;

        // Especial para logs, que vienen en un formato diferente
        const responseData = serviceKey === 'logs' ? (result.data?.logs || result.data) : result.data;

        return (
            <div className={`mt-4 p-4 rounded-lg ${result.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex justify-between items-center">
                    <span className={`font-bold ${result.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                        {result.status === 'success' ? 'Éxito' : 'Error'}
                    </span>
                    <span className="text-sm text-gray-600">Latencia: {result.latency} ms</span>
                </div>
                <pre className="mt-2 text-xs text-left bg-gray-800 text-white p-3 rounded-md overflow-auto max-h-60">
                    {typeof responseData === 'string' ? responseData : JSON.stringify(responseData || { message: result.message }, null, 2)}
                </pre>
            </div>
        );
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Panel de Estado de Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service.name} className="bg-gray-50 p-5 rounded-xl shadow">
                        <h3 className="text-lg font-semibold text-gray-700">{service.name}</h3>
                        <button
                            onClick={service.test}
                            disabled={loading[service.serviceKey]}
                            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 transition-colors"
                        >
                            {loading[service.serviceKey] ? 'Probando...' : 'Probar Servicio'}
                        </button>
                        {renderResult(service.serviceKey)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceStatusDashboard;