import React, { useState } from 'react';

function LoginPage() {
  // Estado para cada campo del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  // Manejador para cuando se envía el formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Previene que la página se recargue
    console.log('Intento de login con:', { email, password, role });
    // Aquí es donde en el futuro llamarías a tu API de backend para autenticar
    alert(`Login con: ${email}, Rol: ${role}`);
  };

  return (
    // Centramos el formulario en la página para que se vea mejor
    <div className="flex justify-center items-center pt-10">
      <section className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email} // El valor del input está ligado al estado
              onChange={(e) => setEmail(e.target.value)} // El estado se actualiza cuando el usuario escribe
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
            <label className="block text-gray-700 mb-2" htmlFor="role">Rol</label>
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
          <p>¿No tienes cuenta? <a href="#" className="text-blue-600 hover:underline">Regístrate</a></p>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;