import React from 'react';
import PropTypes from 'prop-types';
import useReveal from './useReveal';

/** Sección editorial: número, etiqueta, título y contenido sobre una línea divisoria. */
function Section({ id, number, kicker, title, children, className = '' }) {
  const revealRef = useReveal(0.1);

  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={revealRef}>
        <header className="border-t rule pt-5 mb-10 md:mb-14 grid md:grid-cols-12 gap-4">
          <p className="kicker md:col-span-3">
            <span style={{ color: 'var(--accent)' }}>{number}</span> — {kicker}
          </p>
          <h2 className="serif md:col-span-9 text-3xl md:text-5xl leading-[1.1] font-normal max-w-3xl">
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  kicker: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Section;
