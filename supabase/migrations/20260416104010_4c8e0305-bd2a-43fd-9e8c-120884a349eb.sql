-- Add color column to product_categories
ALTER TABLE public.product_categories
ADD COLUMN color text NOT NULL DEFAULT 'blue';

-- Set sensible defaults for existing categories
UPDATE public.product_categories SET color = 'emerald' WHERE slug = 'levend';
UPDATE public.product_categories SET color = 'amber' WHERE slug = 'dood';
UPDATE public.product_categories SET color = 'violet' WHERE slug = 'extern';