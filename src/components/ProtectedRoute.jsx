import { Navigate, useLocation } from "react-router-dom";
import { useAuth, getDashboardPath } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isSignedIn, user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user?.role && !roles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}
