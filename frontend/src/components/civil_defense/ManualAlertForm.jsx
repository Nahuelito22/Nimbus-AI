import React, { useState } from 'react';

const ManualAlertForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('yellow');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert('Por favor, ingrese un título para la alerta.');
      return;
    }
    onSubmit({ title, color });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Alerta Manual</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Título de la Alerta</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Caída de granizo en Luján"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="color" className="block text-gray-700 font-bold mb-2">Nivel de Riesgo</label>
            <select
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="yellow">Amarillo (Precaución)</option>
              <option value="orange">Naranja (Alta Probabilidad)</option>
              <option value="red">Rojo (Inminente)</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Crear Alerta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualAlertForm;
