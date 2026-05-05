export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bugs: {
        Row: {
          attachment_url: string | null
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_field_options: {
        Row: {
          created_at: string
          field_setting_id: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          field_setting_id: string
          id?: string
          label: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          field_setting_id?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_field_options_field_setting_id_fkey"
            columns: ["field_setting_id"]
            isOneToOne: false
            referencedRelation: "customer_field_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_field_settings: {
        Row: {
          created_at: string
          field_key: string
          field_label: string
          field_type: string
          id: string
          is_custom: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_label: string
          field_type?: string
          id?: string
          is_custom?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_label?: string
          field_type?: string
          id?: string
          is_custom?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          country: string | null
          created_at: string
          custom_fields: Json
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          country?: string | null
          created_at?: string
          custom_fields?: Json
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          country?: string | null
          created_at?: string
          custom_fields?: Json
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_settings: {
        Row: {
          created_at: string
          hierarchy_levels: string[]
          id: string
          updated_at: string
          visible_columns: string[]
        }
        Insert: {
          created_at?: string
          hierarchy_levels?: string[]
          id?: string
          updated_at?: string
          visible_columns?: string[]
        }
        Update: {
          created_at?: string
          hierarchy_levels?: string[]
          id?: string
          updated_at?: string
          visible_columns?: string[]
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_field_options: {
        Row: {
          created_at: string
          field_setting_id: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          field_setting_id: string
          id?: string
          label: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          field_setting_id?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_field_options_field_setting_id_fkey"
            columns: ["field_setting_id"]
            isOneToOne: false
            referencedRelation: "order_field_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      order_field_settings: {
        Row: {
          active: boolean
          created_at: string
          field_key: string
          field_label: string
          field_type: string
          id: string
          is_custom: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          field_key: string
          field_label: string
          field_type?: string
          id?: string
          is_custom?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          field_key?: string
          field_label?: string
          field_type?: string
          id?: string
          is_custom?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit: string
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          unit?: string
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          custom_fields: Json
          customer_id: string | null
          customer_name: string
          deleted_at: string | null
          delivery_date: string
          id: string
          notes: string | null
          order_date: string
          order_number: string
          status: string
          total: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_fields?: Json
          customer_id?: string | null
          customer_name?: string
          deleted_at?: string | null
          delivery_date: string
          id?: string
          notes?: string | null
          order_date?: string
          order_number: string
          status?: string
          total?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_fields?: Json
          customer_id?: string | null
          customer_name?: string
          deleted_at?: string | null
          delivery_date?: string
          id?: string
          notes?: string | null
          order_date?: string
          order_number?: string
          status?: string
          total?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          color: string
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_field_options: {
        Row: {
          created_at: string
          field_setting_id: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          field_setting_id: string
          id?: string
          label: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          field_setting_id?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_field_options_field_setting_id_fkey"
            columns: ["field_setting_id"]
            isOneToOne: false
            referencedRelation: "product_field_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      product_field_settings: {
        Row: {
          active_per_category: Json
          created_at: string
          field_key: string
          field_label: string
          field_type: string
          id: string
          is_custom: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          active_per_category?: Json
          created_at?: string
          field_key: string
          field_label: string
          field_type?: string
          id?: string
          is_custom?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active_per_category?: Json
          created_at?: string
          field_key?: string
          field_label?: string
          field_type?: string
          id?: string
          is_custom?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          barcode: string | null
          batch: string
          created_at: string
          custom_fields: Json
          id: string
          image_url: string | null
          incoming_quantity: number
          location: string
          min_quantity: number
          product: string
          product_type: string
          purchase_price: number | null
          quantity: number
          sale_price: number | null
          unit: string
          updated_at: string
          weight: string | null
        }
        Insert: {
          barcode?: string | null
          batch: string
          created_at?: string
          custom_fields?: Json
          id?: string
          image_url?: string | null
          incoming_quantity?: number
          location: string
          min_quantity?: number
          product: string
          product_type?: string
          purchase_price?: number | null
          quantity?: number
          sale_price?: number | null
          unit?: string
          updated_at?: string
          weight?: string | null
        }
        Update: {
          barcode?: string | null
          batch?: string
          created_at?: string
          custom_fields?: Json
          id?: string
          image_url?: string | null
          incoming_quantity?: number
          location?: string
          min_quantity?: number
          product?: string
          product_type?: string
          purchase_price?: number | null
          quantity?: number
          sale_price?: number | null
          unit?: string
          updated_at?: string
          weight?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          notification_preferences: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          notification_preferences?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          notification_preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_type: string
          purchase_order_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_type?: string
          purchase_order_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_type?: string
          purchase_order_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          expected_delivery_date: string
          id: string
          location_id: string | null
          notes: string | null
          order_number: string
          status: string
          supplier_id: string | null
          supplier_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expected_delivery_date: string
          id?: string
          location_id?: string | null
          notes?: string | null
          order_number: string
          status?: string
          supplier_id?: string | null
          supplier_name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expected_delivery_date?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          order_number?: string
          status?: string
          supplier_id?: string | null
          supplier_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_products: {
        Row: {
          article_number: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          pot_size: string | null
          price: number | null
          quantity: number | null
          supplier_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          article_number?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          pot_size?: string | null
          price?: number | null
          quantity?: number | null
          supplier_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          article_number?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          pot_size?: string | null
          price?: number | null
          quantity?: number | null
          supplier_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          column_mappings: Json | null
          contact_person: string | null
          created_at: string
          default_product_type: string
          email: string | null
          id: string
          imported_file_name: string | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          column_mappings?: Json | null
          contact_person?: string | null
          created_at?: string
          default_product_type?: string
          email?: string | null
          id?: string
          imported_file_name?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          column_mappings?: Json | null
          contact_person?: string | null
          created_at?: string
          default_product_type?: string
          email?: string | null
          id?: string
          imported_file_name?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "manager" | "warehouse" | "sales" | "developer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "warehouse", "sales", "developer"],
    },
  },
} as const
