
import * as LucideIcons from "lucide-react";

// Mapa de nombres de iconos a componentes de Lucide
export const getIconComponent = (iconName: string | null) => {
  if (!iconName) return LucideIcons.FileText;

  // Intentar obtener el componente directamente
  const IconComponent = (LucideIcons as any)[iconName];
  
  // Si existe, devolverlo; si no, devolver un icono predeterminado
  return IconComponent || LucideIcons.FileText;
};
