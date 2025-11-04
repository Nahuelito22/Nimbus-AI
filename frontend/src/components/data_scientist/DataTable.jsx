import React, { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 15;

function DataTable({ data, isLoading, onRowClick, selectedRowId }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Resetear a la página 1 cuando los datos cambian
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (isLoading) {
    return <div className="text-center p-4">Cargando datos...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center p-4 text-gray-500">No hay datos para mostrar. Prueba con otros filtros.</div>;
  }

  // Lógica de paginación
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const columns = [
    { Header: 'Fecha', accessor: 'date' },
    { Header: 'Departamento', accessor: 'departamento' },
    { Header: 'Estación', accessor: 'station_name' },
    { Header: 'TMax (C)', accessor: 'TMAX' },
    { Header: 'Precip (mm)', accessor: 'PRCP' },
    { Header: 'Ráfaga Viento (km/h)', accessor: 'om_wind_gusts_10m_max' },
    { Header: 'Granizo', accessor: 'granizo' },
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.accessor} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => {
              const rowId = `${row.date}-${row.station_name}-${startIndex + rowIndex}`;
              const isSelected = rowId === selectedRowId;
              return (
                <tr 
                  key={rowId} 
                  onClick={() => onRowClick(row)}
                  className={`${isSelected ? 'bg-blue-200' : 'hover:bg-gray-50'} cursor-pointer`}
                >
                  {columns.map(col => (
                    <td key={col.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row[col.accessor] !== null && row[col.accessor] !== undefined ? String(row[col.accessor]) : 'N/A'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="py-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{Math.min(startIndex + 1, data.length)}</span> a <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, data.length)}</span> de <span className="font-medium">{data.length}</span> resultados
        </div>
        <div className="flex-1 flex justify-end space-x-2">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages || data.length === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
