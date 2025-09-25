const PREDICTION_API_URL = 'https://nahuelito22-nimbus-ai.hf.space/api/predict';

export const getHailPrediction = async (coords) => {
  const { lat, lon } = coords;

  // Usar el cuerpo de la petición que proporcionaste
  const body = {
    "PRCP": 0,
    "SNWD": 0,
    "TAVG": 0,
    "TMAX": 0,
    "TMIN": 0,
    "latitude": lat,
    "longitude": lon,
    "om_weather_code": 0,
    "om_rain_sum": 0,
    "om_snowfall_sum": 0,
    "om_precipitation_hours": 0,
    "om_wind_gusts_10m_max": 0,
    "om_wind_direction_10m_dominant": 0,
    "om_shortwave_radiation_sum": 0,
    "om_et0_fao_evapotranspiration": 0,
    "om_dew_point_2m_mean": 0,
    "om_relative_humidity_2m_mean": 0,
    "om_pressure_msl_mean": 0,
    "mes": new Date().getMonth() + 1, // Usar mes y día actuales
    "dia_del_año": Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)),
    "rango_temp_diario": 0
  };

  const response = await fetch(PREDICTION_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    // La API de Hugging Face puede devolver el error en `detail`
    const errorMessage = data.detail || 'Error al obtener la predicción.';
    throw new Error(errorMessage);
  }

  return data;
};
