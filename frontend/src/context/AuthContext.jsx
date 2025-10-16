import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as apiLogin, resendVerificationEmail } from '../api/auth'; // Importar la nueva función
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
        
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setToken(storedToken);
          // Incluir id, nombre y rol del token
          setUser({
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.sub,
            role: decodedToken.role
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
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
      
      localStorage.setItem('authToken', access_token);
      setToken(access_token);
      
      const decodedToken = jwtDecode(access_token);
      // Incluir id, nombre y rol del token
      const userData = {
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.sub,
        role: decodedToken.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
    } catch (err) {
      // Comprobar si el error es por cuenta no verificada
      if (err.response && err.response.error === 'ACCOUNT_NOT_VERIFIED') {
        // Lanzar un error específico para que la UI lo maneje
        const specificError = new Error('Tu cuenta no ha sido verificada.');
        specificError.code = 'ACCOUNT_NOT_VERIFIED';
        setError(specificError.message); // También actualizamos el estado de error
        throw specificError;
      }
      setError(err.message);
      setIsAuthenticated(false);
      throw err;
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
    resendVerificationEmail // Exponer la nueva función
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