import React from 'react';
import { FiMonitor, FiServer, FiCpu, FiArrowRight, FiArrowDown } from 'react-icons/fi';
import useReveal from './useReveal';

const BLOCKS = [
  {
    icon: FiMonitor,
    title: 'Frontend',
    subtitle: 'Vercel',
    tech: 'React + Vite',
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-400/30',
    features: ['Interfaz de Usuario', 'Dashboards por Rol', 'Mapas Interactivos', 'Radar Meteorológico']
  },
  {
    icon: FiServer,
    title: 'Backend',
    subtitle: 'Render',
    tech: 'Python + FastAPI',
    color: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-400/30',
    features: ['Recepción y Validación', 'Autenticación JWT', 'Base de Datos PostgreSQL', 'Proxy al Modelo IA']
  },
  {
    icon: FiCpu,
    title: 'Modelo IA',
    subtitle: 'Hugging Face',
    tech: 'TensorFlow + Docker',
    color: 'from-indigo-600 to-purple-700',
    borderColor: 'border-indigo-400/30',
    features: ['Procesamiento Tabular', 'Procesamiento de Imagen', 'Fusión Multimodal', 'Respuesta Probabilística']
  }
];

function ArchitectureSection() {
  const revealRef = useReveal();

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-800" id="arquitectura">
      <div className="container mx-auto px-6" ref={revealRef}>
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Infraestructura</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">
            Arquitectura del Sistema
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Una arquitectura de microservicios distribuida en tres plataformas cloud independientes.
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Architecture blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {BLOCKS.map((block, index) => {
            const Icon = block.icon;
            return (
              <React.Fragment key={index}>
                <div className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${block.borderColor} bg-white dark:bg-gray-700/50 group`}>
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-r ${block.color} p-5 text-white`}>
                    <div className="flex items-center gap-3">
                      <Icon className="w-7 h-7" />
                      <div>
                        <h3 className="text-lg font-bold">{block.title}</h3>
                        <p className="text-white/70 text-xs">{block.subtitle}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-mono text-white/80 bg-white/10 rounded px-2 py-0.5 inline-block">{block.tech}</p>
                  </div>

                  {/* Features list */}
                  <div className="p-5">
                    <ul className="space-y-2">
                      {block.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow between blocks (desktop) */}
                {index < BLOCKS.length - 1 && (
                  <>
                    <div className="hidden md:flex items-center justify-center -mx-6" style={{ gridColumn: 'auto', display: 'none' }}>
                      {/* hidden on grid; arrows handled via flex gap */}
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Flow arrows for mobile */}
        <div className="flex flex-col items-center md:hidden mt-4 gap-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">Los datos fluyen de izquierda a derecha (Frontend → Backend → Modelo IA)</p>
        </div>

        {/* Data flow description */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-medium">Usuario</span>
            <FiArrowRight className="w-4 h-4" />
            <span className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">Frontend</span>
            <FiArrowRight className="w-4 h-4" />
            <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">Backend</span>
            <FiArrowRight className="w-4 h-4" />
            <span className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">Modelo IA</span>
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            Documentación de la API disponible en <a href="https://nahuelito22-nimbus-ai.hf.space/api/docs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Swagger/OpenAPI</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureSection;
