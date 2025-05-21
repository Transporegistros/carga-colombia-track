import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type { User } from "@/types";

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error) throw error;
        const session = sessionData.session;
        if (!session) {
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          // Cargar perfil de usuario
          try {
            const { data: perfil, error: perfilError } = await supabase
              .from("perfiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
            if (perfilError) throw perfilError;
            setUser({
              id: session.user.id,
              email: session.user.email!,
              nombre: perfil.nombre || "",
              rol: perfil.cargo || "usuario",
              empresa_id: perfil.empresa_id || "",
            });
          } catch (profileError) {
            // eslint-disable-next-line no-console
            console.error("Error fetching profile:", profileError);
            setUser({
              id: session.user.id,
              email: session.user.email!,
            });
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => checkSession());
    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.includes("Invalid login")) {
          throw new Error("Credenciales inválidas. Verifique su correo y contraseña.");
        }
        throw error;
      }
      return data;
    } catch (error: any) {
      const finalMsg = error.message || "Error al iniciar sesión. Intente nuevamente.";
      toast.error(finalMsg);
      // eslint-disable-next-line no-console
      console.error("Login error:", error);
      throw new Error(finalMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Sesión cerrada correctamente");
      navigate("/login");
    } catch (error: any) {
      toast.error("Error al cerrar sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Instrucciones enviadas a su correo electrónico");
    } catch (error: any) {
      toast.error("Error al enviar instrucciones: " + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("No hay usuario autenticado");
    setLoading(true);
    try {
      const profileData = {
        id: user.id,
        nombre: data.nombre,
        cargo: data.rol,
        empresa_id: data.empresa_id,
        ultima_conexion: new Date().toISOString(),
      };
      const { error } = await supabase.from("perfiles").upsert(profileData);
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Error updating profile:", error);
        throw error;
      }
      setUser((prev) => (prev ? { ...prev, ...data } : null));
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      toast.error("Error al actualizar perfil: " + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) {
        await updateProfile({ ...userData, id: data.user.id, email: data.user.email });
      }
      toast.success("Registro exitoso, revisa tu correo para confirmar la cuenta");
    } catch (error: any) {
      toast.error("Error al registrar usuario: " + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    resetPassword,
    updateProfile,
    signUp,
  };
}
