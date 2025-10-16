import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail } from '../api/auth'; // Importar directamente

function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      // Redirigir al dashboard o página principal después del login
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    setShowResend(false);
    setResendMessage('');
    
    try {
      await login({ email, password });
    } catch (err) {
      if (err.code === 'ACCOUNT_NOT_VERIFIED') {
        setFormError(err.message);
        setShowResend(true);
      } else {
        setFormError(err.message || 'Error al iniciar sesión.');
      }
    }
  };

  const handleResendVerification = async () => {
    setResendMessage('Enviando...');
    try {
      const data = await resendVerificationEmail(email);
      // No mostramos el mensaje aquí, ya que redirigimos
      // setResendMessage(data.msg || 'Se ha enviado un nuevo correo.');
      
      // Redirigir a la página de verificación con el email en el estado
      navigate('/verify-email', { state: { email: email } });

    } catch (err) {
      setResendMessage(err.message || 'Error al reenviar el correo.');
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <section className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className={`px-4 py-3 rounded relative mb-4 ${showResend ? 'bg-yellow-100 border border-yellow-400 text-yellow-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
              <span>{formError}</span>
            </div>
          )}

          {showResend && (
            <div className="mb-4">
              <button 
                type="button"
                onClick={handleResendVerification}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
              >
                Reenviar Correo de Verificación
              </button>
              {resendMessage && <p className="text-sm text-center mt-2 text-gray-600">{resendMessage}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link></p>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;