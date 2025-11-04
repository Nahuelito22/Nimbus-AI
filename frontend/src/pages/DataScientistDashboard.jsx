import React, { useState, useEffect } from 'react';
import DataFilterPanel from '../components/data_scientist/DataFilterPanel';
import DataTable from '../components/data_scientist/DataTable';
import ModelSimulator from '../components/data_scientist/ModelSimulator';
import { getDataScientistFilters, getFilteredData } from '../api/dataScientist';

function DataScientistDashboard() {
  const [filterOptions, setFilterOptions] = useState(null);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar las opciones de los filtros al montar el componente
    getDataScientistFilters()
      .then(response => {
        setFilterOptions(response);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching filters:", error);
        setError("No se pudieron cargar los filtros para el dashboard.");
        setIsLoading(false);
      });
  }, []);

  const handleFilterChange = (filters) => {
    setIsDataLoading(true);
    setError(null);
    getFilteredData(filters)
      .then(response => {
        setData(response);
        setSelectedRow(null); // Deseleccionar fila al filtrar
        setIsDataLoading(false);
      })
      .catch(error => {
        console.error("Error fetching filtered data:", error);
        setError("No se pudieron cargar los datos filtrados.");
        setIsDataLoading(false);
      });
  };

  // Añadir un manejador para la selección de fila en la tabla
  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Cargando configuración del dashboard...</div>;
  }

  if (error && !filterOptions) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard del Científico de Datos</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">Error: {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Columna de Filtros */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Filtros</h2>
          <DataFilterPanel 
            options={filterOptions} 
            onFilterChange={handleFilterChange} 
            isLoading={isDataLoading}
          />
        </div>

        {/* Columna Principal de Datos y Gráficos */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Datos Exploratorios</h2>
            <DataTable 
              data={data} 
              isLoading={isDataLoading} 
              onRowClick={handleRowSelect} // Pasar la función de clic
              selectedRowId={selectedRow ? selectedRow.date + selectedRow.station_name : null} // Identificador único para la fila
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Simulador de Modelo (What-If)</h2>
            <ModelSimulator selectedRow={selectedRow} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default DataScientistDashboard;