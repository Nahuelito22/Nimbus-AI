document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('noticias-container');
  
    fetch('http://localhost:5000/api/noticias/general')
      .then(res => res.json())
      .then(data => {
        const noticias = data.noticias;
  
        if (!noticias || noticias.length === 0) {
          contenedor.innerHTML = '<p>No se encontraron noticias.</p>';
          return;
        }
  
        noticias.forEach(noticia => {
          const card = document.createElement('div');
          card.className = 'card col-md-4 m-2';
          card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">${noticia.titulo}</h5>
              <p class="card-text">${noticia.descripcion}</p>
              <a href="${noticia.url}" target="_blank" class="btn btn-primary btn-sm">Leer más</a>
              <p class="text-muted mt-1" style="font-size: 0.8rem;">Fuente: ${noticia.fuente} | ${noticia.fecha}</p>
            </div>
          `;
          contenedor.appendChild(card);
        });
      })
      .catch(err => {
        console.error('Error al cargar noticias:', err);
        contenedor.innerHTML = '<p>Error al cargar noticias. Revisa la consola.</p>';
      });
  });
  