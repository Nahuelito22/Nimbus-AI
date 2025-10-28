import React from 'react';
import AlertPanel from '../components/civil_defense/AlertPanel';
import RiskMap from '../components/civil_defense/RiskMap';
import QuickReportGenerator from '../components/civil_defense/QuickReportGenerator';

const CivilDefensePage = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Portal de Comando de Defensa Civil
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna de Alertas y Reportes (ocupa 1 de 3 columnas) */}
        <div className="lg:col-span-1 space-y-8">
          <AlertPanel />
          <QuickReportGenerator />
        </div>
        
        {/* Columna del Mapa (ocupa 2 de 3 columnas) */}
        <div className="lg:col-span-2">
          <RiskMap />
        </div>

      </div>
    </div>
  );
};

export default CivilDefensePage;
