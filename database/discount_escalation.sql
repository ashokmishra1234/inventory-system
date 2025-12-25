-- Create the discount_escalations table
CREATE TABLE IF NOT EXISTS discount_escalations (
    escalation_id TEXT PRIMARY KEY,
    product_id UUID, -- Can be null if generic, but usually linked
    product_name TEXT NOT NULL,
    requested_discount INTEGER NOT NULL,
    allowed_discount INTEGER NOT NULL,
    retailer_id UUID NOT NULL,
    status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE discount_escalations ENABLE ROW LEVEL SECURITY;

-- Policy: Retailers can see their own escalations
CREATE POLICY "Retailers can view own escalations" 
ON discount_escalations FOR SELECT 
USING (auth.uid() = retailer_id);

-- Policy: Retailers can insert their own escalations
CREATE POLICY "System can insert escalations" 
ON discount_escalations FOR INSERT 
WITH CHECK (auth.uid() = retailer_id);
