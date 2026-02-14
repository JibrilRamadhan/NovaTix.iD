-- FIX: Ensure no NULL values in boolean columns
UPDATE portfolios SET is_featured = false WHERE is_featured IS NULL;
UPDATE portfolios SET is_visible = true WHERE is_visible IS NULL;
UPDATE portfolios SET display_order = 0 WHERE display_order IS NULL;
UPDATE portfolios SET image_position = 'center center' WHERE image_position IS NULL;

-- Verify policies again
DROP POLICY IF EXISTS "Public can view portfolios" ON portfolios;
CREATE POLICY "Public can view portfolios" ON portfolios FOR SELECT USING (true);
