import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Importar el hook
import Navbar from './components/Navbar';
import DashboardPage from './views/DashboardPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import AdminPage from './views/AdminPage';
import Footer from './components/Footer';

function App() {
  const { user } = useAuth(); // ¡Toda la lógica del usuario viene de aquí ahora!

  const PostLoginRedirect = () => {
    if (!user) return <Navigate to="/login" />;
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* No más props! */}
      <main className="flex-grow">
        <Routes>
          <Route 
            path="/" 
            element={user ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route 
            path="/register" 
            element={!user ? <RegisterPage /> : <PostLoginRedirect />}
          />
          <Route 
            path="/login" 
            element={!user ? <LoginPage /> : <PostLoginRedirect />}
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
