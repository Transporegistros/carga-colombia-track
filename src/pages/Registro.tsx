
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, AtSign, Building, User, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { RolSelector } from "@/components/RolSelector";

const Registro = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [empresa_nombre, setEmpresaNombre] = useState("");
  const [rol, setRol] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, isAuthenticated, loading } = useAuth();

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (!loading && isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Validaciones básicas
      if (!nombre || !email || !password || !confirmPassword) {
        setError("Por favor complete todos los campos obligatorios");
        setIsSubmitting(false);
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        setIsSubmitting(false);
        return;
      }
      
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        setIsSubmitting(false);
        return;
      }
      
      // Datos del usuario para el registro
      const userData = {
        nombre,
        rol,
        empresa_nombre: empresa_nombre || undefined,
      };
      
      await signUp(email, password, userData);
      toast.success("Registro exitoso. Revise su correo para confirmar su cuenta.");
      navigate("/login");
    } catch (err) {
      console.error("Error de registro:", err);
      setError((err as Error).message || "Error al registrarse. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            Crear una cuenta
          </CardTitle>
          <CardDescription>
            Ingrese sus datos para registrarse en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleRegistro} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre<span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Su nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || isSubmitting}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico<span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || isSubmitting}
                />
                <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="empresa">Nombre de la empresa</Label>
              <div className="relative">
                <Input
                  id="empresa"
                  type="text"
                  placeholder="Nombre de su empresa"
                  value={empresa_nombre}
                  onChange={(e) => setEmpresaNombre(e.target.value)}
                  className="pl-10"
                  disabled={loading || isSubmitting}
                />
                <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Déjelo en blanco si se unirá a una empresa existente</p>
            </div>
            
            <RolSelector
              value={rol}
              onChange={setRol}
              isRequired={true}
            />
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña<span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || isSubmitting}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0" 
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña<span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || isSubmitting}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading || isSubmitting}>
              {loading || isSubmitting ? "Procesando..." : "Registrarse"}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tiene una cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Inicie sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registro;
