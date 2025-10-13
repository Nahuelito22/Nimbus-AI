// alertas.js - Sistema de Alertas Meteorológicas

document.addEventListener("DOMContentLoaded", async () => {
    console.log("⚠️ Sistema de alertas iniciado");

    const alertaCard = document.getElementById("alerta-card");
    const cardBody = alertaCard.querySelector(".card-body");
    cardBody.innerHTML = `<p>Consultando Pronóstico...</p>`;

    try {
        // 🌍 PASO 1: Obtener coordenadas del usuario y ciudad por IP
        const coords = await getCoordinates();
        const ciudadNombre = await getCityByIP(); // <-- NUEVO
        console.log("📍 Coordenadas y ciudad obtenidas:", coords, ciudadNombre);

        // 🌤️ PASO 2: Obtener datos meteorológicos REALES y completos de Open-Meteo
        const weatherData = await getOpenMeteoData(coords.latitude, coords.longitude);
        console.log("🌤️ Datos meteorológicos completos:", weatherData);

        // 🧩 PASO 3: Preparar datos para la API de predicción
        const body = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            PRCP: weatherData.PRCP,
            SNWD: weatherData.SNWD,
            TAVG: weatherData.TAVG,
            TMAX: weatherData.TMAX,
            TMIN: weatherData.TMIN,
            om_weather_code: weatherData.om_weather_code,
            om_rain_sum: weatherData.om_rain_sum,
            om_snowfall_sum: weatherData.om_snowfall_sum,
            om_precipitation_hours: weatherData.om_precipitation_hours,
            om_wind_gusts_10m_max: weatherData.om_wind_gusts_10m_max,
            om_wind_direction_10m_dominant: weatherData.om_wind_direction_10m_dominant,
            om_shortwave_radiation_sum: weatherData.om_shortwave_radiation_sum,
            om_et0_fao_evapotranspiration: weatherData.om_et0_fao_evapotranspiration,
            om_dew_point_2m_mean: weatherData.om_dew_point_2m_mean,
            om_relative_humidity_2m_mean: weatherData.om_relative_humidity_2m_mean,
            om_pressure_msl_mean: weatherData.om_pressure_msl_mean,
            mes: weatherData.mes,
            dia_del_año: weatherData.dia_del_año,
            rango_temp_diario: weatherData.rango_temp_diario
        };

        // 📡 PASO 4: Enviar datos a la API de predicción
        const response = await fetch("https://nahuelito22-nimbus-ai.hf.space/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

        // 📦 PASO 5: Procesar respuesta de la API
        const data = await response.json();
        console.log("📦 Respuesta completa de la API:", data);

        // 🎯 PASO 6: Mostrar resultados en pantalla
        if (data.probabilidad_granizo !== undefined) {
            const probabilidad = (data.probabilidad_granizo * 100).toFixed(1);
            cardBody.innerHTML = `
                <h4>⚠️ Alerta Meteorológica</h4>
                <p class="fs-5">Probabilidad de Granizo: <strong>${probabilidad}%</strong></p>
                <p class="text-muted">${data.alerta || "Sin alerta activa"}</p>
                <small class="text-info">📍 Ubicación: ${ciudadNombre} (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})</small>
            `;
            alertaCard.classList.add("border", "border-warning", "shadow-sm");
        } else {
            alertaCard.innerHTML = `<p class="text-warning">⚠️ No se pudo obtener la predicción.</p>`;
        }

    } catch (error) {
        console.error("❌ Error en el sistema de alertas:", error);
        alertaCard.innerHTML = `
            <p class="text-danger">⚠️ Error al conectar con los servicios meteorológicos.</p>
            <small>Detalle: ${error.message}</small>
        `;
    }
});

