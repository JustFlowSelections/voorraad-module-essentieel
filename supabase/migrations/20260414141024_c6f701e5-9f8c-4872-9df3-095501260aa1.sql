-- Create profile for the user
INSERT INTO public.profiles (id, email, display_name)
VALUES ('08ffbb76-5d8d-4804-8f76-baadd7b15ce1', 'info@flowselections.com', 'Flow Selections')
ON CONFLICT (id) DO NOTHING;

-- Create a default tenant
INSERT INTO public.tenants (id, company_name, status)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Flow Selections', 'active')
ON CONFLICT (id) DO NOTHING;

-- Link user to tenant
INSERT INTO public.tenant_users (tenant_id, user_id)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '08ffbb76-5d8d-4804-8f76-baadd7b15ce1')
ON CONFLICT DO NOTHING;

-- Give user admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('08ffbb76-5d8d-4804-8f76-baadd7b15ce1', 'admin')
ON CONFLICT DO NOTHING;
