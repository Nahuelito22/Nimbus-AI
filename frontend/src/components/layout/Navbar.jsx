import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [superadminMenuOpen, setSuperadminMenuOpen] = useState(false);

  const superadminMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (superadminMenuRef.current && !superadminMenuRef.current.contains(event.target)) {
        setSuperadminMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [superadminMenuRef]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const renderLinks = (isMobile = false) => {
    const linkClass = isMobile ? 'block px-3 py-2 rounded-md text-base font-medium text-gray-800' : 'hover:text-blue-300';
    const activeLinkClass = isMobile ? 'bg-gray-200' : 'text-blue-300 font-semibold';

    return (
      <>
        {user ? (
          <>
            <span className={`text-sm ${isMobile ? 'text-gray-800 px-3 py-2' : 'text-white'}`}>Hola, {user.name || user.email}</span>
            
            {/* El superadmin no necesita un enlace a Dashboard, usa el menú Supervisar */}
            {user.role !== 'superadmin' && (
              <NavLink to={user.role === 'admin' ? '/dashboard' : '/'} onClick={isMobile ? closeMobileMenu : undefined} className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
                Dashboard
              </NavLink>
            )}
            
            {['admin', 'superadmin'].includes(user.role) && (
              <NavLink to="/admin" onClick={isMobile ? closeMobileMenu : undefined} className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
                Panel Admin
              </NavLink>
            )}

            {['cientifico_datos', 'meteorologo'].includes(user.role) && (
              <NavLink to={user.role === 'cientifico_datos' ? '/data-scientist-dashboard' : '/meteorologist-dashboard'} onClick={isMobile ? closeMobileMenu : undefined} className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
                Mi Dashboard
              </NavLink>
            )}

            {user.role === 'superadmin' && (
              <div className="relative" ref={superadminMenuRef}>
                <button onClick={() => setSuperadminMenuOpen(!superadminMenuOpen)} className={`${linkClass} ${isMobile ? 'w-full text-left' : 'text-yellow-300'}`}>
                  Supervisar
                </button>
                {superadminMenuOpen && (
                  <div className={`${isMobile ? 'pl-4' : 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20'}`}>
                    <Link to="/dashboard" onClick={isMobile ? closeMobileMenu : undefined} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ver como Usuario</Link>
                    <Link to="/meteorologist-dashboard" onClick={isMobile ? closeMobileMenu : undefined} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ver como Meteorólogo</Link>
                    <Link to="/civil-defense-dashboard" onClick={isMobile ? closeMobileMenu : undefined} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ver como Defensa Civil</Link>
                    <Link to="/data-scientist-dashboard" onClick={isMobile ? closeMobileMenu : undefined} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ver como Científico</Link>
                  </div>
                )}
              </div>
            )}
            
            <button onClick={() => { logout(); closeMobileMenu(); }} className={`px-3 py-1 rounded ${isMobile ? 'w-full text-left text-white bg-red-500' : 'bg-red-600 hover:bg-red-700'}`}>Salir</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={isMobile ? closeMobileMenu : undefined} className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Iniciar Sesión</NavLink>
            <NavLink to="/register" onClick={isMobile ? closeMobileMenu : undefined} className={`px-3 py-1 rounded ${isMobile ? 'block text-white bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'}`}>Regístrate</NavLink>
          </>
        )}
      </>
    );
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Logo" className="h-10 w-10" />
          <h1 className="text-xl font-bold">Nimbus AI</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          {renderLinks()}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderLinks(true)}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
