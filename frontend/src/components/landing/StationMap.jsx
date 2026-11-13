import React, { useState } from 'react';
import landingData from './data/landingData';

const { mapa, estaciones } = landingData;
const radius = (n) => 6 + Math.sqrt(n) * 3.2;

// Posición de la etiqueta para que no se pisen las estaciones del Gran Mendoza
const LABEL_SIDE = {
  'Mendoza Aero': { dx: -1, anchor: 'end' },
  'Mendoza Observatorio': { dx: -1, anchor: 'end', dy: 26 },
  'San Martín': { dx: 1, anchor: 'start' },
  'San Rafael': { dx: 1, anchor: 'start' },
  'Malargüe': { dx: -1, anchor: 'end' },
};

/** Mapa de Mendoza con las 5 estaciones; el área del círculo es proporcional a los días con granizo. */
function StationMap() {
  const [hover, setHover] = useState(null);

  return (
    <figure className="m-0">
      <figcaption className="text-sm font-medium mb-3" style={{ color: 'var(--ink)' }}>
        Días con granizo documentado por estación, 2000–2024
      </figcaption>
      <svg viewBox={`-60 -10 ${mapa.width + 120} ${mapa.height + 20}`} className="w-full h-auto max-h-[560px]" role="img"
        aria-label="Mapa de Mendoza con las cinco estaciones meteorológicas y su cantidad de días con granizo">
        <path d={mapa.provincia} fill="var(--surface)" />
        {mapa.departamentos.map((d) => (
          <path key={d.nombre} d={d.d} fill="none" stroke="var(--muted)" strokeOpacity="0.35" strokeWidth="1"
            strokeLinejoin="round" />
        ))}
        <path d={mapa.provincia} fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinejoin="round" />
        {estaciones.map((e) => {
          const side = LABEL_SIDE[e.nombre] || { dx: 1, anchor: 'start' };
          const r = radius(e.eventos);
          const active = hover === e.nombre;
          return (
            <g key={e.nombre} onMouseEnter={() => setHover(e.nombre)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(e.nombre)} onBlur={() => setHover(null)} tabIndex={0}
              aria-label={`${e.nombre}: ${e.eventos} días con granizo en ${e.dias.toLocaleString('es-AR')} días registrados`}>
              <circle cx={e.x} cy={e.y} r={r + 8} fill="transparent" />
              <circle cx={e.x} cy={e.y} r={r} fill="var(--data)" fillOpacity={active ? 0.9 : 0.7}
                stroke="var(--surface)" strokeWidth="2" />
              <text x={e.x + side.dx * (r + 6)} y={e.y + 4 + (side.dy || 0)} textAnchor={side.anchor}
                fontSize="19" fill="var(--ink)">
                {e.nombre} <tspan className="mono" fill="var(--muted)">{e.eventos}</tspan>
              </text>
              {active && (
                <text x={e.x + side.dx * (r + 6)} y={e.y + 28 + (side.dy || 0)} textAnchor={side.anchor}
                  fontSize="16" className="mono" fill="var(--muted)">
                  de {e.dias.toLocaleString('es-AR')} días registrados
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
        Mendoza Observatorio tiene registros discontinuos desde 2009 (1.838 días, contra ~9.000 de las demás):
        su cifra no es comparable.
      </p>
    </figure>
  );
}

export default StationMap;
