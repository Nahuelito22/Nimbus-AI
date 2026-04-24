import React from 'react';
import { FiDatabase, FiCloud, FiCode, FiCpu, FiBarChart, FiImage, FiLayers, FiSearch, FiZap, FiCheckCircle, FiSettings } from 'react-icons/fi';
import useReveal from './useReveal';

const STEPS = [
  {
    icon: FiSearch,
    title: 'Exploración API NOAA',
    description: 'Investigación y recopilación de datos climáticos históricos de Mendoza desde 1970 hasta 2024.',
    notebook: '01'
  },
  {
    icon: FiDatabase,
    title: 'Consolidación y Limpieza',
    description: 'Limpieza exhaustiva del dataset crudo, manejo de valores faltantes y normalización de formatos.',
    notebook: '02'
  },
  {
    icon: FiBarChart,
    title: 'Análisis y Modelado Inicial',
    description: 'Primeros modelos base con las features climáticas disponibles. Análisis de correlaciones.',
    notebook: '03'
  },
  {
    icon: FiCloud,
    title: 'Feature Engineering',
    description: 'Enriquecimiento del dataset con variables de Open-Meteo (2000-2024). Ingeniería de features avanzada.',
    notebook: '04'
  },
  {
    icon: FiBarChart,
    title: 'Análisis Exploratorio Avanzado',
    description: 'EDA profundo con visualizaciones detalladas. Detección de patrones estacionales y climatológicos.',
    notebook: '05'
  },
  {
    icon: FiCpu,
    title: 'Modelo Avanzado',
    description: 'Desarrollo de modelos más sofisticados incorporando todas las features enriquecidas.',
    notebook: '06'
  },
  {
    icon: FiImage,
    title: 'Recolección de Imágenes GOES-16',
    description: 'Obtención de imágenes satelitales del satélite GOES-16 para cada evento y no-evento desde 2017.',
    notebook: '07'
  },
  {
    icon: FiSettings,
    title: 'Procesamiento de Imágenes',
    description: 'Pipeline de procesamiento de imágenes satelitales: redimensionado, normalización y augmentation.',
    notebook: '08'
  },
  {
    icon: FiLayers,
    title: 'Modelo Multimodal V3',
    description: 'Arquitectura multimodal que fusiona datos tabulares y visuales en una sola predicción.',
    notebook: '09'
  },
  {
    icon: FiZap,
    title: 'Optimización V3.1',
    description: 'Hiperparametrización con Keras Tuner para encontrar la configuración óptima del modelo.',
    notebook: '10'
  },
  {
    icon: FiCheckCircle,
    title: 'Evaluación Final y Ajuste',
    description: 'Evaluación rigurosa sobre conjunto de prueba estratificado (20%). Ajuste de umbrales de decisión.',
    notebook: '11'
  }
];

function ResearchTimeline() {
  const revealRef = useReveal();

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-800" id="investigacion">
      <div className="container mx-auto px-6" ref={revealRef}>
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Proceso de I+D</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">
            11 etapas de investigación
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Cada notebook documenta una fase clave del desarrollo, desde la recopilación de datos crudos hasta el modelo multimodal optimizado.
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="timeline-line" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex items-start mb-10 md:mb-14 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}
              >
                {/* Icon node */}
                <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 z-10 w-7 h-7 rounded-full bg-blue-600 border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                  <span className="text-white text-[10px] font-bold">{index + 1}</span>
                </div>

                {/* Content card */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                  isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left md:ml-auto'
                }`}>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:-translate-y-1 group">
                    <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{step.title}</h3>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
                    <span className="inline-block mt-2 text-xs text-blue-500 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                      Notebook {step.notebook}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ResearchTimeline;
