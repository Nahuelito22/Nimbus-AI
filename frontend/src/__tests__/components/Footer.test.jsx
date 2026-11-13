// src/__tests__/components/Footer.test.jsx
import { render, screen } from '@testing-library/react';
import Footer from '../../components/layout/Footer';

// Mock de React Router para evitar el problema de hooks
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
}));

test('el Footer muestra el nombre de la aplicación', () => {
  render(<Footer />);

  expect(screen.getByText('Nimbus')).toBeInTheDocument();
});

test('el Footer declara autoría y licencia MIT', () => {
  render(<Footer />);

  expect(screen.getByText(/Nahuel Ghilardi · Licencia MIT/)).toBeInTheDocument();
});
