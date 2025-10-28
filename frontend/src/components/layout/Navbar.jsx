import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo_no_letras.png" alt="Logo Nimbus AI" className="h-10 w-15" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">NIMBUS AI</h1>
            <p className="text-xs text-gray-300">HAIL-PREDICTION MENDOZA</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <span className="text ">¡Hola, {user.name || user.email}!</span>

              {/* Enlace al Panel de Admin para Admin y Superadmin */}
              {['admin', 'superadmin'].includes(user.role) && (
                <Link to="/admin" className="hover:text-blue-300 italic">Panel Admin</Link>
              )}

              {/* Menú de Supervisión para Superadmin */}
              {user.role === 'superadmin' && (
                <>
                  <span className="border-l border-blue-700 h-6"></span>
                  <Link to="/dashboard" className="text-yellow-300 hover:text-yellow-200">Ver como Usuario</Link>
                  <Link to="/meteorologist-dashboard" className="text-yellow-300 hover:text-yellow-200">Ver como Meteorólogo</Link>
                </>
              )}

              <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300">Iniciar Sesión</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Regístrate</Link>
            </>
          )}
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