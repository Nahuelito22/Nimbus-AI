import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importar Link

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Limpiar errores previos

    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }

      // Si el login es exitoso, el backend nos da un token.
      // En un futuro, decodificaremos el token para obtener el rol.
      // Por ahora, confiamos en el rol seleccionado en el formulario para la redirección.
      console.log("Token recibido del backend:", data.access_token);
      
      // Llamamos a onLogin con los datos para que App.jsx actualice el estado.
      onLogin({ email, role, token: data.access_token });

    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <section className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {/* Bloque para mostrar errores */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
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
          <div className="mb-4">
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="role">Rol (para simulación)</label>
            <select
              id="role"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Usuario Común</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
            Iniciar Sesión
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