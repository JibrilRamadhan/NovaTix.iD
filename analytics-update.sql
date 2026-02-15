-- ========================================
-- ANALYTICS UPDATE SCHEMA
-- Run this in Supabase SQL Editor
-- ========================================

-- Add new columns if they don't exist
ALTER TABLE analytics_visits ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE analytics_visits ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE analytics_visits ADD COLUMN IF NOT EXISTS session_duration_seconds INTEGER;
ALTER TABLE analytics_visits ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE analytics_visits ADD COLUMN IF NOT EXISTS scroll_depth_percent INTEGER;

-- Update the policies to allow update (for exit tracking)
-- Allow public to update their own visit (using the returned ID)
CREATE POLICY "Public can update visits"
  ON analytics_visits FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
