-- Phase 3: Billing & Transactions

-- 1. Create Transactions Table
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  retailer_id uuid references retailers(id) not null,
  
  -- Payment Details
  total_amount decimal(10,2) not null,
  payment_mode text check (payment_mode in ('cash', 'online')) not null,
  status text check (status in ('pending', 'completed', 'failed')) default 'pending',
  
  -- Razorpay Specifics (Nullable, only for online)
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  
  -- Offline/Manager Approval Specifics (Nullable, only for cash)
  approved_by uuid references auth.users(id), 
  
  -- Item Snapshot
  -- We store a SNAPSHOT of the items at the time of sale (price might change later)
  -- Structure: [{"id": "...", "name": "Dettol", "qty": 2, "price": 50}]
  items jsonb not null, 
  
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security (RLS)
alter table transactions enable row level security;

-- Retailers can view their own transactions
create policy "Retailers view own transactions" on transactions
  for select using (auth.uid() = retailer_id);

-- Retailers can insert their own transactions
create policy "Retailers insert own transactions" on transactions
  for insert with check (auth.uid() = retailer_id);
