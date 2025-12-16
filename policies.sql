-- Enable full access for authenticated users (since the backend validates roles)

-- Products Table Policies
CREATE POLICY "Allow insert access to authenticated users" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update access to authenticated users" ON public.products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete access to authenticated users" ON public.products FOR DELETE TO authenticated USING (true);

-- Inventory Logs Table Policies
CREATE POLICY "Allow insert access to authenticated users" ON public.inventory_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update access to authenticated users" ON public.inventory_logs FOR UPDATE TO authenticated USING (true);
