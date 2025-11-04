import React from 'react';

function DatasetPreview({ data, isLoading }) {
  if (isLoading) {
    return <div className="text-sm text-gray-500">Cargando vista previa del dataset...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-sm text-red-500">No se pudo cargar la vista previa.</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {headers.map(header => (
              <th key={header} className="px-2 py-1 border border-gray-300 text-left font-medium text-gray-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {headers.map(header => (
                <td key={`${rowIndex}-${header}`} className="px-2 py-1 border border-gray-300 text-gray-700 whitespace-nowrap">
                  {String(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DatasetPreview;
