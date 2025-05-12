
import React, { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();
  
  // Create a compatible version of auth that matches the expected types
  const contextValue: AuthContextType = {
    user: auth.user,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
    login: async (email, password) => {
      await auth.login(email, password);
      // Return type is void - we handle the data internally in useAuthProvider
    },
    logout: auth.logout,
    resetPassword: auth.resetPassword,
    updateProfile: auth.updateProfile,
    signUp: auth.signUp
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
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
