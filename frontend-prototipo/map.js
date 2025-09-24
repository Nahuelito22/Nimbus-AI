document.addEventListener('DOMContentLoaded', function() {
    // Incializar mapa solo cuando el dashboard de usuario es visible
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const userDashboard = document.getElementById('user-dashboard');
                if (!userDashboard.classList.contains('hidden')) {
                    initMap();
                    observer.disconnect();
                }
            }
        });
    });
    
    observer.observe(document.getElementById('user-dashboard'), {
        attributes: true
    });
    
    function initMap() {
        // Contenedor del mapa
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        // Iniciar mapa en argentina
        const map = L.map('map').setView([-32.8908, -68.8458], 8);
        
        // Añadir titulo del mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Añadir marcador al hacer click
        let marker;
        map.on('click', function(e) {
            if (marker) {
                map.removeLayer(marker);
            }
            
            marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            
            // En la app real guardar la ubicacion real de la persona 
            console.log('Selected location:', e.latlng.lat, e.latlng.lng);
            
            // Mostrar notificaciones
            showNotification('Ubicación seleccionada: ' + e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4));
        });
        
        // Agregar geolocalizacion boton
        const geolocateBtn = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: function(map) {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.innerHTML = '<button class="bg-blue-600 text-white p-2 rounded-md">📍 Mi Ubicación</button>';
                container.onclick = function() {
                    map.locate({setView: true, maxZoom: 12});
                };
                return container;
            }
        });
        
        map.addControl(new geolocateBtn());
        
        // Se encuentra la ubicacion del usuario
        map.on('locationfound', function(e) {
            if (marker) {
                map.removeLayer(marker);
            }
            
            marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            showNotification('Tu ubicación actual: ' + e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4));
        });
        
        // Error al encontrar la ubicacion
        map.on('locationerror', function(e) {
            showNotification('No se pudo obtener tu ubicación: ' + e.message, 'error');
        });
    }
    
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});