
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function ProtectedRoute() {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute - Auth status:", { isAuthenticated, loading, user, path: location.pathname });
    
    if (!loading && !isAuthenticated) {
      toast.error("Por favor inicie sesión para acceder a esta sección");
    }
  }, [isAuthenticated, loading, user, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
