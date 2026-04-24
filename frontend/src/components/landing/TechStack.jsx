import React from 'react';
import { 
  FiServer, FiMonitor, FiCpu, FiHardDrive, FiBox, 
  FiCode, FiDatabase, FiLayers, FiPackage, FiGrid 
} from 'react-icons/fi';
import { 
  SiPython, SiReact, SiTailwindcss, SiDocker, SiPostgresql, 
  SiTensorflow, SiPandas, SiScikitlearn, SiFastapi 
} from 'react-icons/si';
import useReveal from './useReveal';

const CATEGORIES = [
  {
    title: 'Backend',
    color: 'from-blue-600 to-indigo-600',
    techs: [
      { name: 'Python', icon: SiPython },
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'SQLAlchemy', icon: FiDatabase }
    ]
  },
  {
    title: 'Frontend',
    color: 'from-sky-500 to-blue-600',
    techs: [
      { name: 'React.js', icon: SiReact },
      { name: 'Vite', icon: FiBox },
      { name: 'Tailwind CSS', icon: SiTailwindcss }
    ]
  },
  {
    title: 'Data Science',
    color: 'from-purple-600 to-indigo-700',
    techs: [
      { name: 'TensorFlow/Keras', icon: SiTensorflow },
      { name: 'Pandas', icon: SiPandas },
      { name: 'Scikit-learn', icon: SiScikitlearn },
    ]
  },
  {
    title: 'Infraestructura',
    color: 'from-teal-600 to-blue-700',
    techs: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'Docker', icon: SiDocker },
      { name: 'Xarray', icon: FiGrid }
    ]
  }
];

function TechStack() {
  const revealRef = useReveal();

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-800" id="stack">
      <div className="container mx-auto px-6" ref={revealRef}>
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Tecnologías</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">
            Stack Tecnológico
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            Herramientas modernas seleccionadas para rendimiento, escalabilidad y productividad.
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Tech categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {CATEGORIES.map((category, catIndex) => (
            <div key={catIndex} className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-600">
              {/* Category header */}
              <div className={`bg-gradient-to-r ${category.color} px-5 py-3`}>
                <h3 className="text-white font-bold text-sm">{category.title}</h3>
              </div>
              
              {/* Tech list */}
              <div className="p-5 space-y-3">
                {category.techs.map((tech, techIndex) => {
                  const Icon = tech.icon;
                  return (
                    <div 
                      key={techIndex}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600/50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Deploy platforms */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-400 dark:text-gray-500">
          <span className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
            🚀 Frontend: <span className="font-medium text-gray-600 dark:text-gray-300">Vercel</span>
          </span>
          <span className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
            ⚙️ Backend: <span className="font-medium text-gray-600 dark:text-gray-300">Render</span>
          </span>
          <span className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
            🤖 Modelo: <span className="font-medium text-gray-600 dark:text-gray-300">Hugging Face Spaces</span>
          </span>
        </div>
      </div>
    </section>
  );
}

export default TechStack;
