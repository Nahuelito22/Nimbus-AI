import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminPage from '../pages/AdminPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import MeteorologistDashboard from '../pages/MeteorologistDashboard';
import CivilDefensePage from '../pages/CivilDefensePage'; // Importar la nueva página

function AppRoutes() {
  const { user } = useAuth();

  const RoleBasedRedirect = () => {
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
      case 'admin':
      case 'superadmin':
        return <Navigate to="/admin" />;
      case 'meteorologo':
        return <Navigate to="/meteorologist-dashboard" />;
      case 'defensa_civil': // Añadir caso para defensa civil
        return <Navigate to="/civil-defense-dashboard" />;
      default:
        return <Navigate to="/dashboard" />; // Dashboard genérico para 'user' y otros roles
    }
  };

  return (
    <Routes>
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

      {/* Rutas protegidas por rol */}
      <Route
        path="/admin"
        element={user && ['admin', 'superadmin'].includes(user.role) ? <AdminPage /> : <Navigate to="/" />}
      />
      <Route
        path="/meteorologist-dashboard"
        element={user && ['meteorologo', 'superadmin'].includes(user.role) ? <MeteorologistDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/civil-defense-dashboard" // Añadir la nueva ruta protegida
        element={user && ['defensa_civil', 'superadmin'].includes(user.role) ? <CivilDefensePage /> : <Navigate to="/" />}
      />
      <Route
        path="/dashboard"
        element={user ? <DashboardPage /> : <Navigate to="/login" />}
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
