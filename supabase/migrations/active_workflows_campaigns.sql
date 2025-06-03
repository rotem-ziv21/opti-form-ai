-- Active Workflows Table
CREATE TABLE IF NOT EXISTS public.active_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  automation_id INTEGER NOT NULL,
  automation_name TEXT NOT NULL,
  automation_title TEXT,
  automation_type TEXT, -- e.g., 'facebook', 'tiktok', 'website', 'whatsapp', etc.
  message_content TEXT,
  action_type TEXT, -- e.g., 'send_message', 'schedule_meeting', etc.
  action_config JSONB,
  source TEXT, -- e.g., 'Facebook', 'Website', 'Manual'
  trigger_type TEXT, -- e.g., 'new_lead', 'meeting_confirmed', 'deal_closed', 'time_based'
  trigger_config JSONB, -- Additional configuration for triggers
  schedule_type TEXT, -- e.g., 'immediate', 'delayed', 'recurring'
  schedule_config JSONB, -- Configuration for scheduling (delay time, recurrence pattern)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Add RLS policy
  CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE
);

-- Add RLS policies for active_workflows
ALTER TABLE public.active_workflows ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_workflows' 
    AND policyname = 'Allow read access for authenticated users'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow read access for authenticated users" 
      ON public.active_workflows
      FOR SELECT 
      USING (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Allow insert for service role and authenticated users (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_workflows' 
    AND policyname = 'Allow insert for authenticated users'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow insert for authenticated users" 
      ON public.active_workflows
      FOR INSERT
      WITH CHECK (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Allow update for service role and authenticated users (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_workflows' 
    AND policyname = 'Allow update for authenticated users'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow update for authenticated users" 
      ON public.active_workflows
      FOR UPDATE
      USING (auth.role() = ''authenticated'')
      WITH CHECK (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Allow delete for service role and authenticated users (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_workflows' 
    AND policyname = 'Allow delete for authenticated users'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow delete for authenticated users" 
      ON public.active_workflows
      FOR DELETE
      USING (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Active Campaigns Table
CREATE TABLE IF NOT EXISTS public.active_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  facebook_active BOOLEAN DEFAULT FALSE,
  tiktok_active BOOLEAN DEFAULT FALSE,
  instagram_active BOOLEAN DEFAULT FALSE,
  google_active BOOLEAN DEFAULT FALSE,
  website_active BOOLEAN DEFAULT FALSE,
  email_active BOOLEAN DEFAULT FALSE,
  sms_active BOOLEAN DEFAULT FALSE,
  whatsapp_active BOOLEAN DEFAULT FALSE,
  other_campaigns JSONB, -- For additional campaign types
  settings JSONB, -- For campaign-specific settings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Add RLS policy
  CONSTRAINT fk_client_campaign FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE
);

-- Add RLS policies for active_campaigns
ALTER TABLE public.active_campaigns ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_campaigns' 
    AND policyname = 'Allow read access for authenticated users'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow read access for authenticated users" 
      ON public.active_campaigns
      FOR SELECT 
      USING (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Allow insert for service role and authenticated users (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_campaigns' 
    AND policyname = 'Allow insert for authenticated users'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow insert for authenticated users" 
      ON public.active_campaigns
      FOR INSERT
      WITH CHECK (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Allow update for service role and authenticated users (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_campaigns' 
    AND policyname = 'Allow update for authenticated users'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow update for authenticated users" 
      ON public.active_campaigns
      FOR UPDATE
      USING (auth.role() = ''authenticated'')
      WITH CHECK (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Allow delete for service role and authenticated users (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'active_campaigns' 
    AND policyname = 'Allow delete for authenticated users'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow delete for authenticated users" 
      ON public.active_campaigns
      FOR DELETE
      USING (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_active_workflows_client_id ON public.active_workflows(client_id);
CREATE INDEX IF NOT EXISTS idx_active_workflows_automation_id ON public.active_workflows(automation_id);
CREATE INDEX IF NOT EXISTS idx_active_campaigns_client_id ON public.active_campaigns(client_id);

-- Create trigger function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_updated_at_active_workflows'
  ) THEN
    EXECUTE 'CREATE TRIGGER set_updated_at_active_workflows
      BEFORE UPDATE ON public.active_workflows
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_updated_at_active_campaigns'
  ) THEN
    EXECUTE 'CREATE TRIGGER set_updated_at_active_campaigns
      BEFORE UPDATE ON public.active_campaigns
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()';
  END IF;
END $$;
