
import { 
  BarChart3, 
  Menu
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePermisos } from "@/hooks/usePermisos";
import type { Modulo } from "@/services/permisosService";

// Mapa de nombres de iconos a componentes de Lucide
const iconComponents: Record<string, React.ComponentType<any>> = {
  BarChart3
};

// Importar dinámicamente iconos de Lucide
import * as LucideIcons from "lucide-react";

export function AppSidebar() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState('/');
  const { modulos, loading } = usePermisos();
  const [menuItems, setMenuItems] = useState<Modulo[]>([]);

  // Procesar módulos para asignar componentes de iconos
  useEffect(() => {
    if (modulos && modulos.length > 0) {
      setMenuItems(modulos.map(modulo => ({
        ...modulo,
        IconComponent: modulo.icono ? 
          (LucideIcons as any)[modulo.icono] || LucideIcons.FileText : 
          LucideIcons.FileText
      })));
    }
  }, [modulos]);
  
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="h-14 flex items-center px-4">
        {!isMobile && (
          <h2 className="text-lg font-bold text-primary">
            TranspoRegistrosPlus
          </h2>
        )}
        {isMobile && (
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                menuItems.map((item) => {
                  const IconComponent = item.IconComponent || LucideIcons.FileText;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <div 
                          onClick={() => handleNavigation(item.ruta)}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer",
                            activePath === item.ruta && "bg-sidebar-accent text-primary font-medium"
                          )}
                          title={item.descripcion || item.nombre}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{item.nombre}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
