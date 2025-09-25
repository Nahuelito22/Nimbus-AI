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
// FUNCIÓN PRINCIPAL: CARGAR NOTICIAS POR CATEGORÍA
// =============================================
/**
 * Carga y muestra noticias de una categoría específica desde la API
 * @param {string} categoria - Categoría de noticias ('general', 'deportes', 'clima')
 */
async function cargarNoticias(categoria = 'general') {
  // 1. OBTENER CONTENEDOR DONDE SE MOSTRARÁN LAS NOTICIAS
  const noticiasContainer = document.getElementById("noticias-container");
  
  try {
    // 2. MOSTRAR INDICADOR DE CARGA (FEEDBACK VISUAL)
    noticiasContainer.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando noticias...</span>
        </div>
        <p class="mt-2 text-muted">Cargando noticias de ${categoria}...</p>
      </div>
    `;
    
    // 3. HACER PETICIÓN A LA API (URL DINÁMICA SEGÚN CATEGORÍA)
    const res = await fetch(`http://localhost:5000/api/noticias/${categoria}`);
    
    // 4. VERIFICAR SI LA RESPUESTA ES EXITOSA
    if (!res.ok) {
      throw new Error(`Error en la API: ${res.status} - ${res.statusText}`);
    }
    
    // 5. CONVERTIR RESPUESTA A JSON
    const data = await res.json();
    
    // 6. LIMPIAR CONTENEDOR ANTES DE AGREGAR NUEVAS NOTICIAS
    noticiasContainer.innerHTML = '';
    
    // 7. VERIFICAR SI HAY NOTICIAS DISPONIBLES
    if (data.noticias && data.noticias.length > 0) {
      // 8. CREAR UNA TARJETA POR CADA NOTICIA
      data.noticias.forEach((noticia, index) => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4 mb-4"; // Responsive grid
        
        // 9. PLANTILLA HTML PARA CADA NOTICIA
        col.innerHTML = `
          <div class="card h-100 shadow-sm hover-shadow">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-primary">${escapeHtml(noticia.titulo)}</h5>
              <p class="card-text flex-grow-1 text-muted">${escapeHtml(noticia.descripcion)}</p>
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <strong>${escapeHtml(noticia.fuente)}</strong><br>
                    ${escapeHtml(noticia.fecha)}
                  </small>
                  <a href="${noticia.url}" target="_blank" class="btn btn-sm btn-outline-primary">
                    Leer más
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // 10. AGREGAR LA NOTICIA AL CONTENEDOR
        noticiasContainer.appendChild(col);
      });
    } else {
      // 11. MOSTRAR MENSAJE SI NO HAY NOTICIAS
      noticiasContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="alert alert-info">
            <h4>📰 No hay noticias disponibles</h4>
            <p>No se encontraron noticias para la categoría <strong>${categoria}</strong>.</p>
          </div>
        </div>
      `;
    }
    
    // 12. ACTUALIZAR TÍTULO PRINCIPAL DE LA PÁGINA
    const tituloCategoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    document.getElementById('titulo-principal').textContent = `Noticias ${tituloCategoria}`;
    
    // 13. ACTUALIZAR ESTADO ACTIVO DE LOS BOTONES DEL NAV
    actualizarCategoriaActiva(categoria);
    
  } catch (error) {
    // 14. MANEJO DE ERRORES
    console.error("Error detallado:", error);
    noticiasContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-danger">
          <h4>❌ Error al cargar noticias</h4>
          <p>No se pudieron cargar las noticias. Verifica que el servidor esté ejecutándose.</p>
          <small>Error: ${error.message}</small>
        </div>
      </div>
    `;
  }
}

// =============================================
// FUNCIÓN: ACTUALIZAR CATEGORÍA ACTIVA EN EL NAV
// =============================================
/**
 * Resalta visualmente la categoría seleccionada en el navbar
 * @param {string} categoriaActiva - Categoría que está actualmente seleccionada
 */
function actualizarCategoriaActiva(categoriaActiva) {
  // 1. OBTENER TODOS LOS ENLACES DEL NAVBAR
  const enlacesNav = document.querySelectorAll('nav a');
  
  // 2. REMOVER CLASE 'ACTIVA' DE TODOS LOS ENLACES
  enlacesNav.forEach(enlace => {
    enlace.classList.remove('active', 'fw-bold');
  });
  
  // 3. AGREGAR CLASE 'ACTIVA' AL ENLACE CORRESPONDIENTE
  const enlaceActivo = document.querySelector(`nav a[data-cat="${categoriaActiva}"]`);
  if (enlaceActivo) {
    enlaceActivo.classList.add('active', 'fw-bold');
  }
}

// =============================================
// CONFIGURACIÓN DE EVENTOS AL CARGAR LA PÁGINA
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Nimbus News - Página cargada correctamente");
  
  cargarNoticias('general');
  
  const enlacesNav = document.querySelectorAll('nav a');
  
  enlacesNav.forEach(enlace => {
      enlace.addEventListener('click', (event) => {
          // SOLO prevenir enlaces de categorías (con data-cat)
          if (enlace.hasAttribute('data-cat')) {
              event.preventDefault();
              const categoria = enlace.getAttribute('data-cat');
              console.log(`📂 Cargando categoría: ${categoria}`);
              cargarNoticias(categoria);
          }
          // Los enlaces normales (como "clima.html") navegan normalmente
      });
  });

  
  // 6. MENSAJE DE CONFIRMACIÓN EN CONSOLA
  console.log("✅ Event listeners configurados correctamente");
});
