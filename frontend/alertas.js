// alertas.js - Sistema de Alertas Meteorológicas

// Esperar a que el documento esté listo
document.addEventListener("DOMContentLoaded", async () => {
    console.log("⚠️ Sistema de alertas iniciado");
  
    // Seleccionamos el elemento donde mostraremos la alerta
    const alertaCard = document.getElementById("alerta-card");
    const cardBody = alertaCard.querySelector(".card-body"); // ✅ NUEVO
    cardBody.innerHTML = `<p>Consultando Pronóstico...</p>`; // ✅ CAMBIO

    try {
        // 🌍 PASO 1: Obtener coordenadas del usuario
        const coords = await getCoordinates();
        console.log("📍 Coordenadas obtenidas:", coords);
        
        // 🌤️ PASO 2: Obtener datos meteorológicos REALES de Open-Meteo
        const weatherData = await getOpenMeteoData(coords.latitude, coords.longitude);
        console.log("🌤️ Datos meteorológicos:", weatherData);
        
        // 🧩 PASO 3: Preparar datos para la API de predicción
        const body = {
            // 📊 Datos climáticos REALES (reemplaza los ficticios)
            latitude: coords.latitude,
            longitude: coords.longitude,
            PRCP: weatherData.precipitation || 30,
            TAVG: weatherData.temperature || 5,
            TMAX: weatherData.temperature_max || 10,
            TMIN: weatherData.temperature_min || -2,
            om_weather_code: weatherData.weathercode || 95,
            om_rain_sum: weatherData.rain || 50,
            om_wind_gusts_10m_max: weatherData.windgusts || 70,
            om_relative_humidity_2m_mean: weatherData.humidity || 95,
            // ⚠️ Datos que aún necesitas obtener de Open-Meteo:
            SNWD: 0,                    // Snow depth - profundidad de nieve
            om_snowfall_sum: 0,         // Acumulado de nieve
            om_precipitation_hours: 10, // Horas de precipitación
            om_wind_direction_10m_dominant: 180, // Dirección dominante del viento
            om_shortwave_radiation_sum: 0,       // Radiación solar
            om_et0_fao_evapotranspiration: 0,    // Evapotranspiración
            om_dew_point_2m_mean: 2,             // Punto de rocío
            om_pressure_msl_mean: 995,           // Presión atmosférica
            mes: 9,                     // Mes actual
            dia_del_año: 250,           // Día del año
            rango_temp_diario: 12       // Rango térmico diario
        };
        
        // 📡 PASO 4: Enviar datos a la API de predicción
        const response = await fetch("https://nahuelito22-nimbus-ai.hf.space/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
  
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
  
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
                <small class="text-info">📍 Ubicación: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}</small>
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
        // 📍 Coordenadas por defecto (Mendoza) si falla la geolocalización
        const fallback = { latitude: -32.8908, longitude: -68.8272 };

        // 🔍 Verificar si el navegador soporta geolocalización
        if (!navigator.geolocation) {
            console.warn('📍 Geolocalización no soportada, usando ubicación por defecto (Mendoza).');
            resolve(fallback);
            return;
        }

        // 🎯 Intentar obtener la ubicación real del usuario
        navigator.geolocation.getCurrentPosition(
            // ✅ Éxito: se obtuvieron las coordenadas
            (pos) => {
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                });
            },
            // ❌ Error: usuario rechazó o falló la geolocalización
            (err) => {
                console.warn('📍 No se pudo obtener ubicación, usando Mendoza. Error:', err.message);
                resolve(fallback);
            },
            // ⚙️ Opciones de geolocalización
            {
                enableHighAccuracy: false,  // No necesitamos alta precisión (ahorra batería)
                timeout: 5000,              // Máximo 5 segundos de espera
                maximumAge: 60000           // Usar posición en caché hasta 1 minuto
            }
        );
    });
}

// 🌤️ FUNCIÓN: Obtener datos meteorológicos de Open-Meteo (POR IMPLEMENTAR)
async function getOpenMeteoData(lat, lon) {
    // 📝 TODO: Implementar la llamada a la API de Open-Meteo
    // Ejemplo de cómo sería:
    /*
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m,windgusts_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
    const data = await response.json();
    
    return {
        temperature: data.current_weather.temperature,
        humidity: data.hourly.relativehumidity_2m[0],
        precipitation: data.hourly.precipitation[0],
        weathercode: data.current_weather.weathercode,
        windgusts: data.hourly.windgusts_10m[0],
        temperature_max: data.daily.temperature_2m_max[0],
        temperature_min: data.daily.temperature_2m_min[0]
    };
    */
    
    // ⏳ Por ahora retornamos datos de prueba
    console.warn('⚠️ Usando datos de prueba - Implementar Open-Meteo API');
    return {
        temperature: 15,
        humidity: 75,
        precipitation: 5,
        weathercode: 61,
        windgusts: 25,
        temperature_max: 18,
        temperature_min: 12
    };
}