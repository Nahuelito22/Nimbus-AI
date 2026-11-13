import React from 'react';

// Misma escala que tools/build_landing_assets.py: 310 K (izquierda) a 190 K (derecha)
const GRADIENT = 'linear-gradient(to right, #10171a 0%, #3d4a4f 25%, #c3cbcc 60%, #e9f6f7 75%, #7fe3f0 100%)';
const TICKS = [
  { label: '+30 °C', pos: 5.8 },
  { label: '0 °C', pos: 30.8 },
  { label: '−40 °C', pos: 64.2 },
  { label: '−80 °C', pos: 97.5 },
];

/** Escala de temperatura de brillo de las imágenes infrarrojas. */
function BrightnessLegend({ tone = 'light' }) {
  const muted = tone === 'night' ? 'var(--night-muted)' : 'var(--muted)';
  return (
    <div className="w-full max-w-sm" aria-label="Escala de temperatura de brillo de +30 °C a −80 °C">
      <div className="h-2 rounded-sm" style={{ background: GRADIENT }} />
      <div className="relative h-4 mt-1">
        {TICKS.map((t) => (
          <span key={t.label} className="mono absolute text-[11px] -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${t.pos}%`, color: muted }}>
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default BrightnessLegend;
