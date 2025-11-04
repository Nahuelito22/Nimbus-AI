import React from 'react';

function DataTable({ data, isLoading, onRowClick, selectedRowId }) {
  if (isLoading) {
    return <div className="text-center p-4">Cargando datos...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center p-4 text-gray-500">No hay datos para mostrar. Prueba con otros filtros.</div>;
  }

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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th 
                key={col.accessor} 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => {
            // Crear un ID único para la fila que sea más robusto
            const rowId = `${row.date}-${row.station_name}-${rowIndex}`;
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
  );
}

export default DataTable;