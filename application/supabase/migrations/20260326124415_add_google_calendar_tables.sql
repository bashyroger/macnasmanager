-- Migration for Google Calendar tables

--
-- Name: google_tokens; Type: TABLE; Schema: public;
--
CREATE TABLE public.google_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    access_token text,
    refresh_token text NOT NULL,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE ONLY public.google_tokens
    ADD CONSTRAINT google_tokens_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.google_tokens
    ADD CONSTRAINT google_tokens_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.google_tokens
    ADD CONSTRAINT google_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.google_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for google_tokens
-- Only the user who owns the token can see/update it, or an admin
CREATE POLICY "Users can view their own tokens" ON public.google_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tokens" ON public.google_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tokens" ON public.google_tokens FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tokens" ON public.google_tokens FOR DELETE USING (auth.uid() = user_id);

--
-- Name: sync_runs; Type: TABLE; Schema: public;
--
CREATE TABLE public.sync_runs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_type text NOT NULL, -- 'import' | 'export'
    status text NOT NULL, -- 'running' | 'success' | 'failure'
    records_processed integer DEFAULT 0,
    error_details text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone
);

ALTER TABLE ONLY public.sync_runs
    ADD CONSTRAINT sync_runs_pkey PRIMARY KEY (id);

-- Enable RLS
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;

-- Policies for sync_runs (Admins only normally, but we can allow authenticated reading)
CREATE POLICY "Authenticated users can view sync runs" ON public.sync_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role can insert sync runs" ON public.sync_runs FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update sync runs" ON public.sync_runs FOR UPDATE TO service_role USING (true);

-- Trigger for updated_at on google_tokens
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.google_tokens FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

-- Add google_event_id to time_entries to avoid duplicates during sync
ALTER TABLE public.time_entries ADD COLUMN google_event_id text;
ALTER TABLE public.time_entries ADD CONSTRAINT time_entries_google_event_id_key UNIQUE (google_event_id);
