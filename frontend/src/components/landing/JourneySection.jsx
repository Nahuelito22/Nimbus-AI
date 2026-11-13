import React from 'react';
import Section from './Section';

const HITOS = [
  { anio: '2023', titulo: 'La idea', texto: '¿Se puede anticipar el granizo en Mendoza con datos abiertos?' },
  { anio: '2024', titulo: 'Primer modelo', texto: 'Dataset base de NOAA y primeros modelos de ciencia de datos sobre caídas de granizo.' },
  { anio: '2025', titulo: 'Plataforma completa', texto: 'Registro etiquetado 2000–2024, imágenes GOES, modelo multimodal V3 y aplicación web. Proyecto final de Prácticas 2 en la carrera de Desarrollo de Software.' },
  { anio: '2026', titulo: 'Revisión rigurosa', texto: 'Auditoría del modelo, métricas honestas y el camino hacia V4.' },
];

function JourneySection() {
  return (
    <Section id="recorrido" number="06" kicker="Recorrido" title="Cuatro años de una misma pregunta.">
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
        {HITOS.map((h) => (
          <li key={h.anio} className="border-t rule pt-4 pb-8">
            <p className="mono text-sm" style={{ color: 'var(--accent)' }}>{h.anio}</p>
            <h3 className="serif text-2xl mt-1">{h.titulo}</h3>
            <p className="text-sm mt-2" style={{ color: 'var(--ink-2)' }}>{h.texto}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
        Cada etapa está documentada en los notebooks del repositorio, del 01 (exploración de NOAA) al 11 (evaluación final).
      </p>
    </Section>
  );
}

export default JourneySection;
