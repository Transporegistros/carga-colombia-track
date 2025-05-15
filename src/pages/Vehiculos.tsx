
import { useState, useEffect } from "react";
import { Vehiculo } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Plus, Search, Edit, Trash, AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerVehiculos, agregarVehiculo, eliminarVehiculo } from "@/services/vehiculosService";
import { PermissionGuard } from "@/components/PermissionGuard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Vehiculos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehiculoToDelete, setVehiculoToDelete] = useState<string | null>(null);
  const [newVehiculo, setNewVehiculo] = useState({
    placa: "",
    modelo: "",
    marca: "",
    tipo: "",
    capacidad: 0,
    propietario: "",
    telefono: ""
  });
  
  const queryClient = useQueryClient();
  
  // Consulta para obtener vehículos
  const { data: vehiculos = [], isLoading, isError } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: obtenerVehiculos
  });
  
  // Mutación para agregar vehículo
  const agregarVehiculoMutation = useMutation({
    mutationFn: agregarVehiculo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      setOpen(false);
      resetForm();
      toast.success("Vehículo agregado correctamente");
    },
    onError: (error: any) => {
      toast.error("Error al agregar vehículo: " + error.message);
    }
  });
  
  // Mutación para eliminar vehículo
  const eliminarVehiculoMutation = useMutation({
    mutationFn: eliminarVehiculo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      toast.success("Vehículo eliminado correctamente");
    },
    onError: (error: any) => {
      toast.error("Error al eliminar vehículo: " + error.message);
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehiculo({
      ...newVehiculo,
      [name]: name === 'capacidad' ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agregarVehiculoMutation.mutate(newVehiculo);
  };
  
  const handleDeleteClick = (id: string) => {
    setVehiculoToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (vehiculoToDelete) {
      eliminarVehiculoMutation.mutate(vehiculoToDelete);
      setDeleteDialogOpen(false);
      setVehiculoToDelete(null);
    }
  };
  
  const resetForm = () => {
    setNewVehiculo({
      placa: "",
      modelo: "",
      marca: "",
      tipo: "",
      capacidad: 0,
      propietario: "",
      telefono: ""
    });
  };
  
  const filteredVehiculos = vehiculos.filter(vehiculo =>
    vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.propietario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vehículos</h1>
          <p className="text-muted-foreground">Administra tu flota de vehículos</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar vehículo..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <PermissionGuard modulo="vehiculos" accion="crear">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex gap-2 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  Nuevo Vehículo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="placa">Placa</Label>
                      <Input
                        id="placa"
                        name="placa"
                        required
                        placeholder="ABC123"
                        value={newVehiculo.placa}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        name="marca"
                        required
                        placeholder="Kenworth"
                        value={newVehiculo.marca}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="modelo">Modelo</Label>
                      <Input
                        id="modelo"
                        name="modelo"
                        required
                        placeholder="2023"
                        value={newVehiculo.modelo}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Input
                        id="tipo"
                        name="tipo"
                        required
                        placeholder="Tractocamión"
                        value={newVehiculo.tipo}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="capacidad">Capacidad (kg)</Label>
                      <Input
                        id="capacidad"
                        name="capacidad"
                        required
                        type="number"
                        placeholder="35000"
                        value={newVehiculo.capacidad || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="propietario">Propietario</Label>
                      <Input
                        id="propietario"
                        name="propietario"
                        required
                        placeholder="Juan Pérez"
                        value={newVehiculo.propietario}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        required
                        placeholder="3101234567"
                        value={newVehiculo.telefono}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={agregarVehiculoMutation.isPending}
                    >
                      {agregarVehiculoMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        'Guardar Vehículo'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Cargando vehículos...</span>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive opacity-80" />
          <h3 className="mt-4 text-lg font-semibold">Error al cargar vehículos</h3>
          <p className="text-muted-foreground">
            Ha ocurrido un error al cargar los vehículos. Por favor, intenta nuevamente.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ['vehiculos'] })}>
            Reintentar
          </Button>
        </div>
      ) : filteredVehiculos.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">No hay vehículos</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "No se encontraron vehículos con esa búsqueda" : "Agrega tu primer vehículo para comenzar"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehiculos.map((vehiculo) => (
            <Card key={vehiculo.id} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      <span className="font-bold text-xl">{vehiculo.placa}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {vehiculo.marca} {vehiculo.modelo}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <PermissionGuard modulo="vehiculos" accion="editar">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => toast.info("Funcionalidad de edición en desarrollo")}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                    <PermissionGuard modulo="vehiculos" accion="eliminar">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteClick(vehiculo.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{vehiculo.tipo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacidad:</span>
                    <span className="font-medium">{vehiculo.capacidad?.toLocaleString() || 'N/A'} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Propietario:</span>
                    <span className="font-medium">{vehiculo.propietario}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="font-medium">{vehiculo.telefono}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-3 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/viajes?vehiculo=${vehiculo.id}`}>Ver Viajes</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/gastos?vehiculo=${vehiculo.id}`}>Ver Gastos</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el vehículo
              y todos los registros asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={eliminarVehiculoMutation.isPending}
            >
              {eliminarVehiculoMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Vehiculos;
