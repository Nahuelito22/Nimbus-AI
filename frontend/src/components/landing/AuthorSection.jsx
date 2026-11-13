import React from 'react';
import { FiGithub, FiMail } from 'react-icons/fi';
import Section from './Section';

const STACK = 'Python · TensorFlow/Keras · scikit-learn · xarray · Flask · FastAPI · PostgreSQL · React · Tailwind';

function AuthorSection() {
  return (
    <Section id="autor" number="07" kicker="Autor" title="Nahuel Ghilardi">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-6 md:col-start-4">
          <p style={{ color: 'var(--ink-2)' }}>
            Desarrollador de software y data scientist en Mendoza. Idea original, investigación, construcción del
            dataset, modelo de IA, backend y frontend.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <a href="https://github.com/Nahuelito22/Nimbus-AI" target="_blank" rel="noopener noreferrer"
              className="link inline-flex items-center gap-2">
              <FiGithub aria-hidden="true" /> Código en GitHub
            </a>
            <a href="mailto:matiasghilardisalinas@gmail.com" className="link inline-flex items-center gap-2">
              <FiMail aria-hidden="true" /> Escribime
            </a>
          </div>
          <p className="mt-10 mono text-xs" style={{ color: 'var(--muted)' }}>{STACK}</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>Código abierto bajo licencia MIT.</p>
        </div>
      </div>
    </Section>
  );
}

export default AuthorSection;
