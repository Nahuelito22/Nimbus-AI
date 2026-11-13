import React from 'react';
import Section from './Section';
import BarChart from './BarChart';
import StationMap from './StationMap';
import landingData from './data/landingData';

const { porMes, porAnio, resumen } = landingData;

// Julio a junio, para que la temporada (nov–feb) quede continua en el centro
const temporada = [...porMes.slice(6), ...porMes.slice(0, 6)].map((d) => ({ label: d.mes, value: d.eventos }));
const anios = porAnio.map((d) => ({ label: String(d.anio), value: d.eventos }));
const antes = porAnio.filter((d) => d.anio <= 2016).reduce((s, d) => s + d.eventos, 0);
const despues = porAnio.filter((d) => d.anio >= 2017).reduce((s, d) => s + d.eventos, 0);

function DataSection() {
  return (
    <Section id="datos" number="03" kicker="Los datos" title="Un registro de granizo construido a mano, fecha por fecha.">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-6 md:col-start-4 space-y-5" style={{ color: 'var(--ink-2)' }}>
          <p>
            No existía un registro público de granizo por estación para Mendoza. Lo armamos cruzando
            observaciones de NOAA (5 estaciones), variables de Open-Meteo, el portal TuTiempo y una verificación
            manual de noticias y registros históricos entre {resumen.desde} y {resumen.hasta}.
          </p>
        </div>
      </div>

      <div className="mt-14 grid md:grid-cols-12 gap-12 md:gap-10">
        <div className="md:col-span-7 space-y-14">
          <div>
            <BarChart data={temporada} title="Días con granizo documentado por mes" unit="días" />
            <p className="text-sm mt-2" style={{ color: 'var(--ink-2)' }}>
              El {resumen.pctTemporada} % de los eventos cae entre noviembre y febrero.
            </p>
          </div>
          <div>
            <BarChart data={anios} title="Días con granizo documentado por año" unit="días" labelEvery={4} height={220} />
            <p className="text-sm mt-2" style={{ color: 'var(--ink-2)' }}>
              <strong className="font-medium" style={{ color: 'var(--ink)' }}>Ojo con esta curva.</strong>{' '}
              Hay {antes} eventos entre 2000 y 2016 y {despues} entre 2017 y 2024. No significa que caiga más granizo:
              hoy se publican más noticias. Las etiquetas registran lo que se informó, no todo lo que pasó.
            </p>
          </div>
        </div>
        <div className="md:col-span-5">
          <StationMap />
        </div>
      </div>
    </Section>
  );
}

export default DataSection;
