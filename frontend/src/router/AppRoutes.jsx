import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminPage from '../pages/AdminPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import MeteorologistDashboard from '../pages/MeteorologistDashboard'; // 1. Importar el nuevo dashboard

function AppRoutes() {
  const { user } = useAuth();

  // 2. Componente mejorado para redirigir después del login o desde la raíz
  const RoleBasedRedirect = () => {
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
      case 'admin':
      case 'superadmin':
        return <Navigate to="/admin" />;
      case 'meteorologo':
        return <Navigate to="/meteorologist-dashboard" />;
      default:
        return <Navigate to="/dashboard" />; // Dashboard genérico para 'user' y otros roles
    }
  };

  return (
    <Routes>
      {/* 3. La ruta raíz ahora usa el redireccionador basado en rol */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Rutas de autenticación */}
      <Route 
        path="/register" 
        element={!user ? <RegisterPage /> : <RoleBasedRedirect />}
      />
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <RoleBasedRedirect />}
      />
      <Route 
        path="/verify-email" 
        element={<VerifyEmailPage />} // Permitir acceso siempre para verificación
      />

      {/* 4. Rutas protegidas por rol */}
      <Route
        path="/admin"
        element={user && ['admin', 'superadmin'].includes(user.role) ? <AdminPage /> : <Navigate to="/" />}
      />
      <Route
        path="/meteorologist-dashboard"
        element={user && user.role === 'meteorologo' ? <MeteorologistDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/dashboard"
        element={user ? <DashboardPage /> : <Navigate to="/login" />}
      />
      
      {/* Ruta comodín para redirigir a la página principal si no se encuentra la ruta */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
