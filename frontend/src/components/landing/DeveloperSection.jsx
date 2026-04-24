import React from 'react';
import { FiGithub, FiMail, FiCode, FiUser } from 'react-icons/fi';
import useReveal from './useReveal';

function DeveloperSection() {
  const revealRef = useReveal();

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900" id="equipo">
      <div className="container mx-auto px-6" ref={revealRef}>
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Equipo</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">
            Sobre el Desarrollador
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lead Developer */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Gradient accent */}
            <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
            
            <div className="p-8 text-center">
              {/* Photo placeholder: Place your photo at /public/dev_nahuel.jpg */}
              <div className="w-28 h-28 rounded-full mx-auto mb-5 overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-700 dark:to-indigo-800 flex items-center justify-center shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/50">
                <img 
                  src="/dev_nahuel.jpg" 
                  alt="Nahuel Ghilardi"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback: show icon if photo not yet uploaded
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<svg class="w-14 h-14 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                  }}
                />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nahuel Ghilardi</h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-1">Desarrollador Principal & Data Scientist</p>
              
              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Roles en el proyecto</p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {['Data Science', 'Machine Learning', 'Backend', 'Frontend', 'DevOps'].map((role) => (
                    <span key={role} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-medium">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-5 leading-relaxed">
                Idea original, investigación, desarrollo del modelo de IA, diseño de la arquitectura, 
                implementación del backend y frontend completos.
              </p>
              
              {/* Links */}
              <div className="flex justify-center gap-3 mt-6">
                <a 
                  href="https://github.com/Nahuelito22" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
                >
                  <FiGithub className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </a>
                <a 
                  href="mailto:matiasghilardisalinas@gmail.com"
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
                >
                  <FiMail className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Collaborator */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Gradient accent */}
            <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-600" />
            
            <div className="p-8 text-center">
              {/* Avatar placeholder */}
              <div className="w-28 h-28 rounded-full mx-auto mb-5 overflow-hidden bg-gradient-to-br from-teal-200 to-emerald-300 dark:from-teal-700 dark:to-emerald-800 flex items-center justify-center shadow-lg ring-4 ring-teal-100 dark:ring-teal-900/50">
                <FiUser className="w-14 h-14 text-teal-600 dark:text-teal-300" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gustavo García</h3>
              <p className="text-teal-600 dark:text-teal-400 text-sm font-medium mt-1">Colaborador</p>
              
              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Roles en el proyecto</p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {['Prototipado (MVP)', 'Testing (QA)'].map((role) => (
                    <span key={role} className="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2.5 py-1 rounded-full font-medium">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-5 leading-relaxed">
                Participación en el prototipado inicial (MVP) del proyecto y apoyo en tareas de 
                testing y aseguramiento de calidad (QA).
              </p>

              {/* Links */}
              <div className="flex justify-center gap-3 mt-6">
                <a 
                  href="mailto:gg.prof.ef@gmail.com"
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors group"
                >
                  <FiMail className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub repo link */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/Nahuelito22/Nimbus-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg"
          >
            <FiGithub className="w-5 h-5" />
            Ver Proyecto en GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export default DeveloperSection;
