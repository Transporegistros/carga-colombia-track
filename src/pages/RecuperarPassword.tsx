
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Por favor ingrese su correo electrónico");
      return;
    }

    setLoading(true);
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      // Simulación de envío exitoso
      setTimeout(() => {
        setSent(true);
        toast.success("Instrucciones enviadas a su correo electrónico");
      }, 1500);
    } catch (err) {
      setError((err as Error).message || "Error al enviar las instrucciones");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            Recuperar contraseña
          </CardTitle>
          <CardDescription>
            {!sent ? 
              "Ingrese su correo electrónico para recibir las instrucciones" : 
              "Revise su correo electrónico para seguir las instrucciones"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Si su correo electrónico está registrado, recibirá instrucciones para restablecer su contraseña.
                Por favor revise su bandeja de entrada y también la carpeta de spam.
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => {
                  setEmail("");
                  setSent(false);
                }}
              >
                Intentar con otro correo
              </Button>
            </div>
          )}

          <div className="mt-6">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecuperarPassword;
