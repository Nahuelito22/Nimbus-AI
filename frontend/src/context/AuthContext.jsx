import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as apiLogin } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        
        // Verificar si el token ha expirado
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token expirado, limpiar almacenamiento
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Token válido, establecer usuario
          setToken(storedToken);
          setUser({
            email: decodedToken.sub,
            role: decodedToken.role
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Error al decodificar el token, limpiar almacenamiento
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiLogin(credentials);
      const { access_token } = data;
      
      // Guardar token en localStorage
      localStorage.setItem('authToken', access_token);
      setToken(access_token);
      
      // Decodificar token para obtener información del usuario
      const decodedToken = jwtDecode(access_token);
      const userData = {
        email: decodedToken.sub,
        role: decodedToken.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
      throw err; // Lanzar el error para que el formulario de login lo pueda atrapar
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // El valor que se comparte a los componentes hijos
  const value = {
    user,
    token,
    isAuthenticated,
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