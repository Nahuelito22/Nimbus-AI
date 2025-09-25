// =============================================
// DATOS DE CIUDADES DE MENDOZA POR ZONA
// =============================================
/**
 * Mapa de ciudades de Mendoza con sus coordenadas geográficas
 * Agrupadas por zonas climáticas
 */
const ciudadesMendoza = {
  "norte": [
      { nombre: "Mendoza Capital", lat: -32.8908, lng: -68.8272 },
      { nombre: "Guaymallén", lat: -32.8847, lng: -68.8272 },
      { nombre: "Godoy Cruz", lat: -32.9333, lng: -68.8333 },
      { nombre: "Las Heras", lat: -32.8500, lng: -68.8167 },
      { nombre: "Maipú", lat: -32.9667, lng: -68.7500 },
      { nombre: "Luján de Cuyo", lat: -33.0333, lng: -68.8833 },
      { nombre: "Lavalle", lat: -32.7000, lng: -68.5833 }
  ],
  "centro": [
      { nombre: "Tunuyán", lat: -33.5667, lng: -69.0167 },
      { nombre: "Tupungato", lat: -33.3667, lng: -69.1500 },
      { nombre: "San Carlos", lat: -33.7667, lng: -69.0333 }
  ],
  "este": [
      { nombre: "Junín", lat: -33.1500, lng: -68.4833 },
      { nombre: "Rivadavia", lat: -33.1833, lng: -68.4667 },
      { nombre: "San Martín", lat: -33.0833, lng: -68.4667 },
      { nombre: "Santa Rosa", lat: -33.2500, lng: -68.1500 },
      { nombre: "La Paz", lat: -33.4667, lng: -67.5500 }
  ],
  "sur": [
      { nombre: "San Rafael", lat: -34.6177, lng: -68.3301 },
      { nombre: "General Alvear", lat: -34.9667, lng: -67.7000 },
      { nombre: "Malargüe", lat: -35.4667, lng: -69.5833 }
  ]
};
// =============================================
// FUNCIÓN HELPER: SEGURIDAD CONTRA INYECCIÓN HTML
// =============================================
/**
* Convierte caracteres especiales en entidades HTML para prevenir XSS
* @param {string} str - Texto a escapar
* @returns {string} Texto seguro para insertar en HTML
*/
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
}

// =============================================
// FUNCIÓN: OBTENER ICONO DEL CLIMA SEGÚN CÓDIGO
// =============================================
/**
* Convierte el código meteorológico de Open-Meteo en un icono visual
* @param {number} codigoClima - Código numérico del clima
* @returns {string} Emoji representativo del estado climático
*/
function obtenerIconoClima(codigoClima) {
  // Códigos de clima según documentación de Open-Meteo
  if (codigoClima === 0) return "☀️";  // Despejado
  if (codigoClima >= 1 && codigoClima <= 3) return "🌤️";  // Parcialmente nublado
  if (codigoClima >= 45 && codigoClima <= 48) return "🌫️";  // Niebla
  if (codigoClima >= 51 && codigoClima <= 67) return "🌧️";  // Lluvia
  if (codigoClima >= 71 && codigoClima <= 77) return "❄️";  // Nieve
  if (codigoClima >= 80 && codigoClima <= 82) return "⛈️";  // Lluvia intensa
  if (codigoClima >= 95 && codigoClima <= 99) return "⚡";  // Tormenta
  return "🌈";  // Por defecto
}

// =============================================
// FUNCIÓN: OBTENER DESCRIPCIÓN DEL CLIMA
// =============================================
/**
* Convierte el código meteorológico en texto descriptivo
* @param {number} codigoClima - Código numérico del clima
* @returns {string} Descripción en español del estado climático
*/
function obtenerDescripcionClima(codigoClima) {
  const descripciones = {
      0: "Despejado",
      1: "Mayormente despejado",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Niebla",
      48: "Niebla helada",
      51: "Llovizna ligera",
      53: "Llovizna moderada",
      55: "Llovizna intensa",
      61: "Lluvia ligera",
      63: "Lluvia moderada",
      65: "Lluvia intensa",
      71: "Nieve ligera",
      73: "Nieve moderada",
      75: "Nieve intensa",
      77: "Granizo",
      80: "Chubascos ligeros",
      81: "Chubascos moderados",
      82: "Chubascos intensos",
      95: "Tormenta eléctrica",
      96: "Tormenta con granizo ligero",
      99: "Tormenta con granizo intenso"
  };
  return descripciones[codigoClima] || "Condiciones variables";
}

