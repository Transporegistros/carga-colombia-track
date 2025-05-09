
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  nombre?: string;
  rol?: string;
  empresa_id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          // En una implementación real con Supabase, verificaríamos la sesión
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error al recuperar la sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      // Simulación de inicio de sesión exitoso
      if (email && password) {
        const mockUser = {
          id: "f6a7d8c9-e5b4-3a2c-1d0f-9e8d7c6b5a4b",
          email,
          nombre: email.split('@')[0],
          rol: "admin",
          empresa_id: "12345678-abcd-1234-efgh-1234567890ab"
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast.success("Inicio de sesión exitoso");
        navigate("/");
        return;
      }
      
      throw new Error("Credenciales incorrectas");
    } catch (error) {
      toast.error("Error al iniciar sesión: " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // En una implementación real, esto sería una llamada a Supabase
    // await supabase.auth.signOut();
    
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Sesión cerrada correctamente");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
