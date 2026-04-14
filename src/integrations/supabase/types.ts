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
      afas_connections: {
        Row: {
          api_token: string
          created_at: string
          environment_url: string
          id: string
          is_active: boolean
          last_sync_at: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          api_token?: string
          created_at?: string
          environment_url?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          api_token?: string
          created_at?: string
          environment_url?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "afas_connections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      afas_price_rules: {
        Row: {
          created_at: string
          customer_class: string | null
          customer_id: string | null
          discount_percentage: number
          fixed_price: number | null
          id: string
          is_active: boolean
          priority: number
          product_group: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_class?: string | null
          customer_id?: string | null
          discount_percentage?: number
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          priority?: number
          product_group?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_class?: string | null
          customer_id?: string | null
          discount_percentage?: number
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          priority?: number
          product_group?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "afas_price_rules_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afas_price_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      afas_sale_categories: {
        Row: {
          afas_code: string | null
          created_at: string
          discount_percentage: number
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          show_in_original_category: boolean
          show_in_sale_category: boolean
          start_date: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          afas_code?: string | null
          created_at?: string
          discount_percentage?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          show_in_original_category?: boolean
          show_in_sale_category?: boolean
          start_date?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          afas_code?: string | null
          created_at?: string
          discount_percentage?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          show_in_original_category?: boolean
          show_in_sale_category?: boolean
          start_date?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "afas_sale_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      afas_sale_products: {
        Row: {
          created_at: string
          id: string
          original_price: number | null
          product_id: string
          sale_category_id: string
          sale_price: number | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          original_price?: number | null
          product_id: string
          sale_category_id: string
          sale_price?: number | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          original_price?: number | null
          product_id?: string
          sale_category_id?: string
          sale_price?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "afas_sale_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afas_sale_products_sale_category_id_fkey"
            columns: ["sale_category_id"]
            isOneToOne: false
            referencedRelation: "afas_sale_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afas_sale_products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_slips: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          scanned_items: Json
          sent_at: string | null
          sent_to_floriday: boolean
          slip_number: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          scanned_items?: Json
          sent_at?: string | null
          sent_to_floriday?: boolean
          slip_number: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          scanned_items?: Json
          sent_at?: string | null
          sent_to_floriday?: boolean
          slip_number?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_slips_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_slips_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
        }
        Relationships: []
      }
      carrier_shipping_rates: {
        Row: {
          carrier_id: string
          country_code: string
          country_name: string
          created_at: string
          id: string
          price_per_cart: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          carrier_id: string
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          price_per_cart?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          carrier_id?: string
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          price_per_cart?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrier_shipping_rates_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carrier_shipping_rates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      carriers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          cutoff_time_1: string | null
          cutoff_time_2: string | null
          delivery_days: number | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          cutoff_time_1?: string | null
          cutoff_time_2?: string | null
          delivery_days?: number | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          cutoff_time_1?: string | null
          cutoff_time_2?: string | null
          delivery_days?: number | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carriers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          carrier_id: string | null
          created_at: string
          customer_class: string | null
          discount_percentage: number
          email: string | null
          id: string
          name: string
          phone: string | null
          shipping_cost_per_cart: number | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          carrier_id?: string | null
          created_at?: string
          customer_class?: string | null
          discount_percentage?: number
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          shipping_cost_per_cart?: number | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          carrier_id?: string | null
          created_at?: string
          customer_class?: string | null
          discount_percentage?: number
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          shipping_cost_per_cart?: number | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          active: boolean
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      floriday_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "floriday_tokens_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_field_mappings: {
        Row: {
          created_at: string
          entity_type: string
          id: string
          integration_type: string
          is_active: boolean
          source_field: string
          source_label: string
          sync_direction: string
          target_field: string | null
          target_label: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_type: string
          id?: string
          integration_type: string
          is_active?: boolean
          source_field: string
          source_label: string
          sync_direction?: string
          target_field?: string | null
          target_label?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_type?: string
          id?: string
          integration_type?: string
          is_active?: boolean
          source_field?: string
          source_label?: string
          sync_direction?: string
          target_field?: string | null
          target_label?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_field_mappings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_settings: {
        Row: {
          created_at: string
          hierarchy_levels: string[]
          id: string
          tenant_id: string
          updated_at: string
          visible_columns: string[]
        }
        Insert: {
          created_at?: string
          hierarchy_levels?: string[]
          id?: string
          tenant_id: string
          updated_at?: string
          visible_columns?: string[]
        }
        Update: {
          created_at?: string
          hierarchy_levels?: string[]
          id?: string
          tenant_id?: string
          updated_at?: string
          visible_columns?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "inventory_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          delivery_date: string
          id: string
          invoice_date: string
          invoice_number: string
          items: Json
          order_date: string
          order_id: string | null
          order_number: string
          status: string
          tenant_id: string
          total: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          delivery_date: string
          id?: string
          invoice_date?: string
          invoice_number: string
          items?: Json
          order_date: string
          order_id?: string | null
          order_number: string
          status?: string
          tenant_id: string
          total: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          delivery_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          items?: Json
          order_date?: string
          order_id?: string | null
          order_number?: string
          status?: string
          tenant_id?: string
          total?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          metadata: Json | null
          tenant_id: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          metadata?: Json | null
          tenant_id: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          metadata?: Json | null
          tenant_id?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_name: string
          quantity: number
          tenant_id: string
          unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_name: string
          quantity: number
          tenant_id: string
          unit?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_name?: string
          quantity?: number
          tenant_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string
          deleted_at: string | null
          delivery_date: string
          id: string
          order_date: string
          order_number: string
          status: string
          tenant_id: string
          total: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name: string
          deleted_at?: string | null
          delivery_date: string
          id?: string
          order_date?: string
          order_number: string
          status?: string
          tenant_id: string
          total?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          deleted_at?: string | null
          delivery_date?: string
          id?: string
          order_date?: string
          order_number?: string
          status?: string
          tenant_id?: string
          total?: string | null
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
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_group_members: {
        Row: {
          created_at: string
          group_id: string
          id: string
          product_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          product_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          product_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plant_group_members_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plant_groups_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      price_list_field_options: {
        Row: {
          created_at: string
          field_setting_id: string
          id: string
          label: string
          sort_order: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          field_setting_id: string
          id?: string
          label: string
          sort_order?: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          field_setting_id?: string
          id?: string
          label?: string
          sort_order?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_list_field_options_field_setting_id_fkey"
            columns: ["field_setting_id"]
            isOneToOne: false
            referencedRelation: "price_list_field_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      price_list_field_settings: {
        Row: {
          created_at: string
          field_key: string
          field_label: string
          field_type: string
          id: string
          is_active: boolean
          is_required: boolean
          sort_order: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_label: string
          field_type?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          sort_order?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_label?: string
          field_type?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          sort_order?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_list_field_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      price_list_items: {
        Row: {
          created_at: string
          custom_fields: Json
          id: string
          price_list_id: string
          product_name: string
          sort_order: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_fields?: Json
          id?: string
          price_list_id: string
          product_name: string
          sort_order?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_fields?: Json
          id?: string
          price_list_id?: string
          product_name?: string
          sort_order?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_list_items_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      price_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_lists_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_compositions: {
        Row: {
          component_product_id: string
          created_at: string
          id: string
          parent_product_id: string
          quantity: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          component_product_id: string
          created_at?: string
          id?: string
          parent_product_id: string
          quantity: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          component_product_id?: string
          created_at?: string
          id?: string
          parent_product_id?: string
          quantity?: number
          tenant_id?: string
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
          tenant_id: string
        }
        Insert: {
          created_at?: string
          field_setting_id: string
          id?: string
          label: string
          sort_order?: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          field_setting_id?: string
          id?: string
          label?: string
          sort_order?: number
          tenant_id?: string
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
          applies_to: string
          created_at: string
          field_key: string
          field_label: string
          field_type: string
          id: string
          is_active: boolean
          is_custom: boolean
          sort_order: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          applies_to?: string
          created_at?: string
          field_key: string
          field_label: string
          field_type?: string
          id?: string
          is_active?: boolean
          is_custom?: boolean
          sort_order?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          applies_to?: string
          created_at?: string
          field_key?: string
          field_label?: string
          field_type?: string
          id?: string
          is_active?: boolean
          is_custom?: boolean
          sort_order?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_field_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          batch: string
          color: string | null
          created_at: string
          floriday_batch_id: string | null
          floriday_trade_item_id: string | null
          full_color: string | null
          id: string
          image_url: string | null
          incoming_quantity: number
          location: string
          min_quantity: number
          pieces_per_tray: number | null
          plant_height: string | null
          plant_type: string | null
          pot_size: string | null
          product: string
          product_type: string
          purchase_price: number | null
          quality_group: string | null
          quantity: number
          sale_price: number | null
          shade: string | null
          tenant_id: string
          unit: string
          updated_at: string
          vbn_code: string | null
        }
        Insert: {
          barcode?: string | null
          batch: string
          color?: string | null
          created_at?: string
          floriday_batch_id?: string | null
          floriday_trade_item_id?: string | null
          full_color?: string | null
          id?: string
          image_url?: string | null
          incoming_quantity?: number
          location: string
          min_quantity?: number
          pieces_per_tray?: number | null
          plant_height?: string | null
          plant_type?: string | null
          pot_size?: string | null
          product: string
          product_type?: string
          purchase_price?: number | null
          quality_group?: string | null
          quantity?: number
          sale_price?: number | null
          shade?: string | null
          tenant_id: string
          unit?: string
          updated_at?: string
          vbn_code?: string | null
        }
        Update: {
          barcode?: string | null
          batch?: string
          color?: string | null
          created_at?: string
          floriday_batch_id?: string | null
          floriday_trade_item_id?: string | null
          full_color?: string | null
          id?: string
          image_url?: string | null
          incoming_quantity?: number
          location?: string
          min_quantity?: number
          pieces_per_tray?: number | null
          plant_height?: string | null
          plant_type?: string | null
          pot_size?: string | null
          product?: string
          product_type?: string
          purchase_price?: number | null
          quality_group?: string | null
          quantity?: number
          sale_price?: number | null
          shade?: string | null
          tenant_id?: string
          unit?: string
          updated_at?: string
          vbn_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotion_links: {
        Row: {
          code: string
          created_at: string
          customer_company: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          promotion_id: string
          tenant_id: string | null
        }
        Insert: {
          code?: string
          created_at?: string
          customer_company?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          promotion_id: string
          tenant_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          customer_company?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          promotion_id?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_links_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_orders: {
        Row: {
          created_at: string
          customer_company: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          items: Json
          notes: string | null
          promotion_id: string | null
          promotion_link_id: string | null
          status: string
          tenant_id: string | null
          total_amount: number
        }
        Insert: {
          created_at?: string
          customer_company?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          items: Json
          notes?: string | null
          promotion_id?: string | null
          promotion_link_id?: string | null
          status?: string
          tenant_id?: string | null
          total_amount?: number
        }
        Update: {
          created_at?: string
          customer_company?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          items?: Json
          notes?: string | null
          promotion_id?: string | null
          promotion_link_id?: string | null
          status?: string
          tenant_id?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "promotion_orders_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          message: string | null
          products: Json
          sticker_price: number | null
          subject: string
          tenant_id: string | null
        }
        Insert: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string | null
          products: Json
          sticker_price?: number | null
          subject: string
          tenant_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string | null
          products?: Json
          sticker_price?: number | null
          subject?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_name: string
          product_type: string
          purchase_order_id: string
          quantity: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name: string
          product_type?: string
          purchase_order_id: string
          quantity?: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          product_type?: string
          purchase_order_id?: string
          quantity?: number
          tenant_id?: string
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
          tenant_id: string
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
          tenant_id: string
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
          tenant_id?: string
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
          {
            foreignKeyName: "purchase_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_branding: {
        Row: {
          accent_color: string | null
          created_at: string
          custom_css: string | null
          font_family: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string
          custom_css?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string
          custom_css?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_branding_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_customers: {
        Row: {
          company_name: string | null
          contact_name: string | null
          created_at: string
          customer_id: string | null
          discount_percentage: number | null
          email: string
          id: string
          last_login_at: string | null
          password_hash: string | null
          phone: string | null
          price_list: string | null
          role: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          contact_name?: string | null
          created_at?: string
          customer_id?: string | null
          discount_percentage?: number | null
          email: string
          id?: string
          last_login_at?: string | null
          password_hash?: string | null
          phone?: string | null
          price_list?: string | null
          role?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          contact_name?: string | null
          created_at?: string
          customer_id?: string | null
          discount_percentage?: number | null
          email?: string
          id?: string
          last_login_at?: string | null
          password_hash?: string | null
          phone?: string | null
          price_list?: string | null
          role?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_customers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_homepage_blocks: {
        Row: {
          block_type: string
          content: Json | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          subtitle: string | null
          tenant_id: string
          title: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          block_type: string
          content?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          tenant_id: string
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          block_type?: string
          content?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          tenant_id?: string
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_homepage_blocks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_settings: {
        Row: {
          afas_connected: boolean | null
          allow_guest_browsing: boolean | null
          created_at: string
          default_currency: string | null
          default_language: string | null
          enable_agent_mode: boolean | null
          id: string
          order_confirmation_email: boolean | null
          require_login_for_prices: boolean | null
          shop_name: string | null
          shopify_connected: boolean | null
          shopify_shop_domain: string | null
          supported_currencies: string[] | null
          supported_languages: string[] | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          afas_connected?: boolean | null
          allow_guest_browsing?: boolean | null
          created_at?: string
          default_currency?: string | null
          default_language?: string | null
          enable_agent_mode?: boolean | null
          id?: string
          order_confirmation_email?: boolean | null
          require_login_for_prices?: boolean | null
          shop_name?: string | null
          shopify_connected?: boolean | null
          shopify_shop_domain?: string | null
          supported_currencies?: string[] | null
          supported_languages?: string[] | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          afas_connected?: boolean | null
          allow_guest_browsing?: boolean | null
          created_at?: string
          default_currency?: string | null
          default_language?: string | null
          enable_agent_mode?: boolean | null
          id?: string
          order_confirmation_email?: boolean | null
          require_login_for_prices?: boolean | null
          shop_name?: string | null
          shopify_connected?: boolean | null
          shopify_shop_domain?: string | null
          supported_currencies?: string[] | null
          supported_languages?: string[] | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_connections: {
        Row: {
          access_token: string
          id: string
          installed_at: string
          is_active: boolean
          scopes: string
          shop_domain: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          access_token: string
          id?: string
          installed_at?: string
          is_active?: boolean
          scopes?: string
          shop_domain: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          id?: string
          installed_at?: string
          is_active?: boolean
          scopes?: string
          shop_domain?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_connections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      site_pages: {
        Row: {
          blocks: Json
          created_at: string
          id: string
          meta_description: string | null
          meta_title: string | null
          slug: string
          status: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          blocks?: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          status?: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_pages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          tenant_id: string
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
          tenant_id: string
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
          tenant_id?: string
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
          {
            foreignKeyName: "supplier_products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          tenant_id: string
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
          tenant_id: string
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
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          direction: string
          error_details: Json | null
          id: string
          items_failed: number
          items_synced: number
          started_at: string
          status: string
          sync_type: string
          tenant_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          direction?: string
          error_details?: Json | null
          id?: string
          items_failed?: number
          items_synced?: number
          started_at?: string
          status?: string
          sync_type?: string
          tenant_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          direction?: string
          error_details?: Json | null
          id?: string
          items_failed?: number
          items_synced?: number
          started_at?: string
          status?: string
          sync_type?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_integrations: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: string
          integration_type: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          integration_type: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          integration_type?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_modules: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          module_key: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          module_key: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          module_key?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_modules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_users: {
        Row: {
          created_at: string
          id: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          contact_person: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          kvk_number: string | null
          phone: string | null
          postal_code: string | null
          status: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          kvk_number?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          kvk_number?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          created_at: string
          employee_id: string
          entry_date: string
          hours: number
          id: string
          notes: string | null
          overtime: number
          tenant_id: string
          undertime: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          entry_date: string
          hours?: number
          id?: string
          notes?: string | null
          overtime?: number
          tenant_id: string
          undertime?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          entry_date?: string
          hours?: number
          id?: string
          notes?: string | null
          overtime?: number
          tenant_id?: string
          undertime?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
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
      user_tab_permissions: {
        Row: {
          created_at: string
          id: string
          tab_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tab_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tab_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tab_permissions_user_id_fkey"
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
