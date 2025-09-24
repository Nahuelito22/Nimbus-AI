document.addEventListener('DOMContentLoaded', function() {
    // Menu Opciones
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('hidden');
    });

    // Simular prediccion (Colcar Api Modelo)
    const predictBtn = document.getElementById('predict-btn');
    const gaugeProgress = document.getElementById('gauge-progress');
    const percentageText = document.getElementById('percentage-text');
    const alertStatus = document.getElementById('alert-status');
    const alertBox = document.getElementById('alert-box');
    
    predictBtn.addEventListener('click', function() {
        // Simular llamada a la api - Elimnar luego
        predictBtn.disabled = true;
        predictBtn.textContent = 'Procesando...';
        
        setTimeout(() => {
            // Probabilida random
            const probability = Math.floor(Math.random() * 100);
            
            // Probabilidad + Gauss
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (probability / 100) * circumference;
            gaugeProgress.style.strokeDashoffset = offset;
            
            // UUpdatear el porcentaje
            percentageText.textContent = `${probability}%`;
            
            // Uptade estaus
            if (probability >= 70) {
                alertStatus.textContent = 'ALTA PROBABILIDAD DE GRANIZO';
                alertBox.className = 'p-3 rounded-md bg-red-100 text-red-800';
            } else if (probability >= 40) {
                alertStatus.textContent = 'Probabilidad moderada';
                alertBox.className = 'p-3 rounded-md bg-yellow-100 text-yellow-800';
            } else {
                alertStatus.textContent = 'Baja probabilidad';
                alertBox.className = 'p-3 rounded-md bg-green-100 text-green-800';
            }
            
            predictBtn.disabled = false;
            predictBtn.textContent = 'Predecir Granizo';
        }, 1500);
    });

    // Control de Radar
    const bandSelect = document.getElementById('band-select');
    const paletteSelect = document.getElementById('palette-select');
    const refreshRadar = document.getElementById('refresh-radar');
    const radarImage = document.getElementById('radar-image');
    
    refreshRadar.addEventListener('click', function() {
        // Modificar en la app real
        const band = bandSelect.value;
        const palette = paletteSelect.value;
        
        // Simula carga de la imagen radar
        refreshRadar.disabled = true;
        refreshRadar.textContent = 'Actualizando...';
        radarImage.style.opacity = '0.5';
        
        setTimeout(() => {
            // Modificar para la app real
            radarImage.src = `https://example.com/radar-image?band=${band}&palette=${palette}&t=${new Date().getTime()}`;
            radarImage.style.opacity = '1';
            refreshRadar.disabled = false;
            refreshRadar.textContent = 'Actualizar';
        }, 1000);
    });
});