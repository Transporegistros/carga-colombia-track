
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            // Get user profile data from profiles table
            const { data: profile, error: profileError } = await supabase
              .from('perfiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              // If we can't get the profile, at least set basic user data
              setUser({
                id: session.user.id,
                email: session.user.email!,
              });
              return;
            }
            
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              nombre: profile?.nombre || session.user.email!.split('@')[0],
              rol: profile?.cargo || 'usuario',
              empresa_id: profile?.empresa_id
            };
            
            setUser(userData);
          } catch (error) {
            console.error("Error en onAuthStateChange:", error);
            // If we can't get the profile, at least set basic user data
            setUser({
              id: session.user.id,
              email: session.user.email!,
            });
          }
        } else {
          setUser(null);
        }
      }
    );
    
    // THEN check for existing session
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
              .maybeSingle();
            
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              nombre: profile?.nombre || session.user.email!.split('@')[0],
              rol: profile?.cargo || 'usuario',
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
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
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
      
      // Return data internally but we don't expose it in the interface
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message.includes("Invalid login")) {
        throw new Error("Credenciales inválidas. Verifique su correo y contraseña.");
      } else {
        throw error;
      }
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
      // Format data to match perfiles table schema
      const profileData = {
        id: user.id,
        nombre: data.nombre,
        cargo: data.rol,
        empresa_id: data.empresa_id,
        ultima_conexion: new Date().toISOString()
      };

      const { error } = await supabase
        .from('perfiles')
        .upsert(profileData);
      
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
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
      console.log("Registrando usuario con email:", email);
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
          try {
            console.log("Creando empresa:", userData.empresa_nombre);
            
            // Importante: Asegurarse de que el email siempre se establece para la empresa
            const { data: empresaData, error: empresaError } = await supabase
              .from('empresas')
              .insert([
                { 
                  nombre: userData.empresa_nombre,
                  email: email // Siempre establecer el email explícitamente
                }
              ])
              .select('id')
              .single();
              
            if (empresaError) {
              console.error("Error creating empresa:", empresaError);
              throw new Error(`Error al crear empresa: ${empresaError.message} (${empresaError.code})`);
            }
            
            console.log("Empresa creada:", empresaData);
            empresa_id = empresaData?.id;
          } catch (empresaError: any) {
            console.error("Error creating empresa:", empresaError);
            throw new Error("Error al crear empresa: " + empresaError.message);
          }
        }
        
        // Create profile record - make sure data matches perfiles table schema
        try {
          console.log("Creando perfil para usuario:", data.user.id, "con empresa_id:", empresa_id);
          const { error: profileError } = await supabase.from('perfiles').insert([
            {
              id: data.user.id,
              nombre: userData.nombre,
              cargo: userData.rol || 'usuario',
              empresa_id: empresa_id
            },
          ]);
          
          if (profileError) {
            console.error("Error creating profile:", profileError);
            throw profileError;
          }
          
          console.log("Perfil creado correctamente");
          return data;
        } catch (profileError: any) {
          console.error("Error creating profile:", profileError);
          throw new Error("Error al crear perfil: " + profileError.message);
        }
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      if (error.message.includes("already registered")) {
        throw new Error("Este correo ya está registrado. Por favor inicie sesión.");
      }
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
