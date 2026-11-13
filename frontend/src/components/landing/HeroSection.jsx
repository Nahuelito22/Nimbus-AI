import React from 'react';
import { Link } from 'react-router-dom';
import landingData from './data/landingData';
import BrightnessLegend from './BrightnessLegend';

const { granizo } = landingData.goes;

function HeroSection() {
  return (
    <section id="inicio" style={{ background: 'var(--night)', color: 'var(--night-ink)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-12 gap-10 md:gap-12 items-center">
        <div className="md:col-span-6">
          <p className="kicker" style={{ color: 'var(--night-muted)' }}>
            Proyecto de investigación abierto · Mendoza, Argentina
          </p>
          <h1 className="serif font-light text-5xl sm:text-6xl lg:text-7xl leading-[1.02] mt-5">
            Granizo en Mendoza,<br />visto desde arriba.
          </h1>
          <p className="mt-6 text-lg max-w-xl" style={{ color: 'var(--night-muted)' }}>
            Nimbus cruza datos meteorológicos de superficie con imágenes infrarrojas del satélite GOES
            para estimar la probabilidad de granizo. Es un prototipo: acá mostramos qué hace, con qué
            datos, y qué tan bien funciona de verdad.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/login"
              className="px-5 py-3 rounded font-medium transition-colors"
              style={{ background: 'var(--night-ink)', color: 'var(--night)' }}>
              Entrar a la plataforma
            </Link>
            <a href="#honestidad"
              className="px-5 py-3 rounded font-medium border transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--night-rule)', color: 'var(--night-ink)' }}>
              Qué tan bien funciona
            </a>
          </div>
        </div>

        <figure className="md:col-span-6 m-0">
          <img src={granizo.archivo} width="800" height="810"
            alt="Imagen infrarroja de GOES-16 sobre Mendoza: grandes topes de tormenta muy fríos en el sur y el este de la provincia"
            className="w-full h-auto rounded-sm block" />
          <figcaption className="mt-4 text-sm" style={{ color: 'var(--night-muted)' }}>
            <span className="mono text-xs" style={{ color: 'var(--night-ink)' }}>
              GOES-16 · infrarrojo 10,3 µm · {granizo.fecha} {granizo.hora}
            </span>
            <br />
            Ese día hubo granizo en San Rafael. Los topes de nube más fríos llegaron a{' '}
            {String(granizo.btMin).replace('.', ',').replace('-', '−')} °C.
            <div className="mt-3"><BrightnessLegend tone="night" /></div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default HeroSection;
