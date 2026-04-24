import React from 'react';
import { FiAlertTriangle, FiInfo } from 'react-icons/fi';
import useReveal from './useReveal';

const METRICS = [
  {
    label: 'Recall',
    value: '100%',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    description: 'El modelo identifica todos los eventos de granizo reales en el set de prueba.'
  },
  {
    label: 'Precisión',
    value: '~14%',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    description: 'De cada 7 alertas generadas, 1 corresponde a un evento de granizo real.'
  },
  {
    label: 'F1-Score',
    value: '~0.24',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Balance entre Precisión y Recall para un problema altamente desbalanceado.'
  },
  {
    label: 'Versión',
    value: 'V3.1',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    description: 'Modelo Multimodal optimizado con Keras Tuner sobre datos tabulares + imágenes.'
  }
];

function ModelMetrics() {
  const revealRef = useReveal();

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900" id="metricas">
      <div className="container mx-auto px-6" ref={revealRef}>
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Rendimiento</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">
            Métricas del Modelo
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* ⚠️ Research in progress alert */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Investigación en Curso</h4>
              <p className="text-amber-700 dark:text-amber-400/80 text-sm leading-relaxed">
                El Recall del 100% es un indicador de <span className="font-semibold">overfitting</span> que 
                estamos investigando activamente. El modelo actual tiende a sobreajustarse a los patrones del set 
                de entrenamiento. Estamos trabajando en técnicas de regularización, validación cruzada más estricta 
                y ampliación del dataset para lograr métricas más generalizables en futuras versiones.
              </p>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {METRICS.map((metric, index) => (
            <div
              key={index}
              className={`metric-glow rounded-2xl p-6 bg-white dark:bg-gray-800 border ${metric.borderColor} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center`}
            >
              <div className={`w-14 h-14 rounded-xl ${metric.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-extrabold ${metric.color}`}>{metric.value.charAt(0) === '~' ? '≈' : metric.value.charAt(0)}</span>
              </div>
              <p className={`text-3xl font-extrabold ${metric.color} mb-1`}>{metric.value}</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{metric.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Interpretation note */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-5 flex items-start gap-4">
            <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1 text-sm">¿Por qué priorizar el Recall?</h4>
              <p className="text-blue-700 dark:text-blue-400/80 text-sm leading-relaxed">
                En un sistema de alerta, es preferible generar algunas falsas alarmas antes que omitir un evento de granizo 
                real. Por eso el modelo fue optimizado para maximizar la detección (Recall), aceptando un trade-off en precisión.
                Las métricas fueron calculadas sobre un conjunto de prueba del <span className="font-semibold">20% del dataset</span>, 
                con división estratificada para mantener la proporción de clases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ModelMetrics;
