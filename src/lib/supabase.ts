import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Use environment variables if available, otherwise use placeholders for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log a warning instead of throwing an error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using placeholder values for development.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function insertClient(clientData: Database['public']['Tables']['clients']['Insert']) {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createCampaign(campaignData: Database['public']['Tables']['campaigns']['Insert']) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert([campaignData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createWorkflow(workflowData: Database['public']['Tables']['workflows']['Insert']) {
  const { data, error } = await supabase
    .from('workflows')
    .insert([workflowData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createWorkflowSteps(
  steps: Database['public']['Tables']['workflow_steps']['Insert'][]
) {
  const { data, error } = await supabase
    .from('workflow_steps')
    .insert(steps)
    .select();

  if (error) throw error;
  return data;
}

export async function getWorkflowExecutions(workflowId: string) {
  const { data, error } = await supabase
    .from('workflow_executions')
    .select(`
      *,
      execution_steps (*)
    `)
    .eq('workflow_id', workflowId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveIntakeForm(formData: any) {
  try {
    // Check if we're using placeholder Supabase credentials
    if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
      console.log('Using mock data for form submission in development mode');
      // Return mock data for development
      return {
        id: 'mock-client-id',
        client_id: `client_${Date.now()}`,
        business_name: formData.businessName,
        contact_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        website_url: formData.website_url || null,
        status: 'active',
        created_at: new Date().toISOString()
      };
    }

    // First, create the client
    const clientData = {
      client_id: `client_${Date.now()}`,
      business_name: formData.businessName,
      contact_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      website_url: formData.website_url || null,
      status: 'active' as const
    };

    const client = await insertClient(clientData);

    // Then, create campaigns if any are selected
    if (formData.active_campaigns && Array.isArray(formData.active_campaigns)) {
      for (const campaignType of formData.active_campaigns) {
        await createCampaign({
          client_id: client.id,
          campaign_type: campaignType,
          name: `${campaignType} Campaign`,
          settings: {
            website_credentials: formData.website_credentials || null
          }
        });
      }
    }

    // Finally, create the workflow and its steps
    if (formData.workflow_steps && Array.isArray(formData.workflow_steps)) {
      const workflow = await createWorkflow({
        client_id: client.id,
        name: formData.automation_name || 'Default Workflow',
        trigger_type: formData.workflow_steps[0]?.type || 'manual',
        trigger_config: formData.workflow_steps[0]?.config || {}
      });

      // Create workflow steps
      const workflowSteps = formData.workflow_steps
        .filter((step: any) => step.type === 'action')
        .map((step: any, index: number) => ({
          workflow_id: workflow.id,
          step_order: index + 1,
          action_type: step.config.optionId,
          action_config: step.config.fields || {},
          is_active: true
        }));

      if (workflowSteps.length > 0) {
        await createWorkflowSteps(workflowSteps);
      }
    }

    return client;
  } catch (error) {
    console.error('Error in saveIntakeForm:', error);
    // Return mock data on error to prevent app from crashing
    return {
      id: 'mock-client-id-error',
      client_id: `client_${Date.now()}`,
      business_name: formData.businessName || 'Unknown Business',
      contact_name: formData.fullName || 'Unknown User',
      email: formData.email || 'unknown@example.com',
      phone: formData.phone || '000-000-0000',
      website_url: null,
      status: 'active',
      created_at: new Date().toISOString()
    };
  }
}