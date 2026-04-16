
-- Step 1: Migrate existing plant details into products.custom_fields
UPDATE public.products p
SET custom_fields = jsonb_strip_nulls(jsonb_build_object(
  'pot_size', d.pot_size,
  'color', d.color,
  'shade', d.shade,
  'full_color', d.full_color,
  'plant_type', d.plant_type,
  'plant_height', d.plant_height,
  'quality_group', d.quality_group,
  'vbn_code', d.vbn_code,
  'pieces_per_tray', d.pieces_per_tray,
  'floriday_trade_item_id', d.floriday_trade_item_id,
  'floriday_batch_id', d.floriday_batch_id
))
FROM public.product_plant_details d
WHERE d.product_id = p.id;

-- Step 2: Insert default field settings for the migrated plant fields (applies to "levend")
INSERT INTO public.product_field_settings (field_key, field_label, field_type, is_active, is_custom, sort_order, applies_to)
VALUES
  ('pot_size',       'Potmaat',        'text', true, false, 10, 'levend'),
  ('color',          'Kleur',          'text', true, false, 11, 'levend'),
  ('shade',          'Tint',           'text', true, false, 12, 'levend'),
  ('full_color',     'Volle kleur',    'text', true, false, 13, 'levend'),
  ('plant_type',     'Plantsoort',     'text', true, false, 14, 'levend'),
  ('plant_height',   'Planthoogte',    'text', true, false, 15, 'levend'),
  ('quality_group',  'Kwaliteitsgroep','text', true, false, 16, 'levend'),
  ('vbn_code',       'VBN Code',       'text', true, false, 17, 'levend'),
  ('pieces_per_tray','Stuks per tray', 'number', true, false, 18, 'levend')
ON CONFLICT DO NOTHING;

-- Step 3: Drop the product_plant_details table
DROP TABLE IF EXISTS public.product_plant_details;
