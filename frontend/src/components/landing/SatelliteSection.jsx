import React from 'react';
import Section from './Section';
import BrightnessLegend from './BrightnessLegend';
import landingData from './data/landingData';

const { granizo, sinGranizo } = landingData.goes;
const celsius = (v) => `${String(v).replace('.', ',').replace('-', '−')} °C`;

const PANELS = [
  {
    ...granizo,
    titulo: 'Día con granizo',
    texto: 'Torres de tormenta compactas: topes por debajo de −40 °C, señal de convección profunda.',
    alt: 'Imagen infrarroja del 25 de marzo de 2017 con celdas de tormenta compactas y muy frías',
  },
  {
    ...sinGranizo,
    titulo: 'Día sin granizo',
    texto: 'Nubosidad extensa y estratificada: puede ser fría, pero no se organiza en torres.',
    alt: 'Imagen infrarroja del 9 de septiembre de 2017 con nubosidad en bandas, sin celdas convectivas',
  },
];

function SatelliteSection() {
  return (
    <Section id="satelite" number="02" kicker="Lo que ve el satélite" title="El granizo se forma en la parte más fría de la nube.">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-6 md:col-start-4 space-y-5" style={{ color: 'var(--ink-2)' }}>
          <p>
            La banda 13 de GOES mide la temperatura de brillo: cuanto más fría, más alta está la cima de la nube.
            Las tormentas capaces de producir granizo suben tanto que sus topes superan los −40 °C.
          </p>
        </div>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 gap-8">
        {PANELS.map((p) => (
          <figure key={p.titulo} className="m-0">
            <img src={p.archivo} width="800" height="810" alt={p.alt} loading="lazy" className="w-full h-auto rounded-sm block" />
            <figcaption className="mt-3">
              <p className="font-medium">
                {p.titulo} <span className="mono text-xs ml-1" style={{ color: 'var(--muted)' }}>{p.fecha} · {p.hora}</span>
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--ink-2)' }}>{p.texto}</p>
              <p className="mono text-xs mt-1" style={{ color: 'var(--muted)' }}>Tope más frío: {celsius(p.btMin)}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <BrightnessLegend />
        <p className="text-xs max-w-md" style={{ color: 'var(--muted)' }}>
          Ambas imágenes usan la misma escala absoluta. El modelo V3 normalizaba cada imagen por separado,
          lo que borraba esta diferencia: es uno de los errores que estamos corrigiendo.
        </p>
      </div>
    </Section>
  );
}

export default SatelliteSection;
