import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './views/DashboardPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage'; // Importar la nueva página
import AdminPage from './views/AdminPage';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    console.log("Usuario ha iniciado sesión:", userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Este es un pequeño componente que decide a dónde redirigir al usuario DESPUÉS de iniciar sesión.
  const PostLoginRedirect = () => {
    if (!user) return null; // Seguridad, no debería ocurrir.
    // Si el rol es admin, va a /admin. Si no, va a la página principal.
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={user ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/" />}
          />
          {/* AHORA, después de hacer login, en lugar de redirigir siempre a "/", usamos nuestro componente inteligente */}
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <PostLoginRedirect />}
          />
          <Route
            path="/admin"
            element={user && user.role === 'admin' ? <AdminPage /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
