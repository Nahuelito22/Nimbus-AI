import React, { useState, useEffect } from 'react';
import { FiSliders, FiImage, FiActivity, FiZap, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import useReveal from './useReveal';

const SATELLITE_SCENARIOS = [
  {
    id: 'clear',
    name: 'Despejado',
    description: 'Sin firmas térmicas significativas.',
    score: 5,
    color: 'bg-sky-400'
  },
  {
    id: 'convective',
    name: 'Convectivo',
    description: 'Nubes en desarrollo vertical detectadas.',
    score: 45,
    color: 'bg-blue-500'
  },
  {
    id: 'storm',
    name: 'Tormenta',
    description: 'Topes nubosos muy fríos y alta reflectividad.',
    score: 95,
    color: 'bg-indigo-700'
  }
];

function NimbusPlayground() {
  const revealRef = useReveal();
  
  // Tabular States (DNN)
  const [temp, setTemp] = useState(28);
  const [humidity, setHumidity] = useState(65);
  const [pressure, setPressure] = useState(1010);
  
  // Visual State (CNN)
  const [scenario, setScenario] = useState(SATELLITE_SCENARIOS[1]);
  
  // Final Prediction
  const [probability, setProbability] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsProcessing(true);
    const timer = setTimeout(() => {
      // Heuristic logic:
      // Tabular score: temp > 25 is bad, humidity > 50 is bad
      const tScore = Math.max(0, (temp - 20) * 3) + Math.max(0, (humidity - 40) * 0.8);
      const tabularNormalized = Math.min(100, tScore);
      
      // Multimodal fusion: 40% Tabular + 60% Visual
      const result = (tabularNormalized * 0.4) + (scenario.score * 0.6);
      setProbability(Math.round(result));
      setIsProcessing(false);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [temp, humidity, pressure, scenario]);

  const getAlertLevel = () => {
    if (probability < 30) return { label: 'Bajo Riesgo', color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-200' };
    if (probability < 70) return { label: 'Alerta Amarilla', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-200' };
    return { label: 'Alerta Roja', color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-200' };
  };

  const alert = getAlertLevel();

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-800 overflow-hidden" id="playground">
      <div className="container mx-auto px-6" ref={revealRef}>
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Interacción</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">
            Nimbus Playground
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            Simulá condiciones climáticas y observá cómo las redes neuronales procesan los datos en tiempo real.
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            {/* DNN Inputs */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                <FiSliders className="w-5 h-5" />
                <h3 className="font-bold uppercase text-xs tracking-widest">Entrada Tabular (DNN)</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperatura</label>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{temp}°C</span>
                  </div>
                  <input 
                    type="range" min="15" max="40" value={temp} 
                    onChange={(e) => setTemp(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Humedad</label>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{humidity}%</span>
                  </div>
                  <input 
                    type="range" min="20" max="95" value={humidity} 
                    onChange={(e) => setHumidity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* CNN Inputs */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400">
                <FiImage className="w-5 h-5" />
                <h3 className="font-bold uppercase text-xs tracking-widest">Entrada Satelital (CNN)</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {SATELLITE_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setScenario(sc)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      scenario.id === sc.id 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${sc.color} flex-shrink-0 shadow-inner`} />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{sc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{sc.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Architecture Visualizer */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-10">
            <div className="relative w-full max-w-[280px]">
              {/* Path 1: DNN */}
              <div className="flex flex-col items-center mb-8">
                <div className={`w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg transition-transform ${isProcessing ? 'scale-110' : ''}`}>
                  <FiActivity className="w-8 h-8" />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-blue-600 dark:text-blue-400">DNN Tabular</p>
                  <div className={`h-12 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 mx-auto mt-2 ${isProcessing ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              {/* Path 2: CNN */}
              <div className="flex flex-col items-center mb-8">
                <div className={`w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg transition-transform ${isProcessing ? 'scale-110' : ''}`}>
                  <FiImage className="w-8 h-8" />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-indigo-600 dark:text-indigo-400">CNN Visión</p>
                  <div className={`h-12 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-600 mx-auto mt-2 ${isProcessing ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              {/* Fusion Layer */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xl ring-4 ring-white dark:ring-gray-800">
                  <FiZap className="w-6 h-6" />
                </div>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Capa de Fusión</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Result */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white dark:bg-gray-800 h-full p-8 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Decorative glow */}
              <div className={`absolute top-0 inset-x-0 h-1 ${alert.bg} opacity-50`} />
              
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Probabilidad de Granizo</span>
              
              <div className="relative mb-6">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96" cy="96" r="80"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-gray-100 dark:text-gray-700"
                  />
                  <circle
                    cx="96" cy="96" r="80"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={502.4}
                    strokeDashoffset={502.4 - (502.4 * probability) / 100}
                    strokeLinecap="round"
                    className={`${alert.color} transition-all duration-1000 ease-out`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-black ${alert.color}`}>{probability}%</span>
                </div>
              </div>

              <div className={`px-4 py-2 rounded-full text-sm font-bold mb-6 ${alert.bg} text-white shadow-md animate-fade-in`}>
                {alert.label}
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed italic">
                {probability < 30 ? '"Condiciones estables. No se prevén eventos significativos."' : 
                 probability < 70 ? '"Inestabilidad moderada. Se recomienda monitorear radares locales."' : 
                 '"Riesgo inminente de granizo. Activar protocolos de protección civil."'}
              </p>

              {/* Multimodal info badge */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 w-full flex items-center justify-center gap-2">
                <FiCheckCircle className="text-blue-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Inferencia Multimodal V3.1</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default NimbusPlayground;
