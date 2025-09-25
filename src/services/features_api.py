import pickle
import os

# --- Cargar el Scaler ---
# Asegurate de que la ruta sea la correcta en tu Drive
ruta_scaler = "C:/Repositorios_Locales/Proyectos_Personales/Nimbus_AI/data/processed/modelo_multimodal/sets_finales/scaler.pkl"

try:
    with open(ruta_scaler, 'rb') as f:
        scaler_cargado = pickle.load(f)
    
    # --- Obtener la lista de features ---
    lista_de_features = scaler_cargado.feature_names_in_
    
    print("--- Lista Definitiva de Features para el Modelo V3.1 ---")
    # Imprimimos la lista de forma ordenada
    for i, feature in enumerate(lista_de_features):
        print(f"{i+1}. {feature}")

except FileNotFoundError:
    print(f"❌ ERROR: No se encontró el archivo '{ruta_scaler}'.")

# --- Lista Definitiva de Features para el Modelo V3.1 ---
# 1. PRCP
# 2. SNWD
# 3. TAVG
# 4. TMAX
# 5. TMIN
# 6. latitude
# 7. longitude
# 8. om_weather_code
# 9. om_rain_sum
# 10. om_snowfall_sum
# 11. om_precipitation_hours
# 12. om_wind_gusts_10m_max
# 13. om_wind_direction_10m_dominant
# 14. om_shortwave_radiation_sum
# 15. om_et0_fao_evapotranspiration
# 16. om_dew_point_2m_mean
# 17. om_relative_humidity_2m_mean
# 18. om_pressure_msl_mean
# 19. año
# 20. mes
# 21. dia_del_año
# 22. rango_temp_diario
