import React, { useState, useEffect } from 'react';

function DataFilterPanel({ dateRange, onDateChange, onSubmit, isLoading }) {
  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (dateRange) {
      setDates({
        startDate: dateRange.min || '',
        endDate: dateRange.max || '',
      });
    }
  }, [dateRange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newDates = { ...dates, [name]: value };
    setDates(newDates);
    // Notificar al padre en cada cambio de fecha
    onDateChange(newDates);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // El padre ya tiene las fechas y las estaciones seleccionadas
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={dates.startDate}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={dates.endDate}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
      >
        {isLoading ? 'Filtrando...' : 'Aplicar Filtros'}
      </button>
    </form>
  );
}

export default DataFilterPanel;