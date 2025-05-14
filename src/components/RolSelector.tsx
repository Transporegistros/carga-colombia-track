
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RolSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  isRequired?: boolean;
}

export function RolSelector({ 
  value, 
  onChange, 
  className = "", 
  label = "Rol en la empresa", 
  isRequired = false 
}: RolSelectorProps) {
  const [roles, setRoles] = useState<{ id: string; nombre: string; descripcion?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('roles')
          .select('id, nombre, descripcion')
          .order('nombre');

        if (error) throw error;
        
        setRoles(data || []);

        // Si no hay un rol seleccionado y hay roles disponibles, seleccionar el primero por defecto
        if (!value && data && data.length > 0) {
          onChange(data[0].id);
        }
      } catch (err: any) {
        console.error('Error al cargar roles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarRoles();
  }, [value, onChange]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error al cargar roles: {error}</div>;
  }

  // Si no hay roles disponibles, mostrar un mensaje
  if (roles.length === 0) {
    return (
      <div className="space-y-2">
        {label && <Label htmlFor="rol">{label}{isRequired && <span className="text-red-500">*</span>}</Label>}
        <Select 
          value="usuario" 
          onValueChange={onChange}
          disabled={true}
        >
          <SelectTrigger id="rol" className={className}>
            <SelectValue placeholder="No hay roles disponibles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usuario">Usuario</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Se usará el rol de Usuario por defecto</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor="rol">{label}{isRequired && <span className="text-red-500">*</span>}</Label>}
      <Select 
        value={value || roles[0]?.id} 
        onValueChange={onChange}
      >
        <SelectTrigger id="rol" className={className}>
          <SelectValue placeholder="Seleccione un rol" />
        </SelectTrigger>
        <SelectContent>
          {roles.map(rol => (
            <SelectItem key={rol.id} value={rol.id}>
              {rol.nombre} {rol.descripcion ? `- ${rol.descripcion}` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
