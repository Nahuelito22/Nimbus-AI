import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './views/DashboardPage';
import LoginPage from './views/LoginPage';

function App() {
  // 1. Estado para guardar el usuario autenticado. `null` si no hay nadie.
  const [user, setUser] = useState(null);

  // 2. Función que se llamará desde LoginPage para "iniciar sesión"
  const handleLogin = (userData) => {
    // En un futuro, aquí verificarías la contraseña con el backend.
    // Por ahora, simplemente guardamos los datos del usuario para simular la sesión.
    setUser(userData);
    console.log("Usuario ha iniciado sesión:", userData);
  };

  // 3. Función para cerrar sesión (la usaremos más adelante en el Navbar)
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {/* Pasamos el usuario y la función de logout al Navbar para que pueda mostrar/ocultar botones */}
      <Navbar user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          {/* Ruta Principal: Si hay un usuario, muestra el Dashboard. Si no, redirige a /login. */}
          <Route
            path="/"
            element={user ? <DashboardPage /> : <Navigate to="/login" />}
          />
          {/* Ruta de Login: Si NO hay un usuario, muestra el Login. Si ya hay uno, redirige a la página principal. */}
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />}
          />
          {/* Aquí podríamos añadir la ruta /admin en el futuro, protegida por el rol del usuario */}
        </Routes>
      </main>
    </div>
  );
}

export default App;