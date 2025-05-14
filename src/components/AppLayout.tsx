
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "./ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  if (!isAuthenticated) {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              {isMobile && (
                <SidebarToggleButton />
              )}
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

// Componente para el botón de alternar la barra lateral
function SidebarToggleButton() {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className="h-8 w-8 mr-1"
      aria-label="Mostrar/ocultar menú"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
