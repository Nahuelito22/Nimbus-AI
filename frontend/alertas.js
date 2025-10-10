document.addEventListener("DOMContentLoaded", ()=>{
    const alertaCard=document.getElementById("alerta-card");
    alertaCard.innerHTML="<p>Consultando Pronostico</p>";

    //3 simulamos respuesta con API
    setTimeout(() => {
        const riesgoGranizo = "Bajo"; // Simulamos una respuesta
        alertaCard.innerHTML = `
          <h5>Resultado del análisis</h5>
          <p>Probabilidad de granizo: <strong>${riesgoGranizo}</strong></p>
        `;
      }, 2000); // 2000 ms = 2 segundos de espera
    
});