import React from 'react';

const AlertCard = ({ title, region, probability, time }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-lg">{title}</h3>
      <span className="font-bold text-xl">{probability}%</span>
    </div>
    <p className="text-sm">Región: {region}</p>
    <p className="text-xs text-gray-600">Actualizado: {time}</p>
  </div>
);

const AlertPanel = () => {
  // Datos de ejemplo. Más adelante se conectarán a la API.
  const alerts = [
    { id: 1, title: 'ALERTA ROJA: GRANIZO SEVERO', region: 'Valle de Uco', probability: 95, time: 'Hace 5 minutos' },
    { id: 2, title: 'ALERTA NARANJA: POSIBLE GRANIZO', region: 'Luján de Cuyo', probability: 75, time: 'Hace 12 minutos' },
    { id: 3, title: 'PRECAUCIÓN', region: 'Zona Este', probability: 50, time: 'Hace 30 minutos' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Panel de Alertas Activas</h2>
      <div className="space-y-4">
        {alerts.map(alert => (
          <AlertCard key={alert.id} {...alert} />
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;
