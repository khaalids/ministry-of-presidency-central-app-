-- Ministries Management System
-- This migration creates a ministries table for managing ministries

-- Create ministries table
CREATE TABLE IF NOT EXISTS public.ministries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    code TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ministries
CREATE INDEX IF NOT EXISTS idx_ministries_name ON public.ministries(name);
CREATE INDEX IF NOT EXISTS idx_ministries_code ON public.ministries(code);
CREATE INDEX IF NOT EXISTS idx_ministries_is_active ON public.ministries(is_active);

-- Enable RLS
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ministries
-- Everyone can read active ministries
CREATE POLICY "authenticated_users_can_read_ministries"
ON public.ministries
FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage ministries
CREATE POLICY "admin_can_manage_ministries"
ON public.ministries
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_ministries_updated_at
    BEFORE UPDATE ON public.ministries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

