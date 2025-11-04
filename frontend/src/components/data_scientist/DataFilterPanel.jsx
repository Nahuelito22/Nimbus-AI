import React, { useState, useEffect } from 'react';

function DataFilterPanel({ options, onFilterChange, isLoading }) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    stations: [],
    departments: [],
  });

  useEffect(() => {
    // Inicializar los filtros cuando las opciones se cargan
    if (options && options.dateRange) {
      setFilters(prev => ({
        ...prev,
        startDate: options.dateRange.min || '',
        endDate: options.dateRange.max || '',
      }));
    }
  }, [options]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFilters(prev => ({ ...prev, [name]: selectedValues }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  if (!options) {
    return <div>Cargando opciones de filtro...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={filters.startDate}
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
          value={filters.endDate}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="departments" className="block text-sm font-medium text-gray-700">Departamentos</label>
        <select
          multiple
          id="departments"
          name="departments"
          onChange={handleMultiSelectChange}
          className="mt-1 block w-full h-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {options.departments?.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Mantén Ctrl (o Cmd) para seleccionar varios.</p>
      </div>

      <div>
        <label htmlFor="stations" className="block text-sm font-medium text-gray-700">Estaciones</label>
        <select
          multiple
          id="stations"
          name="stations"
          onChange={handleMultiSelectChange}
          className="mt-1 block w-full h-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {options.stations?.map(station => (
            <option key={station} value={station}>{station}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Mantén Ctrl (o Cmd) para seleccionar varios.</p>
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
