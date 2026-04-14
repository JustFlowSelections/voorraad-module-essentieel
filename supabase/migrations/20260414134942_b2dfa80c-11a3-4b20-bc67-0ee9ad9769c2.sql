
-- inventory_settings: read + update for authenticated
CREATE POLICY "Authenticated users can read inventory_settings"
  ON public.inventory_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert inventory_settings"
  ON public.inventory_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update inventory_settings"
  ON public.inventory_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- product_field_settings: read for authenticated
CREATE POLICY "Authenticated users can read product_field_settings"
  ON public.product_field_settings FOR SELECT TO authenticated USING (true);

-- product_field_options: read for authenticated
CREATE POLICY "Authenticated users can read product_field_options"
  ON public.product_field_options FOR SELECT TO authenticated USING (true);

-- orders: read for authenticated
CREATE POLICY "Authenticated users can read orders"
  ON public.orders FOR SELECT TO authenticated USING (true);

-- order_items: read for authenticated
CREATE POLICY "Authenticated users can read order_items"
  ON public.order_items FOR SELECT TO authenticated USING (true);

-- plant_groups: read for authenticated
CREATE POLICY "Authenticated users can read plant_groups"
  ON public.plant_groups FOR SELECT TO authenticated USING (true);

-- plant_group_members: read for authenticated
CREATE POLICY "Authenticated users can read plant_group_members"
  ON public.plant_group_members FOR SELECT TO authenticated USING (true);

-- product_compositions: read for authenticated
CREATE POLICY "Authenticated users can read product_compositions"
  ON public.product_compositions FOR SELECT TO authenticated USING (true);

-- tenant_modules: read for authenticated
CREATE POLICY "Authenticated users can read tenant_modules"
  ON public.tenant_modules FOR SELECT TO authenticated USING (true);

-- tenant_integrations: read for authenticated
CREATE POLICY "Authenticated users can read tenant_integrations"
  ON public.tenant_integrations FOR SELECT TO authenticated USING (true);

-- audit_logs: insert + read for authenticated
CREATE POLICY "Authenticated users can read audit_logs"
  ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert audit_logs"
  ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- user_tab_permissions: read own permissions
CREATE POLICY "Authenticated users can read user_tab_permissions"
  ON public.user_tab_permissions FOR SELECT TO authenticated USING (true);
