-- Add missing columns to active_workflows table
ALTER TABLE public.active_workflows 
ADD COLUMN IF NOT EXISTS automation_type TEXT,
ADD COLUMN IF NOT EXISTS trigger_type TEXT,
ADD COLUMN IF NOT EXISTS trigger_config JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS schedule_type TEXT,
ADD COLUMN IF NOT EXISTS schedule_config JSONB DEFAULT '{}'::jsonb;

-- Update any existing rows with default values
UPDATE public.active_workflows 
SET 
  automation_type = 'general',
  trigger_type = 'manual',
  trigger_config = '{}'::jsonb,
  schedule_type = 'immediate',
  schedule_config = '{}'::jsonb
WHERE 
  automation_type IS NULL OR
  trigger_type IS NULL OR
  schedule_type IS NULL;