// =============================================
// FUNCIÓN: CREAR CARD DE CLIMA PARA UNA CIUDAD
// =============================================
/**
* Genera el HTML para una card de clima Bootstrap
* @param {string} nombreCiudad - Nombre de la ciudad
* @param {Object} datosClima - Datos meteorológicos de la API
* @returns {string} HTML de la card lista para insertar
*/
function crearCardClima(nombreCiudad, datosClima) {
  // EXTRAER DATOS DE LA ESTRUCTURA REAL DE TU API
  const currentWeather = datosClima.weather?.current_weather || datosClima.current_weather;
  
  if (!currentWeather) {
      console.warn("No hay datos de clima para:", nombreCiudad, datosClima);
      return `
          <div class="col-12 col-md-6 col-lg-4 mb-4">
              <div class="card h-100 border-warning">
                  <div class="card-body text-center">
                      <h5>${escapeHtml(nombreCiudad)}</h5>
                      <p class="text-warning">❌ Datos no disponibles</p>
                  </div>
              </div>
          </div>
      `;
  }
  
  const temp = currentWeather.temperature;
  const viento = currentWeather.windspeed;
  const codigoClima = currentWeather.weathercode;
  
  const icono = obtenerIconoClima(codigoClima);
  const descripcion = obtenerDescripcionClima(codigoClima);
  
  return `
      <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
              <div class="card-body text-center">
                  <h5 class="card-title">${escapeHtml(nombreCiudad)}</h5>
                  <div class="display-6">${icono}</div>
                  <h3 class="text-primary">${temp}°C</h3>
                  <p class="text-muted">${descripcion}</p>
                  <div class="row mt-3">
                      <div class="col-6">
                          <small>🌬️ Viento</small>
                          <p class="mb-0">${viento} km/h</p>
                      </div>
                      <div class="col-6">
                          <small>🧭 Dirección</small>
                          <p class="mb-0">${currentWeather.winddirection}°</p>
                      </div>
                  </div>
                  <small class="text-muted mt-2">${currentWeather.time}</small>
              </div>
          </div>
      </div>
  `;
}
// =============================================
// FUNCIÓN PRINCIPAL: CARGAR CLIMA POR ZONA
// =============================================
/**
* Carga y muestra datos climáticos de una zona específica de Mendoza
* @param {string} zona - Zona climática ('norte', 'centro', 'sur', 'este', 'oeste', 'todas')
* @returns {Promise<void>}
*/
async function cargarClima(zona) {
  // 1. OBTENER CONTENEDOR DONDE SE MOSTRARÁN LAS CARDS DE CLIMA
  const container = document.getElementById("clima-container");
  
  try {
      // 2. MOSTRAR INDICADOR DE CARGA
      container.innerHTML = `
          <div class="col-12 text-center py-5">
              <div class="spinner-border text-info" role="status">
                  <span class="visually-hidden">Consultando meteorología...</span>
              </div>
              <p class="mt-2 text-muted">Cargando clima para zona ${zona}...</p>
          </div>
      `;
      
      // 3. OBTENER CIUDADES DE LA ZONA SELECCIONADA
      let ciudades = [];
      if (zona === "todas") {
          // Unir todas las ciudades de todas las zonas
          ciudades = Object.values(ciudadesMendoza).flat();
      } else {
          // Obtener ciudades de la zona específica
          ciudades = ciudadesMendoza[zona] || [];
      }
      
      // 4. VERIFICAR SI HAY CIUDADES PARA LA ZONA
      if (ciudades.length === 0) {
          container.innerHTML = `
              <div class="col-12 text-center py-5">
                  <div class="alert alert-warning">
                      <h4>🌍 Zona no encontrada</h4>
                      <p>No hay ciudades registradas para la zona <strong>${zona}</strong>.</p>
                  </div>
              </div>
          `;
          return;
      }
      
      // 5. LIMPIAR CONTENEDOR ANTES DE AGREGAR NUEVAS CARDS
      container.innerHTML = '';
      
      // 6. CARGAR CLIMA PARA CADA CIUDAD
      for (const ciudad of ciudades) {
          try {
              // 7. HACER PETICIÓN A LA API DE CLIMA POR COORDENADAS
              const res = await fetch(`http://localhost:5000/api/meteo/coords?lat=${ciudad.lat}&lon=${ciudad.lng}`);
              
              // 8. VERIFICAR SI LA RESPUESTA ES EXITOSA
              if (!res.ok) {
                  throw new Error(`Error en la API: ${res.status} - ${res.statusText}`);
              }
              
              // 9. CONVERTIR RESPUESTA A JSON
              const data = await res.json();
              
              // 10. VERIFICAR SI HAY DATOS DE CLIMA VÁLIDOS
              const currentWeather = data.weather?.current_weather || data.current_weather;
              if (data && currentWeather && currentWeather.temperature !== undefined) {                  // 11. CREAR Y AGREGAR CARD DE CLIMA
                  const cardHTML = crearCardClima(ciudad.nombre, data);
                  container.innerHTML += cardHTML;
              } else {
                  console.warn(`Datos de clima incompletos para ${ciudad.nombre}`);
              }
              
          } catch (error) {
              console.error(`Error cargando clima para ${ciudad.nombre}:`, error);
              // Agregar card de error para esta ciudad
              container.innerHTML += `
                  <div class="col-12 col-md-6 col-lg-4 mb-4">
                      <div class="card h-100 border-danger">
                          <div class="card-body text-center text-danger">
                              <h5>${escapeHtml(ciudad.nombre)}</h5>
                              <p>❌ Error cargando datos</p>
                              <small>${error.message}</small>
                          </div>
                      </div>
                  </div>
              `;
          }
      }
      
      // 12. ACTUALIZAR TÍTULO DE LA ZONA
      const tituloZona = zona === "todas" ? "Todas las Zonas" : `Zona ${zona.charAt(0).toUpperCase() + zona.slice(1)}`;
      document.getElementById('subtitulo-zona').textContent = `Clima en ${tituloZona}`;
      
      // 13. ACTUALIZAR ESTADO ACTIVO DE LOS BOTONES
      actualizarZonaActiva(zona);
      
  } catch (error) {
      // 14. MANEJO DE ERRORES GENERALES
      console.error("Error general cargando clima:", error);
      container.innerHTML = `
          <div class="col-12 text-center py-5">
              <div class="alert alert-danger">
                  <h4>❌ Error al cargar clima</h4>
                  <p>No se pudieron cargar los datos meteorológicos.</p>
                  <small>Error: ${escapeHtml(error.message)}</small>
              </div>
          </div>
      `;
  }
}

