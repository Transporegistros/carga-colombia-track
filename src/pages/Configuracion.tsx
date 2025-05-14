
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Settings, User, Users, Database, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export default function Configuracion() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tabActiva, setTabActiva] = useState("general");

  if (!user || user.rol !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Acceso restringido</h3>
        <p className="text-muted-foreground">
          No tienes permisos para acceder a la configuración del sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración del Sistema</h1>
          <p className="text-muted-foreground">
            Administra las configuraciones generales de la aplicación
          </p>
        </div>
      </div>

      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="permisos">Permisos</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <ConfiguracionGeneral />
        </TabsContent>
        
        <TabsContent value="usuarios">
          <ConfiguracionUsuarios />
        </TabsContent>
        
        <TabsContent value="permisos">
          <ConfiguracionPermisos />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConfiguracionGeneral() {
  const [configuraciones, setConfiguraciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('configuraciones')
        .select('*')
        .order('clave');
      
      if (error) throw error;
      setConfiguraciones(data || []);
    } catch (error: any) {
      console.error("Error al cargar configuraciones:", error);
      toast.error("Error al cargar configuraciones: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarConfiguracion = async (id: string, valor: string) => {
    try {
      const { error } = await supabase
        .from('configuraciones')
        .update({ valor })
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Configuración actualizada correctamente");
      cargarConfiguraciones();
    } catch (error: any) {
      console.error("Error al actualizar configuración:", error);
      toast.error("Error al actualizar configuración: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Configuraciones del Sistema
        </CardTitle>
        <CardDescription>
          Ajusta los parámetros generales de la aplicación
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : configuraciones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay configuraciones disponibles.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clave</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configuraciones.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.clave}</TableCell>
                  <TableCell>{config.descripcion || "-"}</TableCell>
                  <TableCell>
                    <Input 
                      defaultValue={config.valor || ""} 
                      id={`config-${config.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm"
                      onClick={() => actualizarConfiguracion(
                        config.id, 
                        (document.getElementById(`config-${config.id}`) as HTMLInputElement)?.value || ""
                      )}
                    >
                      Guardar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function ConfiguracionUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const { data: perfiles, error } = await supabase
        .from('perfiles')
        .select('*, empresa:empresa_id(nombre)')
        .order('ultima_conexion', { ascending: false });
      
      if (error) throw error;

      setUsuarios(perfiles || []);
    } catch (error: any) {
      console.error("Error al cargar usuarios:", error);
      toast.error("Error al cargar usuarios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarRolUsuario = async (userId: string, rol: string) => {
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ cargo: rol })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success("Rol de usuario actualizado correctamente");
      cargarUsuarios();
    } catch (error: any) {
      console.error("Error al actualizar rol:", error);
      toast.error("Error al actualizar rol: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Gestión de Usuarios
        </CardTitle>
        <CardDescription>
          Administra los usuarios del sistema y sus roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay usuarios registrados.
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Última conexión</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          {usuario.nombre || "Usuario sin nombre"}
                          <div className="text-xs text-muted-foreground">{usuario.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={usuario.cargo || "usuario"} 
                        onValueChange={(value) => actualizarRolUsuario(usuario.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="usuario">Usuario</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{usuario.empresa?.nombre || "-"}</TableCell>
                    <TableCell>
                      {usuario.ultima_conexion ? new Date(usuario.ultima_conexion).toLocaleString() : "Nunca"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Detalles
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConfiguracionPermisos() {
  const [modulos, setModulos] = useState<any[]>([]);
  const [permisos, setPermisos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolActivo, setRolActivo] = useState("admin");

  useEffect(() => {
    cargarDatos();
  }, [rolActivo]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar módulos
      const { data: modulosData, error: modulosError } = await supabase
        .from('modulos')
        .select('*')
        .order('orden');
      
      if (modulosError) throw modulosError;
      
      // Cargar permisos para el rol seleccionado
      const { data: permisosData, error: permisosError } = await supabase
        .from('permisos_rol')
        .select('*')
        .eq('rol', rolActivo);
      
      if (permisosError) throw permisosError;
      
      setModulos(modulosData || []);
      setPermisos(permisosData || []);
    } catch (error: any) {
      console.error("Error al cargar datos de permisos:", error);
      toast.error("Error al cargar datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerPermiso = (moduloId: string) => {
    return permisos.find(p => p.modulo_id === moduloId) || { 
      crear: false, 
      editar: false, 
      eliminar: false, 
      ver: false 
    };
  };

  const actualizarPermiso = async (moduloId: string, tipoPermiso: string, valor: boolean) => {
    try {
      const permisoExistente = permisos.find(p => p.modulo_id === moduloId);
      
      if (permisoExistente) {
        // Actualizar permiso existente
        const { error } = await supabase
          .from('permisos_rol')
          .update({ [tipoPermiso]: valor })
          .eq('id', permisoExistente.id);
        
        if (error) throw error;
      } else {
        // Crear nuevo permiso
        const nuevoPermiso = {
          rol: rolActivo,
          modulo_id: moduloId,
          crear: tipoPermiso === 'crear' ? valor : false,
          editar: tipoPermiso === 'editar' ? valor : false,
          eliminar: tipoPermiso === 'eliminar' ? valor : false,
          ver: tipoPermiso === 'ver' ? valor : false
        };
        
        const { error } = await supabase
          .from('permisos_rol')
          .insert([nuevoPermiso]);
        
        if (error) throw error;
      }
      
      toast.success("Permiso actualizado correctamente");
      cargarDatos(); // Recargar permisos
    } catch (error: any) {
      console.error("Error al actualizar permiso:", error);
      toast.error("Error al actualizar permiso: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Gestión de Permisos
        </CardTitle>
        <CardDescription>
          Configura los permisos por rol para cada módulo del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Select value={rolActivo} onValueChange={setRolActivo}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="usuario">Usuario</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : modulos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay módulos configurados en el sistema.
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  <TableHead className="text-center">Ver</TableHead>
                  <TableHead className="text-center">Crear</TableHead>
                  <TableHead className="text-center">Editar</TableHead>
                  <TableHead className="text-center">Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modulos.map((modulo) => {
                  const permiso = obtenerPermiso(modulo.id);
                  return (
                    <TableRow key={modulo.id}>
                      <TableCell className="font-medium">{modulo.nombre}</TableCell>
                      <TableCell className="text-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-5 w-5 text-primary rounded" 
                          checked={permiso.ver}
                          onChange={(e) => actualizarPermiso(modulo.id, 'ver', e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-5 w-5 text-primary rounded" 
                          checked={permiso.crear}
                          onChange={(e) => actualizarPermiso(modulo.id, 'crear', e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-5 w-5 text-primary rounded" 
                          checked={permiso.editar}
                          onChange={(e) => actualizarPermiso(modulo.id, 'editar', e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-5 w-5 text-primary rounded" 
                          checked={permiso.eliminar}
                          onChange={(e) => actualizarPermiso(modulo.id, 'eliminar', e.target.checked)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
