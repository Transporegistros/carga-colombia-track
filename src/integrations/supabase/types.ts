export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      configuraciones: {
        Row: {
          clave: string
          created_at: string | null
          descripcion: string | null
          empresa_id: string | null
          es_sistema: boolean | null
          id: string
          updated_at: string | null
          valor: string | null
        }
        Insert: {
          clave: string
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: string | null
          es_sistema?: boolean | null
          id?: string
          updated_at?: string | null
          valor?: string | null
        }
        Update: {
          clave?: string
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: string | null
          es_sistema?: boolean | null
          id?: string
          updated_at?: string | null
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuraciones_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          activa: boolean | null
          created_at: string | null
          direccion: string | null
          email: string | null
          id: string
          logo_url: string | null
          nit: string | null
          nombre: string
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          activa?: boolean | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          nit?: string | null
          nombre: string
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          activa?: boolean | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          nit?: string | null
          nombre?: string
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gastos: {
        Row: {
          comprobante_url: string | null
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          empresa_id: string
          fecha: string
          id: string
          kilometraje: number | null
          monto: number
          tipo: string
          ubicacion: string | null
          updated_at: string | null
          vehiculo_id: string
          viaje_id: string | null
        }
        Insert: {
          comprobante_url?: string | null
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          empresa_id: string
          fecha: string
          id?: string
          kilometraje?: number | null
          monto: number
          tipo: string
          ubicacion?: string | null
          updated_at?: string | null
          vehiculo_id: string
          viaje_id?: string | null
        }
        Update: {
          comprobante_url?: string | null
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          empresa_id?: string
          fecha?: string
          id?: string
          kilometraje?: number | null
          monto?: number
          tipo?: string
          ubicacion?: string | null
          updated_at?: string | null
          vehiculo_id?: string
          viaje_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gastos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_viaje_id_fkey"
            columns: ["viaje_id"]
            isOneToOne: false
            referencedRelation: "viajes"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          apellido: string | null
          cargo: string | null
          created_at: string | null
          empresa_id: string | null
          id: string
          nombre: string | null
          telefono: string | null
          ultima_conexion: string | null
          updated_at: string | null
        }
        Insert: {
          apellido?: string | null
          cargo?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id: string
          nombre?: string | null
          telefono?: string | null
          ultima_conexion?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string | null
          cargo?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          nombre?: string | null
          telefono?: string | null
          ultima_conexion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_perfiles_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehiculos: {
        Row: {
          capacidad: number | null
          created_at: string | null
          created_by: string | null
          empresa_id: string
          id: string
          imagen: string | null
          marca: string | null
          modelo: string | null
          placa: string
          propietario: string | null
          telefono: string | null
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          capacidad?: number | null
          created_at?: string | null
          created_by?: string | null
          empresa_id: string
          id?: string
          imagen?: string | null
          marca?: string | null
          modelo?: string | null
          placa: string
          propietario?: string | null
          telefono?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          capacidad?: number | null
          created_at?: string | null
          created_by?: string | null
          empresa_id?: string
          id?: string
          imagen?: string | null
          marca?: string | null
          modelo?: string | null
          placa?: string
          propietario?: string | null
          telefono?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehiculos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      viajes: {
        Row: {
          carga: string | null
          conductor: string | null
          created_at: string | null
          created_by: string | null
          destino: string
          distancia: number | null
          empresa_id: string
          estado: string
          fecha_llegada: string | null
          fecha_salida: string
          id: string
          origen: string
          updated_at: string | null
          vehiculo_id: string
        }
        Insert: {
          carga?: string | null
          conductor?: string | null
          created_at?: string | null
          created_by?: string | null
          destino: string
          distancia?: number | null
          empresa_id: string
          estado?: string
          fecha_llegada?: string | null
          fecha_salida: string
          id?: string
          origen: string
          updated_at?: string | null
          vehiculo_id: string
        }
        Update: {
          carga?: string | null
          conductor?: string | null
          created_at?: string | null
          created_by?: string | null
          destino?: string
          distancia?: number | null
          empresa_id?: string
          estado?: string
          fecha_llegada?: string | null
          fecha_salida?: string
          id?: string
          origen?: string
          updated_at?: string | null
          vehiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viajes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viajes_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_resumen_empresa: {
        Args: { p_empresa_id: string }
        Returns: {
          total_vehiculos: number
          viajes_activos: number
          gastos_mes: number
          combustible_mes: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