// =============================================
// FUNCIÓN: CARGAR CLIMA DE UBICACIÓN POR IP
// =============================================
/**
* Carga y muestra el clima de la ubicación actual del usuario mediante IP
* @returns {Promise<void>}
*/
async function cargarUbicacionIP() {
  const container = document.getElementById("ubicacion-container");
  
  try {
      // Mostrar loading
      container.innerHTML = `
          <div class="card">
              <div class="card-body text-center py-4">
                  <div class="spinner-border text-info" role="status"></div>
                  <p class="mt-2 text-muted">Detectando tu ubicación...</p>
              </div>
          </div>
      `;
      
      // Hacer petición a la API de clima por IP
      const res = await fetch('http://localhost:5000/api/meteo/ip');
      
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      
      const data = await res.json();
      
      // Mostrar card de ubicación
      container.innerHTML = `
          <div class="col-12">
              <div class="card shadow border-info">
                  <div class="card-header bg-info text-white">
                      <h5 class="mb-0">📍 Tu Ubicación Actual</h5>
                  </div>
                  <div class="card-body">
                      ${crearCardClima(data.ciudad || "Tu ubicación", data).replace('col-12 col-md-6 col-lg-4 mb-4', '')}
                  </div>
              </div>
          </div>
      `;
      
  } catch (error) {
      container.innerHTML = `
          <div class="col-12">
              <div class="card border-warning">
                  <div class="card-body text-warning text-center">
                      <h5>📍 Tu Ubicación</h5>
                      <p>No se pudo detectar la ubicación automática</p>
                      <small>${error.message}</small>
                  </div>
              </div>
          </div>
      `;
  }
}

// =============================================
// FUNCIÓN: ACTUALIZAR ZONA ACTIVA EN LA INTERFAZ
// =============================================
/**
* Resalta visualmente la zona seleccionada en el navbar y botones
* @param {string} zonaActiva - Zona que está actualmente seleccionada
*/
function actualizarZonaActiva(zonaActiva) {
  // Remover clases activas de todos los enlaces y botones
  document.querySelectorAll('nav a, .btn-group button').forEach(elemento => {
      elemento.classList.remove('active', 'btn-primary');
      elemento.classList.add('btn-outline-primary');
  });
  
  // Activar enlace del navbar
  const enlaceActivo = document.querySelector(`nav a[data-zona="${zonaActiva}"]`);
  if (enlaceActivo) {
      enlaceActivo.classList.add('active');
  }
  
  // Activar botón del grupo
  const botonActivo = document.querySelector(`.btn-group button[data-zona="${zonaActiva}"]`);
  if (botonActivo) {
      botonActivo.classList.remove('btn-outline-primary');
      botonActivo.classList.add('btn-primary');
  }
}

// =============================================
// CONFIGURACIÓN DE EVENTOS AL CARGAR LA PÁGINA
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌤️ Nimbus Clima - Página cargada correctamente");
  
  // 1. CARGAR UBICACIÓN POR IP (SIEMPRE VISIBLE)
  cargarUbicacionIP();
  
  // 2. CARGAR CLIMA DE ZONA NORTE POR DEFECTO
  cargarClima('norte');
  
  // 3. CONFIGURAR EVENTOS PARA LOS ENLACES DEL NAVBAR
  const enlacesNav = document.querySelectorAll('nav a[data-zona]');
  enlacesNav.forEach(enlace => {
      enlace.addEventListener('click', (event) => {
          // Solo prevenir comportamiento en enlaces de zonas (con data-zona)
          if (enlace.hasAttribute('data-zona')) {
              event.preventDefault();
              const zona = enlace.getAttribute('data-zona');
              console.log(`🗺️ Cargando zona: ${zona}`);
              cargarClima(zona);
          }
      });
  });
  
  // 4. CONFIGURAR EVENTOS PARA LOS BOTONES DE ZONAS
  const botonesZonas = document.querySelectorAll('.btn-group button[data-zona]');
  botonesZonas.forEach(boton => {
      boton.addEventListener('click', (event) => {
          const zona = boton.getAttribute('data-zona');
          console.log(`🗺️ Cargando zona: ${zona}`);
          cargarClima(zona);
      });
  });
  
  console.log("✅ Event listeners configurados correctamente");
});