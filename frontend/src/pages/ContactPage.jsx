import React from 'react';

function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Contacto</h1>
      <div className="space-y-6 text-gray-700">
        <p>Nimbus AI es un proyecto de desarrollo de software y ciencia de datos. Si tiene preguntas técnicas, sugerencias para el modelo, o desea reportar un error en la plataforma, no dude en contactar al equipo de desarrollo.</p>
        
        <div className="mt-6 bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800">Equipo de Desarrollo</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <span className="font-semibold block">Nahuel Ghilardi</span>
              <span className="text-sm text-gray-600">Líder de Ciencia de Datos (ML/IA), Desarrollo Back-end y Front-end</span>
              <br />
              <a href="mailto:matiasghilardisalinas@gmail.com" className="text-blue-600 hover:underline">matiasghilardisalinas@gmail.com</a>
            </li>
            <li>
              <span className="font-semibold block">Gustavo Garcia</span>
              <span className="text-sm text-gray-600">Desarrollo Back-end, Prototipado y Testing (QA)</span>
              <br />
              <a href="mailto:[EMAIL_DE_GUSTAVO]" className="text-blue-600 hover:underline">[Email Profesional de Gustavo]</a>
            </li>
          </ul>
        </div>
        
        <div className="mt-6 bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800">Repositorio del Proyecto</h3>
          <p className="mt-2">
            Para ver el código fuente completo, seguir nuestro progreso, o contribuir al proyecto, puede visitar nuestro repositorio oficial en GitHub.
          </p>
          <a 
            href="https://github.com/Nahuelito22/Nimbus-AI" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline font-medium"
          >
            Ver Proyecto en GitHub
          </a>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;