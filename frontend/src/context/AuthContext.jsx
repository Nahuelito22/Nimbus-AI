import React, { createContext, useState, useContext } from 'react';
import { loginUser as apiLogin } from '../api/auth';
import { jwtDecode } from 'jwt-decode'; // Necesitaremos una librería para decodificar el token

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(credentials);
      const decodedToken = jwtDecode(data.access_token);
      
      const userData = {
        email: decodedToken.sub,
        role: decodedToken.role,
        token: data.access_token,
      };

      setUser(userData);
      // Opcional: guardar el token en localStorage para persistir la sesión
      localStorage.setItem('authToken', data.access_token);

    } catch (err) {
      setError(err.message);
      throw err; // Lanzar el error para que el formulario de login lo pueda atrapar
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  // El valor que se comparte a los componentes hijos
  const value = {
    user,
    error,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
