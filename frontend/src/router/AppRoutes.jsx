import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminPage from '../pages/AdminPage';

function AppRoutes() {
  const { user } = useAuth();

  const PostLoginRedirect = () => {
    if (!user) return <Navigate to="/login" />;
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  };

  return (
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
  );
}

export default AppRoutes;
