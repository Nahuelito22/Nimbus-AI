import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const { pathname } = useLocation();

  return (
    <footer className={`bg-[#10171a] text-white/70 py-8 ${pathname === '/' ? '' : 'mt-12'}`}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <img src="/logo_no_letras.png" alt="" className="h-7 w-auto" />
          <span className="text-white font-semibold">Nimbus</span>
          <span className="hidden sm:inline">· © 2023–2026 Nahuel Ghilardi · Licencia MIT</span>
        </div>
        <nav className="flex gap-5" aria-label="Enlaces legales">
          <Link to="/terminos" className="hover:text-white">Términos</Link>
          <Link to="/privacidad" className="hover:text-white">Privacidad</Link>
          <Link to="/contacto" className="hover:text-white">Contacto</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
