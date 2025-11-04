import React from 'react';
import { Link } from 'react-router-dom';

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
            <Link to="/terminos" className="hover:text-blue-300">Términos</Link>
            <Link to="/privacidad" className="hover:text-blue-300">Privacidad</Link>
            <Link to="/contacto" className="hover:text-blue-300">Contacto</Link>
          </div>
        </div>
        <div className="mt-4 text-center text-blue-200 text-sm">
          <p>© 2025 Nimbus AI. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;