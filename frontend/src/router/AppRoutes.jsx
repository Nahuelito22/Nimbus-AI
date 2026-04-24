import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminPage from '../pages/AdminPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import MeteorologistDashboard from '../pages/MeteorologistDashboard';
import CivilDefensePage from '../pages/CivilDefensePage';
import DataScientistDashboard from '../pages/DataScientistDashboard';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import ContactPage from '../pages/ContactPage';

function AppRoutes() {
  const { user } = useAuth();

  const RoleBasedRedirect = () => {
    if (!user) return <Navigate to="/" />;

    switch (user.role) {
      case 'admin':
      case 'superadmin':
        return <Navigate to="/admin" />;
      case 'meteorologo':
        return <Navigate to="/meteorologist-dashboard" />;
      case 'defensa_civil':
        return <Navigate to="/civil-defense-dashboard" />;
      case 'cientifico_datos':
        return <Navigate to="/data-scientist-dashboard" />;
      default:
        return <Navigate to="/dashboard" />;
    }
  };

  return (
    <Routes>
      {/* Landing page for unauthenticated users, redirect for authenticated */}
      <Route path="/" element={user ? <RoleBasedRedirect /> : <LandingPage />} />

      {/* Rutas de autenticación */}
      <Route path="/register" element={!user ? <RegisterPage /> : <RoleBasedRedirect />} />
      <Route path="/login" element={!user ? <LoginPage /> : <RoleBasedRedirect />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Rutas públicas de información */}
      <Route path="/terminos" element={<TermsPage />} />
      <Route path="/privacidad" element={<PrivacyPage />} />
      <Route path="/contacto" element={<ContactPage />} />

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
        path="/civil-defense-dashboard"
        element={user && ['defensa_civil', 'admin', 'superadmin'].includes(user.role) ? <CivilDefensePage /> : <Navigate to="/" />}
      />
      <Route
        path="/data-scientist-dashboard"
        element={user && ['cientifico_datos', 'admin', 'superadmin'].includes(user.role) ? <DataScientistDashboard /> : <Navigate to="/" />}
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
