import React from 'react';
import { FiDatabase, FiCloud, FiGlobe, FiStar, FiAward } from 'react-icons/fi';
import useReveal from './useReveal';

const SOURCES = [
  {
    icon: FiDatabase,
    name: 'NOAA',
    period: '1970 - 2024',
    description: 'Registros climáticos históricos de Mendoza. Línea base del dataset con temperatura, precipitación, presión y más.',
    tag: 'Datos Climáticos'
  },
  {
    icon: FiCloud,
    name: 'Open-Meteo',
    period: '2000 - 2024',
    description: 'Enriquecimiento con variables climáticas adicionales vía API: humedad, viento, índices de inestabilidad y más.',
    tag: 'Enriquecimiento'
  },
  {
    icon: FiGlobe,
    name: 'TuTiempo.net + Noticias',
    period: '2000 - 2024',
    description: 'Etiquetado de eventos de granizo mediante web scraping y verificación manual exhaustiva de registros históricos.',
    tag: 'Etiquetado'
  },
  {
    icon: FiStar,
    name: 'Satélite GOES-16',
    period: '2017 - 2024',
    description: 'Imágenes satelitales para cada fecha de evento y no-evento, utilizadas en el modelo multimodal V3.',
    tag: 'Imágenes Satelitales'
  }
];

function DatasetSection() {
  const revealRef = useReveal();

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900" id="dataset">
      <div className="container mx-auto px-6" ref={revealRef}>
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Datos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">
            Dataset & Fuentes de Datos
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* 🏆 First dataset highlight */}
        <div className="max-w-3xl mx-auto mb-14">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <FiAward className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Primer dataset etiquetado de granizo en Argentina 🇦🇷</h3>
                <p className="text-blue-100/90 leading-relaxed text-sm md:text-base">
                  Nimbus AI incluye el <span className="font-semibold text-white">primer dataset etiquetado de eventos de granizo 
                  en Argentina</span> de este calibre, disponible bajo <span className="font-semibold text-white">licencia MIT</span>. 
                  Una contribución abierta a la comunidad científica para impulsar la investigación meteorológica en la región.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Source cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {SOURCES.map((source, index) => {
            const Icon = source.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{source.name}</h3>
                <span className="inline-block text-xs text-blue-500 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded mb-3">{source.period}</span>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3">{source.description}</p>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{source.tag}</span>
              </div>
            );
          })}
        </div>

        {/* Process summary */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-10 max-w-2xl mx-auto">
          El dataset fue construido en un proceso iterativo de enriquecimiento progresivo, resultando en el archivo 
          <code className="text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded mx-1 text-xs">dataset_final_enriquecido.csv</code>
          utilizado para entrenar el modelo V3.1.
        </p>
      </div>
    </section>
  );
}

export default DatasetSection;
