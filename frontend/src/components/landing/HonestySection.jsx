import React from 'react';
import Section from './Section';

const ROWS = [
  { version: 'V3.0', umbral: '0,50', recall: '0,70', precision: '0,21', nota: 'Detectó 7 de 10 granizos; 1 de cada 5 alertas fue correcta. Doble que el azar.' },
  { version: 'V3.1', umbral: '0,50', recall: '1,00', precision: '0,14', nota: 'Detectó todos, pero alertaba en 3 de cada 4 días sin granizo.' },
  { version: 'V3.1', umbral: '0,56', recall: '0,00', precision: '—', nota: 'Con el umbral desplegado no detecta ningún evento de prueba.' },
];

const SABEMOS = [
  'La temporada y las zonas con más registros de granizo en Mendoza.',
  'Que las imágenes infrarrojas muestran la convección profunda, que es donde se forma el granizo.',
  'Que V3.0 tenía algo de señal por encima del azar.',
];

const NO_SABEMOS = [
  'Cuánto vale de verdad el modelo: el conjunto de prueba se usó para ajustarlo, y solo tiene 10 días con granizo.',
  'Cuántos granizos faltan en el registro: un día sin noticia no es un día sin granizo.',
  'Si funciona igual en producción: varias variables no llegan igual que en el entrenamiento.',
];

function HonestySection() {
  return (
    <Section id="honestidad" number="05" kicker="Qué sabemos y qué no" title="Las métricas, sin maquillaje.">
      <div className="grid md:grid-cols-12 gap-10">
        <p className="md:col-span-6 md:col-start-4" style={{ color: 'var(--ink-2)' }}>
          En el conjunto de prueba hay 94 días-estación y 10 con granizo: el 10,6 %. Un modelo que alertara al
          azar acertaría 1 de cada 10 alertas. Este es el resultado real de cada versión.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[560px]">
          <thead>
            <tr className="border-b rule kicker">
              <th scope="col" className="py-3 pr-4 font-normal">Versión</th>
              <th scope="col" className="py-3 pr-4 font-normal">Umbral</th>
              <th scope="col" className="py-3 pr-4 font-normal">Recall</th>
              <th scope="col" className="py-3 pr-4 font-normal">Precisión</th>
              <th scope="col" className="py-3 font-normal">Qué significa</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.version + r.umbral} className="border-b rule align-top">
                <th scope="row" className="py-4 pr-4 font-medium">{r.version}</th>
                <td className="py-4 pr-4 mono">{r.umbral}</td>
                <td className="py-4 pr-4 mono">{r.recall}</td>
                <td className="py-4 pr-4 mono">{r.precision}</td>
                <td className="py-4" style={{ color: 'var(--ink-2)' }}>{r.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-14 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="kicker mb-4">Lo que sabemos</h3>
          <ul className="space-y-3">
            {SABEMOS.map((t) => (
              <li key={t} className="border-t rule pt-3">{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="kicker mb-4">Lo que todavía no</h3>
          <ul className="space-y-3">
            {NO_SABEMOS.map((t) => (
              <li key={t} className="border-t rule pt-3">{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 p-6 md:p-8 rounded-sm border rule" style={{ background: 'var(--surface)' }}>
        <p className="kicker" style={{ color: 'var(--accent)' }}>Próxima versión</p>
        <p className="serif text-2xl mt-2">V4: rehacer la evaluación antes de buscar mejores números.</p>
        <p className="mt-3 text-sm max-w-3xl" style={{ color: 'var(--ink-2)' }}>
          Validación por temporada con un conjunto de prueba que nadie toca, comparación contra modelos simples,
          temperatura de brillo absoluta y variables convectivas (inestabilidad, cizalladura, altura de la isoterma
          de 0 °C, rayos). También estamos explorando fuentes satelitales de NASA para auditar y ampliar el registro de granizo.
        </p>
      </div>
    </Section>
  );
}

export default HonestySection;
