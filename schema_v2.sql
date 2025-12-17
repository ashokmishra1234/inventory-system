-- Phase 2: Multi-Tenant Architecture Migration

-- 1. Create Retailers Table
-- This links the Auth User to a specific "Shop".
create table retailers (
  id uuid primary key references auth.users(id),
  shop_name text,
  created_at timestamptz default now()
);

-- 2. Create Master Catalog (Common DB)
-- Shared across all retailers. Read-only for retailers, Writable by Admins.
create table master_catalog (
  id uuid primary key default uuid_generate_v4(),
  sku text unique not null,
  name text not null,
  category text,
  wholesaler_info jsonb, -- e.g., {"name": "Global Supplies", "contact": "555-0199"}
  standard_price decimal(10,2),
  created_at timestamptz default now()
);

-- 3. Create Retailer Inventory (Private DB)
-- Specific to each retailer. Replaces the old 'products' table concept.
create table retailer_inventory (
  id uuid primary key default uuid_generate_v4(),
  retailer_id uuid references retailers(id) not null,
  catalog_item_id uuid references master_catalog(id), -- Optional link to master
  custom_name text, -- Retailer can rename the item locally
  sku text, -- Retailer might have their own SKU or copy Master
  quantity int default 0,
  price decimal(10,2),
  low_stock_threshold int default 5,
  discount_rules jsonb, -- e.g., {"max_percent": 10, "approval_required": true}
  location text,
  created_at timestamptz default now()
);

-- 4. Enable Row Level Security (RLS)

-- Retailers
alter table retailers enable row level security;
create policy "Retailers can see own profile" on retailers
  for select using (auth.uid() = id);
create policy "Retailers can update own profile" on retailers
  for update using (auth.uid() = id);

-- Master Catalog
alter table master_catalog enable row level security;
create policy "Authenticated users can read catalog" on master_catalog
  for select using (auth.role() = 'authenticated');
-- Only service_role (backend) or specific admins can insert/update master_catalog

-- Retailer Inventory
alter table retailer_inventory enable row level security;
create policy "Retailers view own inventory" on retailer_inventory
  for select using (auth.uid() = retailer_id);
create policy "Retailers insert own inventory" on retailer_inventory
  for insert with check (auth.uid() = retailer_id);
create policy "Retailers update own inventory" on retailer_inventory
  for update using (auth.uid() = retailer_id);
create policy "Retailers delete own inventory" on retailer_inventory
  for delete using (auth.uid() = retailer_id);

-- 5. Data Migration (Optional - Run if preserving data)
-- This copies existing 'products' into 'retailer_inventory' assuming current user owns them.
-- Warning: This is tricky in SQL without user context. Ideally done via script.
-- For now, we leave the tables side-by-side or you can drop 'products' later.
