-- ========================================
-- ANALYTICS SCHEMA
-- ========================================

-- 1. Create table analytics_visits
CREATE TABLE IF NOT EXISTS analytics_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID NOT NULL, -- Stored in LocalStorage to identify unique devices
  ip_address TEXT,
  city TEXT,
  country TEXT,
  region TEXT,
  isp TEXT,
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  referrer TEXT, -- Where they came from
  path TEXT, -- Current page
  utm_source TEXT,
  screen_resolution TEXT,
  session_duration_seconds INTEGER,
  scroll_depth_percent INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE analytics_visits ENABLE ROW LEVEL SECURITY;

-- 3. Policies

-- Public can insert (tracking)
CREATE POLICY "Public can track visits"
  ON analytics_visits FOR INSERT
  TO public
  WITH CHECK (true);

-- Auth can view (admin dashboard)
CREATE POLICY "Auth can view visits"
  ON analytics_visits FOR SELECT
  TO authenticated
  USING (true);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON analytics_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_visits_visitor_id ON analytics_visits(visitor_id);
