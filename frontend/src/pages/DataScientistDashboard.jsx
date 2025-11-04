import React, { useState, useEffect, useCallback } from 'react';
import DatasetPreview from '../components/data_scientist/DatasetPreview';
import InteractiveMap from '../components/data_scientist/InteractiveMap';
import DataFilterPanel from '../components/data_scientist/DataFilterPanel';
import DataTable from '../components/data_scientist/DataTable';
import { getFilterOptions, getDataHead, getFilteredData } from '../api/dataScientist';

function DataScientistDashboard() {
  // Estados de datos y UI
  const [headData, setHeadData] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para los filtros
  const [selectedStations, setSelectedStations] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // Carga inicial de datos (head y opciones de filtros)
  useEffect(() => {
    Promise.all([
      getDataHead(),
      getFilterOptions()
    ]).then(([headResponse, filtersResponse]) => {
      setHeadData(headResponse);
      setFilterOptions(filtersResponse);
      setDateRange({ 
        startDate: filtersResponse.dateRange.min, 
        endDate: filtersResponse.dateRange.max 
      });
      setIsLoading(false);
    }).catch(err => {
      console.error("Error al inicializar el dashboard:", err);
      setError("No se pudo cargar la configuración inicial del dashboard.");
      setIsLoading(false);
    });
  }, []);

  const handleFilterSubmit = useCallback(() => {
    setIsDataLoading(true);
    setError(null);

    const filters = {
      ...dateRange,
      stations: selectedStations,
    };

    getFilteredData(filters)
      .then(response => {
        setFilteredData(response);
      })
      .catch(err => {
        console.error("Error al filtrar datos:", err);
        setError("No se pudieron cargar los datos filtrados.");
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  }, [dateRange, selectedStations]);

  if (isLoading) {
    return <div className="p-4 text-center">Cargando dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard del Científico de Datos</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md">Error: {error}</div>}

      {/* Sección de Vista Previa y Descarga */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Vista Previa del Dataset</h2>
          <a 
            href="/api/ds/download-csv"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            download
          >
            Descargar Dataset Completo (.csv)
          </a>
        </div>
        <DatasetPreview data={headData} isLoading={isLoading} />
      </div>

      {/* Sección Principal Interactiva */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Filtros y Mapa */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-3">Filtros</h2>
            <DataFilterPanel 
              dateRange={filterOptions?.dateRange}
              onDateChange={setDateRange}
              onSubmit={handleFilterSubmit}
              isLoading={isDataLoading}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Mapa de Estaciones</h2>
            <InteractiveMap 
              stations={filterOptions?.stations || []}
              onSelectionChange={setSelectedStations}
            />
             <p className="text-xs text-gray-500 mt-2">Haz clic en los marcadores para seleccionar/deseleccionar estaciones.</p>
          </div>
        </div>

        {/* Columna Derecha: Tabla de Datos */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Datos Filtrados</h2>
          <DataTable data={filteredData} isLoading={isDataLoading} />
        </div>
      </div>
    </div>
  );
}

export default DataScientistDashboard;