// 🌍 FUNCIÓN: Obtener coordenadas geográficas del usuario
function getCoordinates() {
    return new Promise((resolve) => {
        const fallback = { latitude: -32.8908, longitude: -68.8272 };

        if (!navigator.geolocation) {
            console.warn('📍 Geolocalización no soportada, usando ubicación por defecto (Mendoza).');
            resolve(fallback);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            (err) => {
                console.warn('📍 No se pudo obtener ubicación, usando Mendoza. Error:', err.message);
                resolve(fallback);
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
    });
}

// 🌎 FUNCIÓN NUEVA: Obtener nombre de ciudad por IP (desde tu API local)
async function getCityByIP() {
    try {
        const res = await fetch("http://localhost:5000/api/meteo/ip");
        if (!res.ok) throw new Error(`Error al obtener ciudad: ${res.status}`);
        const data = await res.json();
        return data.city || "Ubicación desconocida";
    } catch (error) {
        console.warn("⚠️ No se pudo obtener ciudad por IP:", error.message);
        return "Ubicación desconocida";
    }
}

// 🌤️ FUNCIÓN: Obtener todos los datos meteorológicos dinámicos desde Open-Meteo
async function getOpenMeteoData(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windgusts_10m,winddirection_10m,snowfall,snow_depth,shortwave_radiation,et0_fao_evapotranspiration,dewpoint_2m,pressure_msl&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,shortwave_radiation_sum&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener datos de Open-Meteo: ${response.status}`);
        const data = await response.json();

        const hourly = data.hourly;
        const current = data.current_weather;
        const temperature_max = data.daily.temperature_2m_max[0];
        const temperature_min = data.daily.temperature_2m_min[0];
        const rango_temp_diario = temperature_max - temperature_min;

        const om_precipitation_hours = hourly.precipitation.reduce((acc, val) => acc + (val > 0 ? 1 : 0), 0);
        const windDirCounts = {};
        hourly.winddirection_10m.forEach(d => windDirCounts[d] = (windDirCounts[d] || 0) + 1);
        const om_wind_direction_10m_dominant = parseInt(Object.keys(windDirCounts).reduce((a,b) => windDirCounts[a] > windDirCounts[b] ? a : b));

        return {
            PRCP: hourly.precipitation[0] || 0,
            SNWD: hourly.snow_depth[0] || 0,
            TAVG: current.temperature || 15,
            TMAX: temperature_max,
            TMIN: temperature_min,
            om_weather_code: current.weathercode || 0,
            om_rain_sum: data.daily.precipitation_sum[0] || 0,
            om_snowfall_sum: data.daily.snowfall_sum[0] || 0,
            om_precipitation_hours,
            om_wind_gusts_10m_max: hourly.windgusts_10m[0] || 0,
            om_wind_direction_10m_dominant,
            om_shortwave_radiation_sum: data.daily.shortwave_radiation_sum[0] || 0,
            om_et0_fao_evapotranspiration: hourly.et0_fao_evapotranspiration[0] || 0,
            om_dew_point_2m_mean: hourly.dewpoint_2m[0] || 0,
            om_relative_humidity_2m_mean: hourly.relativehumidity_2m[0] || 0,
            om_pressure_msl_mean: hourly.pressure_msl[0] || 1013,
            mes: new Date().getMonth() + 1,
            dia_del_año: Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / (1000*60*60*24)),
            rango_temp_diario
        };

    } catch (error) {
        console.error("❌ Error obteniendo datos de Open-Meteo:", error);
        return {
            PRCP: 0, SNWD: 0, TAVG: 15, TMAX: 35, TMIN: 10,
            om_weather_code: 0, om_rain_sum: 0, om_snowfall_sum: 0,
            om_precipitation_hours: 0, om_wind_gusts_10m_max: 15,
            om_wind_direction_10m_dominant: 180, om_shortwave_radiation_sum: 0,
            om_et0_fao_evapotranspiration: 0, om_dew_point_2m_mean: 8,
            om_relative_humidity_2m_mean: 45, om_pressure_msl_mean: 1013,
            mes: new Date().getMonth() + 1,
            dia_del_año: Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / (1000*60*60*24)),
            rango_temp_diario: 25
        };
    }
}
