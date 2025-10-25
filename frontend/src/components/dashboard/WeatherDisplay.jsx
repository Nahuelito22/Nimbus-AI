import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiWind, FiDroplet, FiThermometer, FiSun, FiCloud, FiCloudRain, FiCloudSnow } from 'react-icons/fi';
import { getDashboardWeatherData } from '../../api/weather'; // Cambiado a la nueva función

// Mapeo de códigos de clima de WMO a iconos (sin cambios)
const weatherIconMap = {
    0: <FiSun className="text-yellow-500" />, // Clear sky
    1: <FiSun className="text-yellow-500" />, // Mainly clear
    2: <FiCloud className="text-gray-400" />, // Partly cloudy
    3: <FiCloud className="text-gray-500" />, // Overcast
    45: <FiCloud className="text-gray-500" />, // Fog
    48: <FiCloud className="text-gray-500" />, // Depositing rime fog
    61: <FiCloudRain className="text-blue-400" />, // Rain: Slight
    63: <FiCloudRain className="text-blue-500" />, // Rain: Moderate
    65: <FiCloudRain className="text-blue-600" />, // Rain: Heavy
    80: <FiCloudRain className="text-blue-400" />, // Showers: Slight
    81: <FiCloudRain className="text-blue-500" />, // Showers: Moderate
    82: <FiCloudRain className="text-blue-600" />, // Showers: Violent
    95: <FiCloudRain className="text-blue-700" />, // Thunderstorm
};

const transformApiData = (apiData) => {
    // La nueva API devuelve directamente el formato que necesitamos, pero sin el wrapper 'weather'
    const { current_weather, hourly, daily } = apiData;

    // Transformar datos horarios (tomar las próximas 12 horas)
    const now = new Date();
    const transformedHourly = hourly.time.map((t, i) => ({
        time: new Date(t),
        temp: hourly.temperature_2m[i],
    })).filter(h => h.time > now).slice(0, 12).map(h => ({
        ...h,
        time: h.time.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    }));

    // Transformar datos diarios
    const transformedDaily = daily.time.map((t, i) => ({
        day: new Date(t).toLocaleDateString('es-AR', { weekday: 'short' }),
        min_temp: daily.temperature_2m_min[i],
        max_temp: daily.temperature_2m_max[i],
        weather_code: daily.weather_code[i],
    }));

    return {
        current: {
            temperature: Math.round(current_weather.temperature),
            weather_code: current_weather.weathercode,
            wind_speed: current_weather.windspeed,
            humidity: 'N/A', // Humedad no está en current_weather, se podría obtener de hourly
        },
        hourly: transformedHourly,
        daily: transformedDaily,
    };
};

function WeatherDisplay({ coords }) { // Recibe coords en lugar de city
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!coords) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getDashboardWeatherData(coords);
                const transformedData = transformApiData(data);
                setWeatherData(transformedData);
            } catch (err) {
                setError('No se pudieron cargar los datos del clima.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [coords]); // El efecto se ejecuta cuando cambian las coordenadas

    if (loading) {
        return <div className="text-center p-4 bg-white rounded-lg shadow-md">Cargando datos del clima...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4 bg-white rounded-lg shadow-md">{error}</div>;
    }

    if (!weatherData) {
        return null;
    }

    const WeatherIcon = weatherIconMap[weatherData.current.weather_code] || <FiCloud className="text-gray-500" />;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Condiciones Climáticas</h2>
            
            {/* Current Conditions */}
            <div className="flex items-center justify-around p-4 bg-blue-50 rounded-lg mb-6">
                <div className="text-center">
                    <div className="text-5xl mx-auto">{WeatherIcon}</div>
                    <p className="text-4xl font-bold text-gray-800">{weatherData.current.temperature}°C</p>
                    <p className="text-sm text-gray-600">Actual</p>
                </div>
                <div className="text-center">
                    <FiWind className="mx-auto text-3xl text-blue-500" />
                    <p className="text-lg font-semibold">{weatherData.current.wind_speed} km/h</p>
                    <p className="text-sm text-gray-600">Viento</p>
                </div>
                <div className="text-center">
                    <FiDroplet className="mx-auto text-3xl text-blue-500" />
                    <p className="text-lg font-semibold">{weatherData.current.humidity}</p>
                    <p className="text-sm text-gray-600">Humedad</p>
                </div>
            </div>

            {/* Hourly Forecast */}
            <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Pronóstico por Hora</h3>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={weatherData.hourly}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} unit="°" domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="temp" name="Temp." stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Daily Forecast */}
            <div className="mt-6">
                 <h3 className="text-lg font-semibold mb-2 text-gray-700">Pronóstico Semanal</h3>
                 <div className="grid grid-cols-3 md:grid-cols-7 gap-2 text-center">
                    {weatherData.daily.map((day, index) => (
                        <div key={index} className="p-2 bg-gray-100 rounded-lg">
                            <p className="font-semibold text-sm">{day.day}</p>
                            <div className="text-3xl my-1 mx-auto">{weatherIconMap[day.weather_code] || <FiCloud />}</div>
                            <p className="text-sm">{Math.round(day.max_temp)}° / {Math.round(day.min_temp)}°</p>
                        </div>
                    ))}
                 </div>
            </div>

        </div>
    );
}

export default WeatherDisplay;
