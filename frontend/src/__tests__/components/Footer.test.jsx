// src/__tests__/components/Footer.test.jsx
import { render, screen } from '@testing-library/react';
import Footer from '../../components/layout/Footer';

// Mock de React Router para evitar el problema de hooks
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

test('el Footer muestra el nombre de la aplicación', () => {
  // Renderizamos el componente directamente
  render(<Footer />);
  
  // Buscamos el texto principal
  const brandName = screen.getByText('NIMBUS AI');
  expect(brandName).toBeInTheDocument();
});

test('el Footer muestra el subtítulo de predicción de granizo', () => {
  render(<Footer />);
  
  const subtitle = screen.getByText('HAIL-PREDICTION MENDOZA PROVINCE');
  expect(subtitle).toBeInTheDocument();
});