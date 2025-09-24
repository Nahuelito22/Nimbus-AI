import React from 'react';

function Navbar() {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                {/* Asumimos que el logo estará en la carpeta `public/images` */}
                <img src="/images/logo.png" alt="Logo" className="h-10 w-10" />
                <h1 className="text-xl font-bold">Nimbus AI</h1>
            </div>
            <nav id="nav-menu" className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-blue-300">Inicio</a>
                <a href="#" className="hover:text-blue-300">Noticias</a>
                <a href="#" className="hover:text-blue-300">Radar</a>
                <a href="#" className="hover:text-blue-300">Perfil</a>
                <button id="logout-btn" className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Salir</button>
            </nav>
            <button id="mobile-menu-btn" className="md:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    </header>
  );
}

export default Navbar;
