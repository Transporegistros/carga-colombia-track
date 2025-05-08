
import { 
  Truck, 
  Calendar, 
  Receipt, 
  DollarSign, 
  Fuel, 
  BarChart3, 
  MapPin, 
  Menu 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
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

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/"
  },
  {
    title: "Vehículos",
    icon: Truck,
    path: "/vehiculos"
  },
  {
    title: "Viajes",
    icon: MapPin,
    path: "/viajes"
  },
  {
    title: "Gastos",
    icon: DollarSign,
    path: "/gastos"
  },
  {
    title: "Combustible",
    icon: Fuel,
    path: "/combustible"
  },
  {
    title: "Peajes",
    icon: Receipt,
    path: "/peajes"
  },
  {
    title: "Reportes",
    icon: Calendar,
    path: "/reportes"
  }
];

export function AppSidebar() {
  const isMobile = useIsMobile();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="h-14 flex items-center px-4">
        {!isMobile && (
          <h2 className="text-lg font-bold text-transpo-blue">
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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <a href={item.path} className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      window.location.pathname === item.path && "bg-sidebar-accent text-transpo-blue font-medium"
                    )}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
