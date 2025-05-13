
import { ReactNode, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AppLayout - Auth status:", { isAuthenticated, loading, user });
    
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada correctamente");
      navigate('/login');
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold">TranspoRegistrosPlus</h1>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <>
                  <div className="flex items-center mr-2">
                    <div className="bg-primary/10 text-primary p-1 rounded-full mr-2">
                      <User size={18} />
                    </div>
                    <span className="text-sm hidden md:inline-block">{user.nombre || user.email}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="flex gap-1">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Cerrar sesión</span>
                  </Button>
                </>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
