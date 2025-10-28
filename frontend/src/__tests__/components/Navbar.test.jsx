// src/__tests__/components/Navbar.test.jsx
import { render, screen } from '@testing-library/react';
import Navbar from '../../components/layout/Navbar';

// Mock completo de React Router y AuthContext
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

const mockUseAuth = jest.fn();

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    mockUseAuth.mockClear();
  });

  test('muestra opciones para usuario NO logueado', () => {
    mockUseAuth.mockReturnValue({ user: null, logout: jest.fn() });

    render(<Navbar />);

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Regístrate')).toBeInTheDocument();
    expect(screen.queryByText(/Hola,/)).not.toBeInTheDocument();
  });

  test('muestra opciones para usuario NORMAL logueado', () => {
    mockUseAuth.mockReturnValue({ 
      user: { 
        name: 'Juan', 
        email: 'juan@ejemplo.com',
        role: 'user' 
      },
      logout: jest.fn()
    });

    render(<Navbar />);

    expect(screen.getByText('¡Hola, Juan!')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
    // Usuario normal NO ve Panel Admin ni opciones de superadmin
    expect(screen.queryByText('Panel Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Ver como Usuario')).not.toBeInTheDocument();
  });

  test('muestra Panel Admin para usuario ADMIN logueado', () => {
    mockUseAuth.mockReturnValue({ 
      user: { 
        name: 'Admin User', 
        email: 'admin@ejemplo.com',
        role: 'admin' 
      },
      logout: jest.fn()
    });

    render(<Navbar />);

    expect(screen.getByText('¡Hola, Admin User!')).toBeInTheDocument();
    expect(screen.getByText('Panel Admin')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
    // Admin NO ve opciones de superadmin
    expect(screen.queryByText('Ver como Usuario')).not.toBeInTheDocument();
  });

  test('muestra todas las opciones para SUPERADMIN logueado', () => {
    mockUseAuth.mockReturnValue({ 
      user: { 
        name: 'Super Admin', 
        email: 'super@ejemplo.com',
        role: 'superadmin' 
      },
      logout: jest.fn()
    });

    render(<Navbar />);

    expect(screen.getByText('¡Hola, Super Admin!')).toBeInTheDocument();
    expect(screen.getByText('Panel Admin')).toBeInTheDocument();
    expect(screen.getByText('Ver como Usuario')).toBeInTheDocument();
    expect(screen.getByText('Ver como Meteorólogo')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });
});