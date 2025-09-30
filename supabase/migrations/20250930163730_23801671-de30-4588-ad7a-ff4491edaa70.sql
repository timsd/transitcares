-- Promote Timothy Olodude to Admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('c12c150a-86ac-4acc-9763-cc8331c0e1b4', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;