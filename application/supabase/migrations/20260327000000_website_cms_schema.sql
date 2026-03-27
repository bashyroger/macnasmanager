-- Migration: Website CMS Schema
-- Created: 2026-03-27

CREATE TABLE IF NOT EXISTS public.website_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    body_json JSONB NOT NULL DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;

-- Public read access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access for website_pages') THEN
        CREATE POLICY "Public read access for website_pages" ON public.website_pages
            FOR SELECT USING (is_published = true);
    END IF;
END $$;

-- Admin full access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access for website_pages') THEN
        CREATE POLICY "Admin full access for website_pages" ON public.website_pages
            FOR ALL USING (
                auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner_admin')
            );
    END IF;
END $$;
