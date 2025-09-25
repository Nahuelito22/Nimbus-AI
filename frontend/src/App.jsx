import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './views/DashboardPage';
import LoginPage from './views/LoginPage';
import Footer from './components/Footer'; // Importamos el Footer

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    console.log("Usuario ha iniciado sesión:", userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    // Usamos Flexbox para asegurar que el footer se pegue abajo
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      {/* La clase flex-grow hace que el contenido principal ocupe todo el espacio disponible */}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={user ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
      <Footer /> {/* Añadimos el Footer al final */}
    </div>
  );
}

export default App;
