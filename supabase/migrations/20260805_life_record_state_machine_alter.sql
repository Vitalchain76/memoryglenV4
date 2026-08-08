-- Migration: Extend Existing Life Records Schema for LivingGlen & Safe Public Privacy
-- Builds additively on 20260804_06_trustee_consensus.sql.
-- Uses the REAL existing column names: owner_id, status (NOT user_id / state enum).
-- Idempotent: safe to re-run.

-- 1. Add missing LivingGlen flags to the existing public.life_records table.
ALTER TABLE public.life_records
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS domain_origin TEXT NOT NULL DEFAULT 'livingglen.com';

-- 2. Add a scoped public-read policy using the real column names (owner_id, status).
--    NOTE: This is ADDITIVE. See PR description re: pre-existing life_records_select
--    policy and PostgreSQL permissive-policy OR evaluation.
DROP POLICY IF EXISTS "public_read_select" ON public.life_records;

CREATE POLICY "public_read_select" ON public.life_records
  FOR SELECT TO public
  USING (
    status = 'MEMORIAL'
    OR (status = 'ACTIVE' AND is_public = true AND domain_origin = 'livingglen.com')
  );

-- 3. Safe public view: exposes only non-sensitive columns (excludes location).
CREATE OR REPLACE VIEW public.public_life_records AS
SELECT
  id,
  owner_id,
  full_name,
  avatar_url,
  bio,
  domain_origin,
  status,
  is_public,
  created_at
FROM public.life_records
WHERE status = 'MEMORIAL'
  OR (status = 'ACTIVE' AND is_public = true AND domain_origin = 'livingglen.com');
