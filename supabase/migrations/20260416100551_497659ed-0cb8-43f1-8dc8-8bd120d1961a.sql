-- Add active_per_category jsonb column
ALTER TABLE public.product_field_settings
ADD COLUMN active_per_category jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Populate from current is_active + applies_to logic
-- Fields with applies_to = 'beide' get active for all existing categories
UPDATE public.product_field_settings
SET active_per_category = (
  SELECT jsonb_object_agg(pc.slug, product_field_settings.is_active)
  FROM public.product_categories pc
  WHERE product_field_settings.applies_to = 'beide'
     OR product_field_settings.applies_to = pc.slug
)
WHERE EXISTS (
  SELECT 1 FROM public.product_categories pc
  WHERE product_field_settings.applies_to = 'beide'
     OR product_field_settings.applies_to = pc.slug
);