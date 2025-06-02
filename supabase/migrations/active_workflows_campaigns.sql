-- Active Workflows Table
CREATE TABLE IF NOT EXISTS public.active_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  automation_id INTEGER NOT NULL,
  automation_name TEXT NOT NULL,
  automation_title TEXT,
  message_content TEXT,
  action_type TEXT,
  action_config JSONB,
  source TEXT, -- e.g., 'Facebook', 'Website', 'Manual'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Add RLS policy
  CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE
);

-- Add RLS policies for active_workflows
ALTER TABLE public.active_workflows ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access for authenticated users" 
  ON public.active_workflows
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow insert for service role and authenticated users
CREATE POLICY "Allow insert for authenticated users" 
  ON public.active_workflows
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow update for service role and authenticated users
CREATE POLICY "Allow update for authenticated users" 
  ON public.active_workflows
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

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

-- Allow read access to authenticated users
CREATE POLICY "Allow read access for authenticated users" 
  ON public.active_campaigns
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow insert for service role and authenticated users
CREATE POLICY "Allow insert for authenticated users" 
  ON public.active_campaigns
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow update for service role and authenticated users
CREATE POLICY "Allow update for authenticated users" 
  ON public.active_campaigns
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

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

-- Create triggers for both tables
CREATE TRIGGER set_updated_at_active_workflows
BEFORE UPDATE ON public.active_workflows
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_active_campaigns
BEFORE UPDATE ON public.active_campaigns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
