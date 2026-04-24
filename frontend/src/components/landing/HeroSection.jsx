import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-nimbus" id="hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cloud-like blurred shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-sky-300/10 rounded-full blur-3xl animate-float" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Logo */}
        <div className="animate-fade-in mb-8">
          <img 
            src="/logo_letras.png" 
            alt="Nimbus AI - Logo" 
            className="mx-auto h-40 md:h-52 w-auto drop-shadow-2xl"
          />
        </div>

        {/* Tagline */}
        <h1 className="animate-fade-in-up delay-200 text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 max-w-4xl mx-auto">
          Sistema de Alerta Temprana de Granizo
          <span className="block mt-2 gradient-text">impulsado por Inteligencia Artificial</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-400 text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Protegiendo Mendoza con predicciones multimodales de última generación.
          Datos meteorológicos + Imágenes satelitales GOES-16 = Prevención inteligente.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-600 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-blue-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Acceder a la Plataforma
          </Link>
          <a
            href="https://deepwiki.com/Nahuelito22/Nimbus-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl border border-white/30 hover:bg-white/20 backdrop-blur-sm transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Ver Documentación
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in delay-800 mt-16">
          <a href="#problema" className="inline-block text-white/50 hover:text-white/80 transition-colors">
            <svg className="w-6 h-6 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs mt-1 block">Descubrir más</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
