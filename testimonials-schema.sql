-- ========================================
-- NovaTix.iD Testimonials Schema
-- Jalankan SQL ini di Supabase SQL Editor
-- ========================================

-- 1. Buat tabel testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  rating INT DEFAULT 5,
  is_visible BOOLEAN DEFAULT true,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public read access
CREATE POLICY "Public can view testimonials"
  ON testimonials
  FOR SELECT
  USING (true);

-- 4. Policy: Authenticated users can insert
CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Policy: Authenticated users can update
CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Policy: Authenticated users can delete
CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- 7. Trigger for updated_at (reusing function from portfolios)
CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
