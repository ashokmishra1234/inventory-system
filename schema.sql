-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'viewer');
CREATE TYPE log_action AS ENUM ('add', 'remove', 'update');
CREATE TYPE log_source AS ENUM ('web', 'desktop', 'ai', 'api');

-- Create Users Table (Public Profile)
-- Note: This is separate from auth.users but linked logically
CREATE TABLE public.users (
  id UUID PRIMARY KEY, -- Should match auth.users id if possible, or be auto-generated
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - best practice for Supabase
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Products Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Inventory Logs Table
CREATE TABLE public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  action log_action NOT NULL,
  quantity INTEGER NOT NULL,
  source log_source NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Policies (Basic examples - adjust as needed for strict security)
-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to authenticated users" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.inventory_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.users FOR SELECT TO authenticated USING (true);

-- Allow write access only to admin/manager (Conceptually handled by backend role check, but RLS adds depth)
-- For this backend system using a Service Role key might bypass RLS, but standard JWT access respects it.
