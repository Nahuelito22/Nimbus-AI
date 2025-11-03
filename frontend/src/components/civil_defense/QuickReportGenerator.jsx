import React, { useState, useEffect } from 'react';

const QuickReportGenerator = ({ highestAlert }) => {
  const initialTemplate = 'ALERTA METEOROLÓGICA - DEFENSA CIVIL MENDOZA\n\nFECHA: [FECHA ACTUAL] HORA: [HORA ACTUAL]\n\nSE INFORMA A LA POBLACIÓN DE LA ZONA [NOMBRE DE LA ZONA] SOBRE UNA ALTA PROBABILIDAD DE CAÍDA DE GRANIZO EN LAS PRÓXIMAS HORAS.\n\n- Probabilidad estimada: [PROBABILIDAD]%\n- Zonas de mayor riesgo: [LISTA DE ZONAS]\n\nRECOMENDACIONES:\n- Proteger vehículos y objetos al aire libre.\n- Asegurar ventanas y techos.\n- Mantenerse informado a través de canales oficiales.\n\nFIN DEL COMUNICADO.';

  const [reportText, setReportText] = useState(initialTemplate);

  useEffect(() => {
    if (highestAlert) {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('es-ES');
      const formattedTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      let newText = initialTemplate
        .replace('[FECHA ACTUAL]', formattedDate)
        .replace('[HORA ACTUAL]', formattedTime)
        .replace('[NOMBRE DE LA ZONA]', highestAlert.region)
        .replace('[PROBABILIDAD]', highestAlert.probability)
        .replace('[LISTA DE ZONAS]', highestAlert.region); // Para este ejemplo, la zona de riesgo es la misma que la región

      setReportText(newText);
    } else {
      // Si no hay alerta, reseteamos la plantilla a su estado inicial con placeholders
      const resetText = initialTemplate
        .replace('[FECHA ACTUAL]', '--/--/----')
        .replace('[HORA ACTUAL]', '--:--')
        .replace('[NOMBRE DE LA ZONA]', 'N/A')
        .replace('[PROBABILIDAD]', '--')
        .replace('[LISTA DE ZONAS]', 'N/A');
      setReportText(resetText);
    }
  }, [highestAlert, initialTemplate]);

  const handleGenerateReport = () => {
    navigator.clipboard.writeText(reportText);
    alert('¡Comunicado copiado al portapapeles!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Generador de Comunicado Rápido</h2>
      <textarea
        className="w-full h-64 p-3 border rounded-md bg-gray-50 font-mono text-sm"
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
      />
      <div className="mt-4 flex justify-end">
        <button 
          onClick={handleGenerateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          disabled={!highestAlert}
        >
          Copiar Comunicado
        </button>
      </div>
    </div>
  );
};

export default QuickReportGenerator;

