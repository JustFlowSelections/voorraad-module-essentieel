
-- Product field settings table
CREATE TABLE public.product_field_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_key text NOT NULL,
  field_label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  is_active boolean NOT NULL DEFAULT true,
  is_custom boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  applies_to text NOT NULL DEFAULT 'beide',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_field_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read field settings"
  ON public.product_field_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert field settings"
  ON public.product_field_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update field settings"
  ON public.product_field_settings FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete field settings"
  ON public.product_field_settings FOR DELETE TO authenticated USING (true);

-- Product field options table (for select-type fields)
CREATE TABLE public.product_field_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_setting_id uuid NOT NULL REFERENCES public.product_field_settings(id) ON DELETE CASCADE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_field_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read field options"
  ON public.product_field_options FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert field options"
  ON public.product_field_options FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update field options"
  ON public.product_field_options FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete field options"
  ON public.product_field_options FOR DELETE TO authenticated USING (true);

-- Product categories table
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read categories"
  ON public.product_categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON public.product_categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON public.product_categories FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete categories"
  ON public.product_categories FOR DELETE TO authenticated USING (true);

-- Insert default categories
INSERT INTO public.product_categories (name, slug, icon, sort_order) VALUES
  ('Levend', 'levend', 'leaf', 0),
  ('Dood', 'dood', 'box', 1);

-- Insert default field settings
INSERT INTO public.product_field_settings (field_key, field_label, field_type, is_active, is_custom, sort_order, applies_to) VALUES
  ('product', 'Productnaam', 'text', true, false, 0, 'beide'),
  ('batch', 'Partijnummer', 'text', true, false, 1, 'beide'),
  ('location', 'Locatie', 'text', true, false, 2, 'beide'),
  ('quantity', 'Aantal', 'number', true, false, 3, 'beide'),
  ('min_quantity', 'Minimum voorraad', 'number', true, false, 4, 'beide'),
  ('unit', 'Eenheid', 'text', true, false, 5, 'beide'),
  ('barcode', 'Barcode', 'text', true, false, 6, 'beide'),
  ('purchase_price', 'Inkoopprijs', 'number', true, false, 7, 'beide'),
  ('sale_price', 'Verkoopprijs', 'number', true, false, 8, 'beide'),
  ('plant_type', 'Planttype', 'text', true, false, 9, 'levend'),
  ('pot_size', 'Potmaat', 'text', true, false, 10, 'levend'),
  ('color', 'Kleur', 'text', true, false, 11, 'levend'),
  ('shade', 'Tint', 'text', true, false, 12, 'levend'),
  ('vbn_code', 'VBN-code', 'text', true, false, 13, 'levend'),
  ('pieces_per_tray', 'Stuks per tray', 'number', true, false, 14, 'levend'),
  ('plant_height', 'Planthoogte', 'text', true, false, 15, 'levend'),
  ('quality_group', 'Kwaliteitsgroep', 'text', true, false, 16, 'levend');

-- Add RLS policies to existing tables that are missing them
CREATE POLICY "Authenticated users can read locations"
  ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert locations"
  ON public.locations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update locations"
  ON public.locations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete locations"
  ON public.locations FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read inventory_settings"
  ON public.inventory_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert inventory_settings"
  ON public.inventory_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update inventory_settings"
  ON public.inventory_settings FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read products"
  ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert products"
  ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products"
  ON public.products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete products"
  ON public.products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read plant details"
  ON public.product_plant_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert plant details"
  ON public.product_plant_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update plant details"
  ON public.product_plant_details FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete plant details"
  ON public.product_plant_details FOR DELETE TO authenticated USING (true);
