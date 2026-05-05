import type { Database } from './types';
export declare const requireSupabaseAuth: import("@tanstack/start-client-core").FunctionMiddlewareAfterServer<{}, unknown, undefined, {
    supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
        Tables: {
            bugs: {
                Row: {
                    attachment_url: string | null;
                    created_at: string;
                    description: string;
                    id: string;
                    priority: string;
                    status: string;
                    title: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    attachment_url?: string | null;
                    created_at?: string;
                    description: string;
                    id?: string;
                    priority?: string;
                    status?: string;
                    title: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    attachment_url?: string | null;
                    created_at?: string;
                    description?: string;
                    id?: string;
                    priority?: string;
                    status?: string;
                    title?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            customer_field_options: {
                Row: {
                    created_at: string;
                    field_setting_id: string;
                    id: string;
                    label: string;
                    sort_order: number;
                };
                Insert: {
                    created_at?: string;
                    field_setting_id: string;
                    id?: string;
                    label: string;
                    sort_order?: number;
                };
                Update: {
                    created_at?: string;
                    field_setting_id?: string;
                    id?: string;
                    label?: string;
                    sort_order?: number;
                };
                Relationships: [{
                    foreignKeyName: "customer_field_options_field_setting_id_fkey";
                    columns: ["field_setting_id"];
                    isOneToOne: false;
                    referencedRelation: "customer_field_settings";
                    referencedColumns: ["id"];
                }];
            };
            customer_field_settings: {
                Row: {
                    created_at: string;
                    field_key: string;
                    field_label: string;
                    field_type: string;
                    id: string;
                    is_custom: boolean;
                    sort_order: number;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    field_key: string;
                    field_label: string;
                    field_type?: string;
                    id?: string;
                    is_custom?: boolean;
                    sort_order?: number;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    field_key?: string;
                    field_label?: string;
                    field_type?: string;
                    id?: string;
                    is_custom?: boolean;
                    sort_order?: number;
                    updated_at?: string;
                };
                Relationships: [];
            };
            customers: {
                Row: {
                    address: string | null;
                    city: string | null;
                    company_name: string;
                    country: string | null;
                    created_at: string;
                    custom_fields: import("./types").Json;
                    email: string | null;
                    id: string;
                    notes: string | null;
                    phone: string | null;
                    postal_code: string | null;
                    updated_at: string;
                };
                Insert: {
                    address?: string | null;
                    city?: string | null;
                    company_name: string;
                    country?: string | null;
                    created_at?: string;
                    custom_fields?: import("./types").Json;
                    email?: string | null;
                    id?: string;
                    notes?: string | null;
                    phone?: string | null;
                    postal_code?: string | null;
                    updated_at?: string;
                };
                Update: {
                    address?: string | null;
                    city?: string | null;
                    company_name?: string;
                    country?: string | null;
                    created_at?: string;
                    custom_fields?: import("./types").Json;
                    email?: string | null;
                    id?: string;
                    notes?: string | null;
                    phone?: string | null;
                    postal_code?: string | null;
                    updated_at?: string;
                };
                Relationships: [];
            };
            inventory_settings: {
                Row: {
                    created_at: string;
                    hierarchy_levels: string[];
                    id: string;
                    updated_at: string;
                    visible_columns: string[];
                };
                Insert: {
                    created_at?: string;
                    hierarchy_levels?: string[];
                    id?: string;
                    updated_at?: string;
                    visible_columns?: string[];
                };
                Update: {
                    created_at?: string;
                    hierarchy_levels?: string[];
                    id?: string;
                    updated_at?: string;
                    visible_columns?: string[];
                };
                Relationships: [];
            };
            locations: {
                Row: {
                    created_at: string;
                    id: string;
                    name: string;
                    sort_order: number;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    name: string;
                    sort_order?: number;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    name?: string;
                    sort_order?: number;
                    updated_at?: string;
                };
                Relationships: [];
            };
            notifications: {
                Row: {
                    created_at: string;
                    id: string;
                    message: string | null;
                    read: boolean;
                    title: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    message?: string | null;
                    read?: boolean;
                    title: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    message?: string | null;
                    read?: boolean;
                    title?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            order_field_options: {
                Row: {
                    created_at: string;
                    field_setting_id: string;
                    id: string;
                    label: string;
                    sort_order: number;
                };
                Insert: {
                    created_at?: string;
                    field_setting_id: string;
                    id?: string;
                    label: string;
                    sort_order?: number;
                };
                Update: {
                    created_at?: string;
                    field_setting_id?: string;
                    id?: string;
                    label?: string;
                    sort_order?: number;
                };
                Relationships: [{
                    foreignKeyName: "order_field_options_field_setting_id_fkey";
                    columns: ["field_setting_id"];
                    isOneToOne: false;
                    referencedRelation: "order_field_settings";
                    referencedColumns: ["id"];
                }];
            };
            order_field_settings: {
                Row: {
                    active: boolean;
                    created_at: string;
                    field_key: string;
                    field_label: string;
                    field_type: string;
                    id: string;
                    is_custom: boolean;
                    sort_order: number;
                    updated_at: string;
                };
                Insert: {
                    active?: boolean;
                    created_at?: string;
                    field_key: string;
                    field_label: string;
                    field_type?: string;
                    id?: string;
                    is_custom?: boolean;
                    sort_order?: number;
                    updated_at?: string;
                };
                Update: {
                    active?: boolean;
                    created_at?: string;
                    field_key?: string;
                    field_label?: string;
                    field_type?: string;
                    id?: string;
                    is_custom?: boolean;
                    sort_order?: number;
                    updated_at?: string;
                };
                Relationships: [];
            };
            order_items: {
                Row: {
                    created_at: string;
                    id: string;
                    order_id: string;
                    product_id: string | null;
                    product_name: string;
                    quantity: number;
                    unit: string;
                    unit_price: number | null;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    order_id: string;
                    product_id?: string | null;
                    product_name: string;
                    quantity?: number;
                    unit?: string;
                    unit_price?: number | null;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    order_id?: string;
                    product_id?: string | null;
                    product_name?: string;
                    quantity?: number;
                    unit?: string;
                    unit_price?: number | null;
                };
                Relationships: [{
                    foreignKeyName: "order_items_order_id_fkey";
                    columns: ["order_id"];
                    isOneToOne: false;
                    referencedRelation: "orders";
                    referencedColumns: ["id"];
                }, {
                    foreignKeyName: "order_items_product_id_fkey";
                    columns: ["product_id"];
                    isOneToOne: false;
                    referencedRelation: "products";
                    referencedColumns: ["id"];
                }];
            };
            orders: {
                Row: {
                    created_at: string;
                    custom_fields: import("./types").Json;
                    customer_id: string | null;
                    customer_name: string;
                    deleted_at: string | null;
                    delivery_date: string;
                    id: string;
                    notes: string | null;
                    order_date: string;
                    order_number: string;
                    status: string;
                    total: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    custom_fields?: import("./types").Json;
                    customer_id?: string | null;
                    customer_name?: string;
                    deleted_at?: string | null;
                    delivery_date: string;
                    id?: string;
                    notes?: string | null;
                    order_date?: string;
                    order_number: string;
                    status?: string;
                    total?: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    custom_fields?: import("./types").Json;
                    customer_id?: string | null;
                    customer_name?: string;
                    deleted_at?: string | null;
                    delivery_date?: string;
                    id?: string;
                    notes?: string | null;
                    order_date?: string;
                    order_number?: string;
                    status?: string;
                    total?: string;
                    updated_at?: string;
                };
                Relationships: [{
                    foreignKeyName: "orders_customer_id_fkey";
                    columns: ["customer_id"];
                    isOneToOne: false;
                    referencedRelation: "customers";
                    referencedColumns: ["id"];
                }];
            };
            product_categories: {
                Row: {
                    color: string;
                    created_at: string;
                    icon: string | null;
                    id: string;
                    name: string;
                    slug: string;
                    sort_order: number;
                    updated_at: string;
                };
                Insert: {
                    color?: string;
                    created_at?: string;
                    icon?: string | null;
                    id?: string;
                    name: string;
                    slug: string;
                    sort_order?: number;
                    updated_at?: string;
                };
                Update: {
                    color?: string;
                    created_at?: string;
                    icon?: string | null;
                    id?: string;
                    name?: string;
                    slug?: string;
                    sort_order?: number;
                    updated_at?: string;
                };
                Relationships: [];
            };
            product_field_options: {
                Row: {
                    created_at: string;
                    field_setting_id: string;
                    id: string;
                    label: string;
                    sort_order: number;
                };
                Insert: {
                    created_at?: string;
                    field_setting_id: string;
                    id?: string;
                    label: string;
                    sort_order?: number;
                };
                Update: {
                    created_at?: string;
                    field_setting_id?: string;
                    id?: string;
                    label?: string;
                    sort_order?: number;
                };
                Relationships: [{
                    foreignKeyName: "product_field_options_field_setting_id_fkey";
                    columns: ["field_setting_id"];
                    isOneToOne: false;
                    referencedRelation: "product_field_settings";
                    referencedColumns: ["id"];
                }];
            };
            product_field_settings: {
                Row: {
                    active_per_category: import("./types").Json;
                    created_at: string;
                    field_key: string;
                    field_label: string;
                    field_type: string;
                    id: string;
                    is_custom: boolean;
                    sort_order: number;
                    updated_at: string;
                };
                Insert: {
                    active_per_category?: import("./types").Json;
                    created_at?: string;
                    field_key: string;
                    field_label: string;
                    field_type?: string;
                    id?: string;
                    is_custom?: boolean;
                    sort_order?: number;
                    updated_at?: string;
                };
                Update: {
                    active_per_category?: import("./types").Json;
                    created_at?: string;
                    field_key?: string;
                    field_label?: string;
                    field_type?: string;
                    id?: string;
                    is_custom?: boolean;
                    sort_order?: number;
                    updated_at?: string;
                };
                Relationships: [];
            };
            products: {
                Row: {
                    barcode: string | null;
                    batch: string;
                    created_at: string;
                    custom_fields: import("./types").Json;
                    id: string;
                    image_url: string | null;
                    incoming_quantity: number;
                    location: string;
                    min_quantity: number;
                    product: string;
                    product_type: string;
                    purchase_price: number | null;
                    quantity: number;
                    sale_price: number | null;
                    unit: string;
                    updated_at: string;
                    weight: string | null;
                };
                Insert: {
                    barcode?: string | null;
                    batch: string;
                    created_at?: string;
                    custom_fields?: import("./types").Json;
                    id?: string;
                    image_url?: string | null;
                    incoming_quantity?: number;
                    location: string;
                    min_quantity?: number;
                    product: string;
                    product_type?: string;
                    purchase_price?: number | null;
                    quantity?: number;
                    sale_price?: number | null;
                    unit?: string;
                    updated_at?: string;
                    weight?: string | null;
                };
                Update: {
                    barcode?: string | null;
                    batch?: string;
                    created_at?: string;
                    custom_fields?: import("./types").Json;
                    id?: string;
                    image_url?: string | null;
                    incoming_quantity?: number;
                    location?: string;
                    min_quantity?: number;
                    product?: string;
                    product_type?: string;
                    purchase_price?: number | null;
                    quantity?: number;
                    sale_price?: number | null;
                    unit?: string;
                    updated_at?: string;
                    weight?: string | null;
                };
                Relationships: [];
            };
            profiles: {
                Row: {
                    created_at: string;
                    display_name: string | null;
                    email: string | null;
                    id: string;
                    notification_preferences: import("./types").Json;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    display_name?: string | null;
                    email?: string | null;
                    id: string;
                    notification_preferences?: import("./types").Json;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    display_name?: string | null;
                    email?: string | null;
                    id?: string;
                    notification_preferences?: import("./types").Json;
                    updated_at?: string;
                };
                Relationships: [];
            };
            purchase_order_items: {
                Row: {
                    created_at: string;
                    id: string;
                    product_id: string | null;
                    product_type: string;
                    purchase_order_id: string;
                    quantity: number;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    product_id?: string | null;
                    product_type?: string;
                    purchase_order_id: string;
                    quantity?: number;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    product_id?: string | null;
                    product_type?: string;
                    purchase_order_id?: string;
                    quantity?: number;
                };
                Relationships: [{
                    foreignKeyName: "purchase_order_items_product_id_fkey";
                    columns: ["product_id"];
                    isOneToOne: false;
                    referencedRelation: "products";
                    referencedColumns: ["id"];
                }, {
                    foreignKeyName: "purchase_order_items_purchase_order_id_fkey";
                    columns: ["purchase_order_id"];
                    isOneToOne: false;
                    referencedRelation: "purchase_orders";
                    referencedColumns: ["id"];
                }];
            };
            purchase_orders: {
                Row: {
                    created_at: string;
                    expected_delivery_date: string;
                    id: string;
                    location_id: string | null;
                    notes: string | null;
                    order_number: string;
                    status: string;
                    supplier_id: string | null;
                    supplier_name: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    expected_delivery_date: string;
                    id?: string;
                    location_id?: string | null;
                    notes?: string | null;
                    order_number: string;
                    status?: string;
                    supplier_id?: string | null;
                    supplier_name?: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    expected_delivery_date?: string;
                    id?: string;
                    location_id?: string | null;
                    notes?: string | null;
                    order_number?: string;
                    status?: string;
                    supplier_id?: string | null;
                    supplier_name?: string;
                    updated_at?: string;
                };
                Relationships: [{
                    foreignKeyName: "purchase_orders_location_id_fkey";
                    columns: ["location_id"];
                    isOneToOne: false;
                    referencedRelation: "locations";
                    referencedColumns: ["id"];
                }, {
                    foreignKeyName: "purchase_orders_supplier_id_fkey";
                    columns: ["supplier_id"];
                    isOneToOne: false;
                    referencedRelation: "suppliers";
                    referencedColumns: ["id"];
                }];
            };
            supplier_products: {
                Row: {
                    article_number: string | null;
                    created_at: string;
                    id: string;
                    name: string;
                    notes: string | null;
                    pot_size: string | null;
                    price: number | null;
                    quantity: number | null;
                    supplier_id: string;
                    unit: string;
                    updated_at: string;
                };
                Insert: {
                    article_number?: string | null;
                    created_at?: string;
                    id?: string;
                    name: string;
                    notes?: string | null;
                    pot_size?: string | null;
                    price?: number | null;
                    quantity?: number | null;
                    supplier_id: string;
                    unit?: string;
                    updated_at?: string;
                };
                Update: {
                    article_number?: string | null;
                    created_at?: string;
                    id?: string;
                    name?: string;
                    notes?: string | null;
                    pot_size?: string | null;
                    price?: number | null;
                    quantity?: number | null;
                    supplier_id?: string;
                    unit?: string;
                    updated_at?: string;
                };
                Relationships: [{
                    foreignKeyName: "supplier_products_supplier_id_fkey";
                    columns: ["supplier_id"];
                    isOneToOne: false;
                    referencedRelation: "suppliers";
                    referencedColumns: ["id"];
                }];
            };
            suppliers: {
                Row: {
                    address: string | null;
                    column_mappings: import("./types").Json | null;
                    contact_person: string | null;
                    created_at: string;
                    default_product_type: string;
                    email: string | null;
                    id: string;
                    imported_file_name: string | null;
                    name: string;
                    notes: string | null;
                    phone: string | null;
                    updated_at: string;
                };
                Insert: {
                    address?: string | null;
                    column_mappings?: import("./types").Json | null;
                    contact_person?: string | null;
                    created_at?: string;
                    default_product_type?: string;
                    email?: string | null;
                    id?: string;
                    imported_file_name?: string | null;
                    name: string;
                    notes?: string | null;
                    phone?: string | null;
                    updated_at?: string;
                };
                Update: {
                    address?: string | null;
                    column_mappings?: import("./types").Json | null;
                    contact_person?: string | null;
                    created_at?: string;
                    default_product_type?: string;
                    email?: string | null;
                    id?: string;
                    imported_file_name?: string | null;
                    name?: string;
                    notes?: string | null;
                    phone?: string | null;
                    updated_at?: string;
                };
                Relationships: [];
            };
            user_roles: {
                Row: {
                    created_at: string;
                    id: string;
                    role: Database["public"]["Enums"]["app_role"];
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    role: Database["public"]["Enums"]["app_role"];
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    role?: Database["public"]["Enums"]["app_role"];
                    user_id?: string;
                };
                Relationships: [{
                    foreignKeyName: "user_roles_user_id_fkey";
                    columns: ["user_id"];
                    isOneToOne: false;
                    referencedRelation: "profiles";
                    referencedColumns: ["id"];
                }];
            };
        };
        Views: { [_ in never]: never; };
        Functions: { [_ in never]: never; };
        Enums: {
            app_role: "admin" | "manager" | "warehouse" | "sales" | "developer";
        };
        CompositeTypes: { [_ in never]: never; };
    }, {
        PostgrestVersion: "14.5";
    }>;
    userId: string;
    claims: import("@supabase/auth-js").JwtPayload;
}, undefined, undefined, undefined>;
//# sourceMappingURL=auth-middleware.d.ts.map