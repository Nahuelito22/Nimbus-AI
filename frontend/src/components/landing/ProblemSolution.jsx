import React from 'react';
import { FiAlertTriangle, FiShield, FiBarChart2, FiUsers, FiLayers, FiTarget } from 'react-icons/fi';
import useReveal from './useReveal';

function ProblemSolution() {
  const revealRef = useReveal();

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900" id="problema">
      <div className="container mx-auto px-6" ref={revealRef}>
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">El Desafío</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">
            Un problema real, una solución inteligente
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Problem */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
              <FiAlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 pt-16 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">El Problema</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                El granizo representa una <span className="font-semibold text-red-600 dark:text-red-400">amenaza significativa</span> en 
                regiones agrícolas como Mendoza, causando anualmente <span className="font-semibold">pérdidas millonarias</span> en 
                cultivos, así como daños a propiedades y vehículos.
              </p>
              <ul className="space-y-3">
                {[
                  'Pérdidas agrícolas anuales millonarias',
                  'Daños a propiedades y vehículos',
                  'Sistemas de alerta tradicionales poco específicos',
                  'Falta de anticipación para prevención eficaz'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                    <span className="mt-1.5 w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <FiShield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 pt-16 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">La Solución</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Nimbus AI ofrece una solución <span className="font-semibold text-blue-600 dark:text-blue-400">proactiva y focalizada</span>, 
                combinando datos meteorológicos e imágenes satelitales para predecir granizo con IA.
              </p>
              <div className="space-y-4">
                {[
                  { icon: FiLayers, title: 'Modelo Multimodal', desc: 'Fusiona datos numéricos (temperatura, humedad, viento, presión) con imágenes satelitales GOES-16.' },
                  { icon: FiBarChart2, title: 'Salida Probabilística', desc: 'Entrega una probabilidad de granizo para decisiones informadas según el umbral de riesgo.' },
                  { icon: FiUsers, title: 'Dashboards por Rol', desc: 'Paneles especializados para Meteorólogos, Defensa Civil, Científicos de Datos y Administradores.' }
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex gap-4 items-start p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemSolution;
