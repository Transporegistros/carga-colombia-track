
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/types";

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session and subscribe to auth changes
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          try {
            // Get user profile data from profiles table
            const { data: profile } = await supabase
              .from('perfiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              nombre: profile?.nombre || session.user.email!.split('@')[0],
              rol: profile?.rol || 'usuario',
              empresa_id: profile?.empresa_id
            };
            
            setUser(userData);
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
            // If we can't get the profile, at least set basic user data
            setUser({
              id: session.user.id,
              email: session.user.email!,
            });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Check for session immediately
    checkSession();
    
    // Subscribe to auth changes
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            try {
              // Get user profile data
              const { data: profile } = await supabase
                .from('perfiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              const userData: User = {
                id: session.user.id,
                email: session.user.email!,
                nombre: profile?.nombre || session.user.email!.split('@')[0],
                rol: profile?.rol || 'usuario',
                empresa_id: profile?.empresa_id
              };
              
              setUser(userData);
            } catch (profileError) {
              console.error("Error fetching profile on auth change:", profileError);
              // If we can't get the profile, at least set basic user data
              setUser({
                id: session.user.id,
                email: session.user.email!,
              });
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );
      
      subscription = data.subscription;
    } catch (error) {
      console.error("Error subscribing to auth changes:", error);
      setLoading(false);
    }
    
    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from auth changes:", error);
        }
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Inicio de sesión exitoso");
        navigate("/");
      }
    } catch (error: any) {
      toast.error("Error al iniciar sesión: " + error.message);
      throw error;
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
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast.success("Instrucciones enviadas a su correo electrónico");
      return;
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
      const { error } = await supabase
        .from('perfiles')
        .upsert({ 
          id: user.id,
          ...data,
          updated_at: new Date()
        });
      
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
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
      // Register user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create empresa if empresa_nombre is provided
        let empresa_id = userData.empresa_id;
        
        if (userData.empresa_nombre && !userData.empresa_id) {
          const { data: empresaData, error: empresaError } = await supabase
            .from('empresas')
            .insert([
              { 
                nombre: userData.empresa_nombre 
              }
            ])
            .select('id')
            .single();
            
          if (empresaError) throw empresaError;
          empresa_id = empresaData?.id;
        }
        
        // Create profile record
        await supabase.from('perfiles').insert([
          {
            id: data.user.id,
            nombre: userData.nombre,
            email: email,
            empresa_id: empresa_id
          },
        ]);
        
        toast.success("Registro exitoso. Por favor verifique su correo electrónico");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error("Error al registrarse: " + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    resetPassword,
    updateProfile,
    signUp,
    isAuthenticated: !!user
  };
}
