import React from 'react';
import Section from './Section';

const STEPS = [
  {
    tag: 'Entrada 1',
    title: 'Superficie',
    body: '21 variables diarias: temperatura, precipitación, punto de rocío, presión, ráfagas, radiación. NOAA para el histórico y Open-Meteo para el pronóstico.',
  },
  {
    tag: 'Entrada 2',
    title: 'Satélite',
    body: 'Imágenes infrarrojas GOES (banda 13) recortadas sobre Mendoza: GOES-16 para entrenar y GOES-19 en tiempo real.',
  },
  {
    tag: 'Modelo',
    title: 'Red multimodal',
    body: 'Una rama densa para las variables y una convolucional para las imágenes, unidas en una sola salida.',
  },
  {
    tag: 'Salida',
    title: 'Probabilidad',
    body: 'Un número entre 0 y 1, no un sí o un no. Cada usuario decide a partir de qué riesgo actúa.',
  },
];

const ROLES = ['Usuario general', 'Meteorólogo', 'Defensa Civil', 'Ciencia de datos'];

function HowItWorksSection() {
  return (
    <Section id="como-funciona" number="04" kicker="Cómo funciona" title="Dos miradas sobre el mismo día, combinadas en una probabilidad.">
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 border-t rule">
        {STEPS.map((s, i) => (
          <li key={s.title} className={`pt-5 pb-6 pr-6 ${i > 0 ? 'lg:border-l lg:pl-6 rule' : ''}`}>
            <p className="kicker">{s.tag}</p>
            <h3 className="serif text-2xl mt-2">{s.title}</h3>
            <p className="text-sm mt-3" style={{ color: 'var(--ink-2)' }}>{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12 grid md:grid-cols-12 gap-6 items-baseline">
        <p className="kicker md:col-span-3">La plataforma</p>
        <div className="md:col-span-9">
          <p style={{ color: 'var(--ink-2)' }}>
            Una aplicación web con paneles según quién la usa: pronóstico, imágenes satelitales en vivo,
            reportes en PDF y acceso al dataset.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <li key={r} className="mono text-xs px-2.5 py-1 border rule rounded-sm">{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export default HowItWorksSection;
