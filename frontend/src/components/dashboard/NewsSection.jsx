import React from 'react';

const NewsSection = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Noticias Meteorológicas</h2>
        <div className="space-y-4">
            <div className="border-b pb-4">
                <h3 className="font-bold text-lg mb-2">Tormentas severas en el este de Mendoza</h3>
                <p className="text-gray-600 mb-3 text-sm">Se esperan fuertes lluvias y posible granizo en las próximas horas...</p>
                <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">Leer más</a>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-2">Nueva tecnología en predicción de granizo</h3>
                <p className="text-gray-600 mb-3 text-sm">Científicos desarrollan modelos más precisos para predecir granizo...</p>
                <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">Leer más</a>
            </div>
        </div>
    </div>
  );
};

export default NewsSection;
