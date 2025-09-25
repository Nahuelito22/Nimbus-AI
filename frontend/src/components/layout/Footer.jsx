import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Nimbus AI</h3>
            <p className="text-blue-200">Sistema de Alerta Temprana de Granizo</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300">Términos</a>
            <a href="#" className="hover:text-blue-300">Privacidad</a>
            <a href="#" className="hover:text-blue-300">Contacto</a>
          </div>
        </div>
        <div className="mt-4 text-center text-blue-200 text-sm">
          <p>© 2023 Nimbus AI. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
