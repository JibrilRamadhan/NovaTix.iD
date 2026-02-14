-- ========================================
-- NovaTix.iD Portfolio Schema v2
-- Jalankan SQL ini di Supabase SQL Editor
-- ========================================

-- 1. Buat tabel portfolios
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  category TEXT NOT NULL DEFAULT 'Web',
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  image_position TEXT DEFAULT 'center center',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Siapa saja bisa membaca (public read)
CREATE POLICY "Public can view portfolios"
  ON portfolios
  FOR SELECT
  USING (true);

-- 4. Policy: Hanya user yang terautentikasi bisa insert
CREATE POLICY "Authenticated users can insert portfolios"
  ON portfolios
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Policy: Hanya user yang terautentikasi bisa update
CREATE POLICY "Authenticated users can update portfolios"
  ON portfolios
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Policy: Hanya user yang terautentikasi bisa delete
CREATE POLICY "Authenticated users can delete portfolios"
  ON portfolios
  FOR DELETE
  TO authenticated
  USING (true);

-- 7. Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger auto-update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- STORAGE BUCKET untuk upload gambar
-- ========================================
-- Buka Supabase Dashboard > Storage > New Bucket
-- Nama bucket: "portfolios"
-- Centang "Public bucket"
-- 
-- Lalu tambahkan policy di bucket:
-- 1. SELECT: Allow public access (semua orang bisa lihat)
-- 2. INSERT: Allow authenticated users
-- 3. UPDATE: Allow authenticated users
-- 4. DELETE: Allow authenticated users

-- ========================================
-- MIGRATION: Jika tabel sudah ada dari v1
-- Jalankan ini untuk menambah kolom baru:
-- ========================================
-- ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
-- ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
-- ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
-- ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center center';

-- ========================================
-- Setelah menjalankan SQL ini:
-- 1. Buka Authentication > Users di Supabase Dashboard
-- 2. Klik "Add User" untuk membuat akun admin
-- 3. Isi email & password
-- 4. Buka Storage > New Bucket > Buat bucket "portfolios" (public)
-- 5. Gunakan akun tersebut untuk login di website
-- ========================================
