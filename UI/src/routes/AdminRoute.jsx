import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}