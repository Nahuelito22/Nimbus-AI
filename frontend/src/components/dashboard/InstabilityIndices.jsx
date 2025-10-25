import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardWeatherData } from '../../api/weather';
import { WiStrongWind } from "react-icons/wi"; // Using a weather icon

// Helper para encontrar el índice de la hora actual
const findCurrentHourIndex = (timeArray) => {
    const now = new Date();
    let closestIndex = -1;
    let smallestDiff = Infinity;

    timeArray.forEach((timeStr, index) => {
        const time = new Date(timeStr);
        const diff = Math.abs(time - now);
        if (diff < smallestDiff) {
            smallestDiff = diff;
            closestIndex = index;
        }
    });
    return closestIndex;
};

// Helper para dar color según el riesgo
const getCapeColor = (cape) => {
    if (cape > 2500) return 'text-red-600';
    if (cape > 1500) return 'text-orange-500';
    if (cape > 500) return 'text-yellow-500';
    return 'text-green-500';
};

const getLiColor = (li) => {
    if (li < -5) return 'text-red-600';
    if (li < -2) return 'text-orange-500';
    if (li < 0) return 'text-yellow-500';
    return 'text-green-500';
};

function InstabilityIndices({ coords }) { // Recibe coords
    const [indicesData, setIndicesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!coords) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Usar las coordenadas de las props
                const data = await getDashboardWeatherData(coords);
                
                const { hourly } = data;
                const nowIndex = findCurrentHourIndex(hourly.time);

                const forecastHours = 12;
                const chartData = hourly.time.slice(nowIndex, nowIndex + forecastHours).map((t, i) => ({
                    time: new Date(t).toLocaleTimeString('es-AR', { hour: '2-digit' }) + 'h',
                    cape: hourly.cape[nowIndex + i],
                    li: hourly.lifted_index[nowIndex + i],
                }));

                setIndicesData({
                    current: {
                        cape: hourly.cape[nowIndex],
                        li: hourly.lifted_index[nowIndex],
                    },
                    forecast: chartData,
                });

            } catch (err) {
                setError('No se pudieron cargar los índices de inestabilidad.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [coords]); // Se ejecuta cuando cambian las coords

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Índices de Inestabilidad</h2>
                <div className="h-48 flex items-center justify-center">Cargando índices...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Índices de Inestabilidad</h2>
                <div className="h-48 flex items-center justify-center text-red-500">{error}</div>
            </div>
        );
    }

    if (!indicesData) return null;

    const { current, forecast } = indicesData;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Índices de Inestabilidad</h2>
            
            {/* Current Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-600">CAPE</h3>
                    <p className={`text-4xl font-bold ${getCapeColor(current.cape)}`}>{Math.round(current.cape)}</p>
                    <p className="text-sm text-gray-500">J/kg</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-600">Lifted Index (LI)</h3>
                    <p className={`text-4xl font-bold ${getLiColor(current.li)}`}>{current.li.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">K</p>
                </div>
            </div>

            {/* Forecast Chart */}
            <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Pronóstico de Índices por Hora</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={forecast}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 12 }} unit=" J/kg" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 12 }} unit=" K" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="cape" name="CAPE" stroke="#8884d8" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="li" name="Lifted Index" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default InstabilityIndices;
