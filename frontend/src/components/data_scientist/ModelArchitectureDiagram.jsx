import React from 'react';
import { FaTable, FaImage, FaArrowRight, FaBrain, FaPlus } from 'react-icons/fa';
import { GiHail } from 'react-icons/gi';

const Card = ({ title, icon, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-center flex flex-col items-center justify-center h-32">
    {icon}
    <h3 className="mt-2 text-sm font-semibold text-gray-700">{title}</h3>
    {children}
  </div>
);

const Arrow = () => (
  <div className="flex items-center justify-center text-gray-400 my-4 lg:my-0">
    <FaArrowRight size="2em" />
  </div>
);

function ModelArchitectureDiagram() {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
        
        {/* Columna 1: Entradas */}
        <div className="space-y-4">
          <Card title="Datos Tabulares" icon={<FaTable size="2em" className="text-blue-500" />} />
          <Card title="Imágenes Satelitales" icon={<FaImage size="2em" className="text-green-500" />} />
        </div>

        {/* Columna 2: Flechas */}
        <Arrow />

        {/* Columna 3: Redes Neuronales */}
        <div className="space-y-4">
          <Card title="Red Neuronal Densa" icon={<FaBrain size="2em" className="text-blue-600" />} />
          <Card title="Red Convolucional (CNN)" icon={<FaBrain size="2em" className="text-green-600" />} />
        </div>

        {/* Columna 4: Flechas y Fusión */}
        <div className="flex flex-col items-center justify-center">
            <div className="h-16 w-px bg-gray-300 hidden lg:block"></div>
            <FaPlus size="1.5em" className="text-gray-500 my-2"/>
            <div className="h-16 w-px bg-gray-300 hidden lg:block"></div>
            <FaArrowRight size="2em" className="text-gray-400 mt-4 hidden lg:block"/>
        </div>

        {/* Columna 5: Predicción */}
        <div>
          <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 shadow-lg text-center flex flex-col items-center justify-center h-32">
            <GiHail size="3em" className="text-blue-700" />
            <h3 className="mt-2 text-base font-bold text-blue-800">Predicción de Granizo</h3>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ModelArchitectureDiagram;
