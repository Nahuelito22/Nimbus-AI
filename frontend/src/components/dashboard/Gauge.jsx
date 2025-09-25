import React from 'react';

// --- Componente Gauge (velocímetro) ---
const Gauge = ({ probability }) => {
  const percentage = Math.round(probability * 100);
  const offset = 283 - (283 * percentage) / 100;
  let strokeColor = '#3b82f6';
  if (percentage > 50) strokeColor = '#f97316';
  if (percentage > 75) strokeColor = '#ef4444';

  return (
    <div className="relative w-48 h-48 mx-auto mb-4">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          id="gauge-progress"
          cx="50" cy="50" r="45" fill="none"
          stroke={strokeColor} strokeWidth="10"
          strokeDasharray="283" strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
        <circle cx="50" cy="50" r="30" fill="#f9fafb" />
        <text x="50" y="50" textAnchor="middle" dy="7" fontSize="16" fontWeight="bold">
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

export default Gauge;
