import React, { useState } from 'react';

const QuickReportGenerator = () => {
  const [reportText, setReportText] = useState(
    'ALERTA METEOROLÓGICA - DEFENSA CIVIL MENDOZA\n\nFECHA: [FECHA ACTUAL] HORA: [HORA ACTUAL]\n\nSE INFORMA A LA POBLACIÓN DE LA ZONA [NOMBRE DE LA ZONA] SOBRE UNA ALTA PROBABILIDAD DE CAÍDA DE GRANIZO EN LAS PRÓXIMAS HORAS.\n\n- Probabilidad estimada: [PROBABILIDAD]%\n- Zonas de mayor riesgo: [LISTA DE ZONAS]\n\nRECOMENDACIONES:\n- Proteger vehículos y objetos al aire libre.\n- Asegurar ventanas y techos.\n- Mantenerse informado a través de canales oficiales.\n\nFIN DEL COMUNICADO.'
  );

  const handleGenerateReport = () => {
    // Lógica para copiar al portapapeles o generar un archivo de texto.
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Copiar Comunicado
        </button>
      </div>
    </div>
  );
};

export default QuickReportGenerator;
