import React, { useState } from 'react';
import PropTypes from 'prop-types';

const W = 640;
const PAD = { top: 16, right: 8, bottom: 28, left: 28 };
const GAP = 2;

/** Barras de una sola serie: un tono, hover con tooltip y tabla de datos accesible. */
function BarChart({ data, height = 240, title, unit, labelEvery = 1, tableCaption }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map((d) => d.value));
  const niceMax = Math.ceil(max / 4) * 4 || 4;
  const innerW = W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const step = innerW / data.length;
  const barW = Math.max(step - GAP, 1);
  const y = (v) => PAD.top + innerH - (v / niceMax) * innerH;
  const ticks = [0, niceMax / 2, niceMax];

  const barPath = (x, top, w) => {
    const h = PAD.top + innerH - top;
    if (h <= 0) return '';
    const r = Math.min(4, w / 2, h);
    return `M${x},${PAD.top + innerH}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${PAD.top + innerH}Z`;
  };

  const active = hover !== null ? data[hover] : null;

  return (
    <figure className="m-0">
      <figcaption className="text-sm font-medium mb-3" style={{ color: 'var(--ink)' }}>{title}</figcaption>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${height}`}
          className="w-full h-auto block"
          role="img"
          aria-label={title}
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--rule)" strokeWidth="1" />
              <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" className="mono" fontSize="13" fill="var(--muted)">{t}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = PAD.left + i * step + GAP / 2;
            return (
              <g key={d.label}>
                <path d={barPath(x, y(d.value), barW)} fill="var(--data)" opacity={hover === null || hover === i ? 1 : 0.45} />
                {i % labelEvery === 0 && (
                  <text x={x + barW / 2} y={height - 8} textAnchor="middle" className="mono" fontSize="13" fill="var(--muted)">{d.label}</text>
                )}
                <rect
                  x={PAD.left + i * step}
                  y={PAD.top}
                  width={step}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${d.label}: ${d.value} ${unit}`}
                />
              </g>
            );
          })}
        </svg>
        {active && (
          <div
            className="absolute pointer-events-none px-2.5 py-1.5 text-xs rounded border shadow-sm whitespace-nowrap"
            style={{
              left: `${((PAD.left + hover * step + step / 2) / W) * 100}%`,
              top: `${(y(active.value) / height) * 100}%`,
              transform: 'translate(-50%, calc(-100% - 8px))',
              background: 'var(--surface)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          >
            <span className="mono" style={{ color: 'var(--muted)' }}>{active.label}</span>{' '}
            <strong>{active.value}</strong> {unit}
          </div>
        )}
      </div>
      <details className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
        <summary className="cursor-pointer select-none">Ver datos en tabla</summary>
        <table className="mt-2 mono text-xs">
          <caption className="sr-only">{tableCaption || title}</caption>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}>
                <th scope="row" className="font-normal text-left pr-6 py-0.5">{d.label}</th>
                <td className="text-right" style={{ color: 'var(--ink)' }}>{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })).isRequired,
  height: PropTypes.number,
  title: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  labelEvery: PropTypes.number,
  tableCaption: PropTypes.string,
};

export default BarChart;
