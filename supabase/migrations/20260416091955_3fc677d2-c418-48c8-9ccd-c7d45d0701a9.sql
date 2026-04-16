
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read purchase_orders" ON public.purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert purchase_orders" ON public.purchase_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update purchase_orders" ON public.purchase_orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete purchase_orders" ON public.purchase_orders FOR DELETE TO authenticated USING (true);

ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read purchase_order_items" ON public.purchase_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert purchase_order_items" ON public.purchase_order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update purchase_order_items" ON public.purchase_order_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete purchase_order_items" ON public.purchase_order_items FOR DELETE TO authenticated USING (true);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert suppliers" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete suppliers" ON public.suppliers FOR DELETE TO authenticated USING (true);

ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read supplier_products" ON public.supplier_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert supplier_products" ON public.supplier_products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update supplier_products" ON public.supplier_products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete supplier_products" ON public.supplier_products FOR DELETE TO authenticated USING (true);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
