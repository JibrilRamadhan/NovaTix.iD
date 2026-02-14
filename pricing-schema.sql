-- ========================================
-- PRICING PACKAGES SCHEMA
-- ========================================

-- 1. Create table pricing_packages
CREATE TABLE IF NOT EXISTS pricing_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT DEFAULT '/project',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Public read
CREATE POLICY "Public can view pricing"
  ON pricing_packages FOR SELECT
  USING (true);

-- Auth insert
CREATE POLICY "Auth can insert pricing"
  ON pricing_packages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Auth update
CREATE POLICY "Auth can update pricing"
  ON pricing_packages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auth delete
CREATE POLICY "Auth can delete pricing"
  ON pricing_packages FOR DELETE
  TO authenticated
  USING (true);

-- 4. Trigger for updated_at
CREATE TRIGGER set_pricing_updated_at
  BEFORE UPDATE ON pricing_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
