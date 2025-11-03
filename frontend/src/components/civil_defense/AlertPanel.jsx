import React from 'react';

const AlertCard = ({ title, region, probability, time, color }) => {
  const colorClasses = {
    red: 'bg-red-100 border-red-500 text-red-700',
    orange: 'bg-orange-100 border-orange-500 text-orange-700',
    yellow: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };

  return (
    <div className={`${colorClasses[color] || 'bg-gray-100 border-gray-500 text-gray-700'} p-4 rounded-lg shadow-md border-l-4`}>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="font-bold text-xl">{probability}%</span>
      </div>
      <p className="text-sm">Región: {region}</p>
      <p className="text-xs text-gray-600">Actualizado: {time}</p>
    </div>
  );
};

const AlertPanel = ({ alerts }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Panel de Alertas Activas</h2>
      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          alerts.map(alert => (
            <AlertCard key={alert.id} {...alert} />
          ))
        ) : (
          <p className="text-gray-500">No hay alertas activas en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default AlertPanel;

