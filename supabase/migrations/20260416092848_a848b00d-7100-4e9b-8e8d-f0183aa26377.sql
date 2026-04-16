
-- Add custom_fields JSONB column to products table
ALTER TABLE public.products
ADD COLUMN custom_fields jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Add GIN index for efficient JSONB queries
CREATE INDEX idx_products_custom_fields ON public.products USING GIN (custom_fields);
