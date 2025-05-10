
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase as supabaseClient } from "@/integrations/supabase/client";

// Exportamos directamente el cliente de Supabase integrado
export const supabase = supabaseClient;

// También dejamos este código para compatibilidad con el resto de la aplicación
// que podría estar usando este archivo
export { supabase as supabaseClient };
