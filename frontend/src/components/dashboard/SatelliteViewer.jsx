import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { getSatelliteProduct } from '../../api/satellite';
import { FaPlus, FaMinus, FaSyncAlt, FaDownload } from 'react-icons/fa'; // Importar iconos

// 1. Definir los nuevos productos satelitales
const SATELLITE_PRODUCTS = [
    { id: 'band_13', name: 'Banda 13 (Infrarrojo)' },
    { id: 'band_7', name: 'Banda 7 (Onda Corta IR)' },
    { id: 'band_14', name: 'Banda 14 (Infrarrojo Lejano)' },
    { id: 'band_9', name: 'Banda 9 (Vapor de Agua)' },
    { id: 'band_2', name: 'Banda 2 (Visible)' },
];

function SatelliteViewer() {
    // 2. El estado ahora maneja el ID del producto (string)
    const [selectedProduct, setSelectedProduct] = useState(SATELLITE_PRODUCTS[0].id);
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
                // 3. Usar la nueva función de la API
                const response = await getSatelliteProduct(selectedProduct);
                setImageData(response.image);
                setLegendData(response.legend); // Puede ser null para GeoColor
            } catch (err) {
                console.error("Error fetching satellite product:", err);
                setError(err.message || 'No se pudo cargar la imagen satelital.');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [selectedProduct]);

    // 4. Función para descargar la imagen
    const handleDownload = () => {
        if (!imageData) return;
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `nimbus-ai-satellite-${selectedProduct}-${new Date().toISOString()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Visor de Imágenes Satelitales</h2>
                <div className="flex items-center">
                    <label htmlFor="product-selector" className="mr-2 text-sm font-medium text-gray-700">Producto:</label>
                    <select
                        id="product-selector"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {SATELLITE_PRODUCTS.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="relative aspect-square w-full bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Cargando imagen...</p>
                    </div>
                )}
                {error && !loading && (
                    <div className="text-center text-red-600 px-4 z-10">
                        <p className='font-semibold'>{error}</p>
                        <p className='text-sm text-gray-500 mt-2'>Asegúrate de que el backend esté funcionando, tener rol de meteorólogo y conexión a internet.</p>
                    </div>
                )}
                
                {/* 5. Integración del componente de Zoom/Pan */}
                {!loading && !error && imageData && (
                    <TransformWrapper
                        initialScale={1}
                        initialPositionX={0}
                        initialPositionY={0}
                    >
                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                            <React.Fragment>
                                <TransformComponent
                                    wrapperStyle={{ width: '100%', height: '100%' }}
                                    contentStyle={{ width: '100%', height: '100%' }}
                                >
                                    <img src={imageData} alt={`Imagen de satélite - ${selectedProduct}`} className="w-full h-full object-contain" />
                                </TransformComponent>

                                {/* 6. Controles de Zoom y Descarga */}
                                <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
                                    <button onClick={() => zoomIn()} className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors">
                                        <FaPlus />
                                    </button>
                                    <button onClick={() => zoomOut()} className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors">
                                        <FaMinus />
                                    </button>
                                    <button onClick={() => resetTransform()} className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors">
                                        <FaSyncAlt />
                                    </button>
                                    <button onClick={handleDownload} className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-colors mt-4">
                                        <FaDownload />
                                    </button>
                                </div>
                            </React.Fragment>
                        )}
                    </TransformWrapper>
                )}

                {!loading && !error && !imageData && (
                     <div className="text-center text-gray-500">
                        <p>La imagen aparecerá aquí.</p>
                    </div>
                )}
            </div>

            {legendData && (
                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Leyenda de Temperatura (°C)</h3>
                    <img src={legendData} alt="Leyenda de la imagen" className="w-full rounded-md" />
                </div>
            )}
        </div>
    );
}

export default SatelliteViewer;