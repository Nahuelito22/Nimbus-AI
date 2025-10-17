import React, { useState, useEffect } from 'react';
import { getSatelliteImage } from '../../api/satellite';

const SATELLITE_BANDS = [7, 8, 13, 14, 15]; // Bandas de ejemplo

function SatelliteViewer() {
    const [selectedBand, setSelectedBand] = useState(SATELLITE_BANDS[2]); // Default to band 13
    const [imageData, setImageData] = useState(null);
    const [legendData, setLegendData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            setLoading(true);
            setError(null);
            setImageData(null);
            setLegendData(null);
            
            try {
                const response = await getSatelliteImage(selectedBand);
                setImageData(response.image);
                setLegendData(response.legend);
            } catch (err) {
                console.error("Error fetching satellite image:", err);
                setError(err.message || 'No se pudo cargar la imagen satelital.');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [selectedBand]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Visor de Imágenes Satelitales</h2>
                <div className="flex items-center">
                    <label htmlFor="band-selector" className="mr-2 text-sm font-medium text-gray-700">Banda:</label>
                    <select
                        id="band-selector"
                        value={selectedBand}
                        onChange={(e) => setSelectedBand(Number(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {SATELLITE_BANDS.map(band => (
                            <option key={band} value={band}>{`Banda ${band}`}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="relative aspect-square w-full bg-gray-200 rounded-md flex items-center justify-center">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Cargando imagen...</p>
                    </div>
                )}
                {error && !loading && (
                    <div className="text-center text-red-600 px-4">
                        <p className='font-semibold'>{error}</p>
                        <p className='text-sm text-gray-500 mt-2'>Asegúrate de que el backend esté funcionando y la API de GOES sea accesible.</p>
                    </div>
                )}
                {!loading && !error && !imageData && (
                     <div className="text-center text-gray-500">
                        <p>La imagen aparecerá aquí.</p>
                    </div>
                )}
                {imageData && (
                    <img src={imageData} alt={`Imagen de satélite - Banda ${selectedBand}`} className="w-full h-full object-contain rounded-md" />
                )}
            </div>

            {legendData && (
                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Leyenda</h3>
                    <img src={legendData} alt="Leyenda de la imagen" className="w-full rounded-md" />
                </div>
            )}
        </div>
    );
}

export default SatelliteViewer;
