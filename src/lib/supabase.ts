
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Authentication will not work.");
}

// Create a Supabase client with error handling
let supabase;
try {
  // Provide a fallback URL for development only
  const url = supabaseUrl || "https://example.supabase.co";
  const key = supabaseAnonKey || "your-anon-key";
  
  supabase = createClient(url, key);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Only show this in development
    if (import.meta.env.DEV) {
      toast.error(
        "Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.",
        { duration: 10000 }
      );
    }
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  // Provide a mock client that won't crash the app but won't work either
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.reject(new Error("Supabase client not properly initialized")),
      signOut: () => Promise.reject(new Error("Supabase client not properly initialized")),
      resetPasswordForEmail: () => Promise.reject(new Error("Supabase client not properly initialized")),
      signUp: () => Promise.reject(new Error("Supabase client not properly initialized"))
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          insert: () => Promise.resolve({ data: null, error: null }),
          upsert: () => Promise.resolve({ data: null, error: null })
        })
      })
    })
  };
}

export { supabase };
