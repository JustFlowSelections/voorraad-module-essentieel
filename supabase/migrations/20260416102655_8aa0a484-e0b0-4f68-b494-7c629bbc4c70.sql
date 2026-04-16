-- 1. Delete duplicate rows (keeping the first of each pair)
DELETE FROM public.product_field_settings
WHERE id IN (
  '9f4c6fa2-e29e-4f4a-8d96-49b39c7f8247',  -- pot_size duplicate
  '94edb272-4b16-4add-8073-5e47efb24175',  -- color duplicate
  '9fd6aa85-64a7-4ac1-9a03-80ef711bc193',  -- shade duplicate
  '8588af58-3950-4e73-b8ed-08adeb86eca5',  -- plant_height duplicate
  '5499d24e-33ad-4a02-9a83-065a4835a731',  -- quality_group duplicate
  '8fdbd7bd-d658-4eee-9191-b953b5b70684',  -- vbn_code duplicate
  '15822b3c-6bc2-463a-b95d-e6f6570b6041',  -- pieces_per_tray duplicate
  '31d5840e-286c-4c07-b75b-c2477f3a3217'   -- plant_type duplicate
);

-- 2. Set is_custom = true for category-specific fields (not core fields)
-- Core fields: product, location, quantity, batch, min_quantity, unit, barcode, purchase_price, sale_price
UPDATE public.product_field_settings
SET is_custom = true, updated_at = now()
WHERE field_key IN ('plant_type', 'pot_size', 'color', 'shade', 'full_color', 'vbn_code', 'pieces_per_tray', 'plant_height', 'quality_group');

-- 3. Re-number sort_order to be sequential after removing duplicates
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY sort_order) - 1 AS new_order
  FROM public.product_field_settings
)
UPDATE public.product_field_settings pfs
SET sort_order = numbered.new_order
FROM numbered
WHERE pfs.id = numbered.id;