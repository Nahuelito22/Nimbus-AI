import React from 'react';

function AdminPage() {
  return (
    <div className="p-6 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>

        {/* User Management Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Gestión de Usuarios</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="w-full bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Rol</th>
                  <th className="py-2 px-4 border-b">Estado</th>
                  <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Ejemplo de usuario aprobado */}
                <tr>
                  <td className="py-2 px-4 border-b">Juan Pérez</td>
                  <td className="py-2 px-4 border-b">juan@example.com</td>
                  <td className="py-2 px-4 border-b">Usuario Común</td>
                  <td className="py-2 px-4 border-b">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Aprobado</span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                  </td>
                </tr>
                {/* Ejemplo de usuario pendiente */}
                <tr>
                  <td className="py-2 px-4 border-b">María García</td>
                  <td className="py-2 px-4 border-b">maria@example.com</td>
                  <td className="py-2 px-4 border-b">Meteorólogo</td>
                  <td className="py-2 px-4 border-b">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Pendiente</span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button className="text-green-600 hover:text-green-800 mr-2 text-sm font-semibold">Aprobar</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Rechazar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            + Agregar Usuario
          </button>
        </div>

        {/* System Settings Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Configuración del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-gray-700 mb-2">Umbral de Alerta (%)</label>
                  <input type="number" min="0" max="100" defaultValue="70" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                  <label className="block text-gray-700 mb-2">Frecuencia de Actualización (min)</label>
                  <input type="number" min="5" max="60" defaultValue="15" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                  <label className="block text-gray-700 mb-2">Fuente de Datos</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                      <option>NOAA + ERA5</option>
                      <option>OpenWeather</option>
                      <option>SMN Argentina</option>
                  </select>
              </div>
              <div>
                  <label className="block text-gray-700 mb-2">Estado del Modelo</label>
                  <div className="flex items-center p-2 border rounded-md">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>Activo y funcionando</span>
                  </div>
              </div>
          </div>
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
