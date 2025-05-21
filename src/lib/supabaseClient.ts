import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  // Mejor manejo de error: mensaje más amigable y log
  // Opción: Mostrar modal o toast si la app ya está montada
  // eslint-disable-next-line no-console
  console.error('❌ Faltan las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en tu archivo .env')
  alert('Error de configuración: Faltan variables de entorno para Supabase. Por favor revisa tu archivo .env.')
  throw new Error('❌ Faltan las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
