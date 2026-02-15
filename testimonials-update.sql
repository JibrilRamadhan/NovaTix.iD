-- ========================================
-- Migration: Add portfolio_id to testimonials
-- Run this in Supabase SQL Editor
-- ========================================

ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL;
