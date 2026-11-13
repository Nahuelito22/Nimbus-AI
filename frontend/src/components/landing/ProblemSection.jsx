import React from 'react';
import Section from './Section';
import landingData from './data/landingData';

const { resumen } = landingData;

const FIGURES = [
  { value: resumen.fechasGranizo, label: 'días con granizo documentado' },
  { value: `${resumen.hasta - resumen.desde + 1} años`, label: `de registros, ${resumen.desde}–${resumen.hasta}` },
  { value: resumen.filas.toLocaleString('es-AR'), label: `días-estación en ${resumen.estaciones} estaciones` },
  { value: `${resumen.pctTemporada} %`, label: 'de los eventos, entre noviembre y febrero' },
];

function ProblemSection() {
  return (
    <Section id="problema" number="01" kicker="El problema" title="Una tormenta de minutos puede llevarse la cosecha de un año.">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-6 md:col-start-4 space-y-5" style={{ color: 'var(--ink-2)' }}>
          <p>
            En los oasis de Mendoza el granizo cae justo en la temporada en que la vid, los frutales y la
            horticultura son más vulnerables. Para decidir cuándo cubrir, cosechar antes o activar un seguro,
            un productor necesita saber qué puede pasar sobre su zona, no solo sobre la provincia.
          </p>
          <p>
            Nimbus empezó como una pregunta: ¿se puede estimar ese riesgo combinando el registro histórico de
            granizo con lo que ven los satélites? Para responderla primero hubo que construir el registro.
          </p>
        </div>
      </div>
      <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 border-t rule">
        {FIGURES.map((f) => (
          <div key={f.label} className="pt-5 pr-4 pb-2">
            <dt className="sr-only">{f.label}</dt>
            <dd className="serif text-4xl md:text-5xl font-light">{f.value}</dd>
            <dd className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{f.label}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export default ProblemSection;
