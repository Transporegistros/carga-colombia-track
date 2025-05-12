
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Para depuración
    console.log("ProtectedRoute - Auth status:", { isAuthenticated, loading });
    
    if (!loading && !isAuthenticated) {
      toast.error("Por favor inicie sesión para acceder a esta sección");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
