import React, { useState, useEffect, useCallback } from 'react';
import DatasetPreview from '../components/data_scientist/DatasetPreview';
import InteractiveMap from '../components/data_scientist/InteractiveMap';
import DataFilterPanel from '../components/data_scientist/DataFilterPanel';
import DataTable from '../components/data_scientist/DataTable';
import ModelArchitectureDiagram from '../components/data_scientist/ModelArchitectureDiagram'; // Importar el nuevo componente
import { getFilterOptions, getDataHead, getFilteredData, downloadFilteredData } from '../api/dataScientist';

function DataScientistDashboard() {
  // Estados de datos y UI
  const [headData, setHeadData] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para los filtros
  const [selectedStations, setSelectedStations] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // Carga inicial
  useEffect(() => {
    Promise.all([getDataHead(), getFilterOptions()])
      .then(([headRes, filtersRes]) => {
        setHeadData(headRes);
        setFilterOptions(filtersRes);
        setDateRange({ startDate: filtersRes.dateRange.min, endDate: filtersRes.dateRange.max });
      })
      .catch(err => {
        setError("No se pudo cargar la configuración inicial del dashboard.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getCurrentFilters = useCallback(() => ({
    ...dateRange,
    stations: selectedStations,
  }), [dateRange, selectedStations]);

  const handleFilterSubmit = useCallback(() => {
    setIsDataLoading(true);
    setError(null);
    getFilteredData(getCurrentFilters())
      .then(setFilteredData)
      .catch(err => setError("No se pudieron cargar los datos filtrados."))
      .finally(() => setIsDataLoading(false));
  }, [getCurrentFilters]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      await downloadFilteredData(getCurrentFilters());
    } catch (err) {
      setError(err.message || "Error al descargar el archivo.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Cargando dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard del Científico de Datos</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">Error: {error}</div>}

      {/* Sección de Vista Previa y Descarga */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Vista Previa del Dataset</h2>
          <a href="/api/ds/download-csv" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium" download>Descargar Dataset Completo</a>
        </div>
        <DatasetPreview data={headData} isLoading={isLoading} />
      </div>

      {/* Sección Principal Interactiva */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-3">Filtros</h2>
            <DataFilterPanel dateRange={filterOptions?.dateRange} onDateChange={setDateRange} onSubmit={handleFilterSubmit} isLoading={isDataLoading} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Mapa de Estaciones</h2>
            <InteractiveMap stations={filterOptions?.stations || []} onSelectionChange={setSelectedStations} />
            <p className="text-xs text-gray-500 mt-2">Haz clic en los marcadores para seleccionar/deseleccionar.</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Datos Filtrados</h2>
            <button onClick={handleDownload} disabled={isDownloading || filteredData.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-300 disabled:cursor-not-allowed">
              {isDownloading ? 'Descargando...' : 'Descargar Selección (.csv)'}
            </button>
          </div>
          <DataTable data={filteredData} isLoading={isDataLoading} />
        </div>
      </div>

      {/* Sección de Arquitectura del Modelo */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Arquitectura del Modelo Nimbus AI</h2>
        <ModelArchitectureDiagram />
      </div>

    </div>
  );
}

export default DataScientistDashboard;
