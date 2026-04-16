
-- Create plant-specific details table
CREATE TABLE public.product_plant_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  pot_size text,
  color text,
  shade text,
  full_color text,
  plant_type text,
  plant_height text,
  quality_group text,
  vbn_code text,
  pieces_per_tray integer,
  floriday_trade_item_id text,
  floriday_batch_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_plant_details ENABLE ROW LEVEL SECURITY;

-- Migrate existing data
INSERT INTO public.product_plant_details (product_id, pot_size, color, shade, full_color, plant_type, plant_height, quality_group, vbn_code, pieces_per_tray, floriday_trade_item_id, floriday_batch_id)
SELECT id, pot_size, color, shade, full_color, plant_type, plant_height, quality_group, vbn_code, pieces_per_tray, floriday_trade_item_id, floriday_batch_id
FROM public.products
WHERE pot_size IS NOT NULL OR color IS NOT NULL OR shade IS NOT NULL OR full_color IS NOT NULL OR plant_type IS NOT NULL OR plant_height IS NOT NULL OR quality_group IS NOT NULL OR vbn_code IS NOT NULL OR pieces_per_tray IS NOT NULL OR floriday_trade_item_id IS NOT NULL OR floriday_batch_id IS NOT NULL;

-- Remove plant-specific columns from products
ALTER TABLE public.products DROP COLUMN pot_size;
ALTER TABLE public.products DROP COLUMN color;
ALTER TABLE public.products DROP COLUMN shade;
ALTER TABLE public.products DROP COLUMN full_color;
ALTER TABLE public.products DROP COLUMN plant_type;
ALTER TABLE public.products DROP COLUMN plant_height;
ALTER TABLE public.products DROP COLUMN quality_group;
ALTER TABLE public.products DROP COLUMN vbn_code;
ALTER TABLE public.products DROP COLUMN pieces_per_tray;
ALTER TABLE public.products DROP COLUMN floriday_trade_item_id;
ALTER TABLE public.products DROP COLUMN floriday_batch_id;
