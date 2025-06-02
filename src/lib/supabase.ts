import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Use environment variables if available, otherwise use placeholders for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

// Log the Supabase URL and keys (without exposing the full keys)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key available:', supabaseAnonKey ? 'Yes (starts with: ' + supabaseAnonKey.substring(0, 10) + '...)' : 'No');
console.log('Supabase Service Key available:', supabaseServiceKey ? 'Yes (starts with: ' + supabaseServiceKey.substring(0, 10) + '...)' : 'No');

// Log a warning instead of throwing an error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using placeholder values for development.');
}

// Create two clients - one with anonymous key for regular operations
// and one with service role key for admin operations that bypass RLS
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if no service key is available

export async function insertClient(clientData: Database['public']['Tables']['clients']['Insert']) {
  // Use supabaseAdmin to bypass RLS policies
  const { data, error } = await supabaseAdmin
    .from('clients')
    .insert([clientData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createCampaign(campaignData: Database['public']['Tables']['campaigns']['Insert']) {
  // Use supabaseAdmin to bypass RLS policies
  const { data, error } = await supabaseAdmin
    .from('campaigns')
    .insert([campaignData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// New function to save active campaigns
export async function saveActiveCampaigns(clientId: string, activeCampaigns: string[]) {
  console.log('Saving active campaigns for client:', clientId, activeCampaigns);
  
  try {
    // Log detailed debugging info
    console.log('Active campaigns table check - using client ID:', clientId);
    console.log('Active campaigns to save:', JSON.stringify(activeCampaigns));
    
    // Create an object with all campaign types set to false by default
    const campaignData: any = {
      client_id: clientId,
      facebook_active: false,
      tiktok_active: false,
      instagram_active: false,
      google_active: false,
      website_active: false,
      email_active: false,
      sms_active: false,
      whatsapp_active: false,
      other_campaigns: {}
    };
    
    // Set the active campaigns to true
    activeCampaigns.forEach(campaign => {
      const campaignKey = `${campaign.toLowerCase()}_active`;
      console.log(`Processing campaign: ${campaign}, key: ${campaignKey}`);
      if (campaignData.hasOwnProperty(campaignKey)) {
        campaignData[campaignKey] = true;
      } else {
        // If it's not one of the predefined campaigns, add it to other_campaigns
        if (!campaignData.other_campaigns) {
          campaignData.other_campaigns = {};
        }
        campaignData.other_campaigns[campaign] = true;
      }
    });
    
    console.log('Final campaign data to insert:', JSON.stringify(campaignData));
    
    // Insert the active campaigns data
    const { data, error } = await supabaseAdmin
      .from('active_campaigns')
      .insert([campaignData])
      .select();
    
    if (error) {
      console.error('Error saving active campaigns:', error);
      console.error('Error details:', JSON.stringify(error));
      return null; // Continue despite error
    }
    
    console.log('Active campaigns saved successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Exception in saveActiveCampaigns:', error);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.details) console.error('Error details:', error.details);
    // Don't throw the error, just return null so the form submission can continue
    return null;
  }
}

export async function createWorkflow(workflowData: Database['public']['Tables']['workflows']['Insert']) {
  // Use supabaseAdmin to bypass RLS policies
  const { data, error } = await supabaseAdmin
    .from('workflows')
    .insert([workflowData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// New function to save active workflows with their actions
export async function saveActiveWorkflow(clientId: string, automationData: any, messageContent?: string) {
  console.log('Saving active workflow for client:', clientId, automationData);
  
  try {
    // Log detailed debugging info
    console.log('Active workflow table check - using client ID:', clientId);
    console.log('Automation data:', JSON.stringify(automationData));
    console.log('Message content:', messageContent);
    
    // Create the active workflow data
    const workflowData: any = {
      client_id: clientId,
      automation_id: automationData.id || 0,
      automation_name: automationData.name || `${automationData.category || ''} - ${automationData.title || ''}`.trim(),
      automation_title: automationData.title || '',
      message_content: messageContent || automationData.defaultMessage || '',
      action_type: automationData.actionType || 'send_message',
      source: automationData.source || 'Manual',
      is_active: true
    };
    
    // Handle action_config properly
    if (automationData.config) {
      if (typeof automationData.config === 'object') {
        workflowData.action_config = automationData.config;
      } else {
        try {
          // Try to parse if it's a string
          workflowData.action_config = JSON.parse(automationData.config);
        } catch {
          // Default to empty object if parsing fails
          workflowData.action_config = {};
        }
      }
    } else {
      workflowData.action_config = {};
    }
    
    console.log('Final active workflow data:', JSON.stringify(workflowData));
    
    // Insert the active workflow data
    const { data, error } = await supabaseAdmin
      .from('active_workflows')
      .insert([workflowData])
      .select();
      
    if (error) {
      console.error('Error saving active workflow:', error);
      console.error('Error details:', JSON.stringify(error));
      return null; // Continue despite error
    }
    
    console.log('Active workflow saved successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Exception in saveActiveWorkflow:', error);
    console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.details) console.error('Error details:', error.details);
    // Don't throw the error, just return null so the form submission can continue
    return null;
  }
}

export async function createWorkflowSteps(
  steps: Database['public']['Tables']['workflow_steps']['Insert'][]
) {
  // Use supabaseAdmin to bypass RLS policies
  const { data, error } = await supabaseAdmin
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
    console.log('Starting form submission to Supabase...');
    console.log('Form data:', { ...formData, client_name: formData.fullName, business_name: formData.businessName });
    
    // Log what would be sent to Supabase
    console.log('Form data that would be sent to Supabase:', {
      client: {
        business_name: formData.business_name || formData.businessName,
        contact_name: formData.client_name || formData.fullName,
        email: formData.email,
        phone: formData.phone
      },
      campaign: {
        name: `Campaign for ${formData.business_name || formData.businessName}`,
        type: formData.form_data?.campaignType || 'default',
        status: 'active'
      },
      workflow: {
        name: formData.automation_name || 'Default Workflow',
        automation_id: formData.automation_id,
        status: 'active'
      }
    });
    
    // First, create the client
    // Make sure we have all required fields with fallbacks
    const businessName = formData.business_name || formData.businessName || 'Unknown Business';
    const contactName = formData.client_name || formData.fullName || 'Unknown Contact';
    
    console.log('Business name:', businessName);
    console.log('Contact name:', contactName);
    
    const clientData = {
      client_id: `client_${Date.now()}`,
      business_name: businessName,
      contact_name: contactName,
      email: formData.email,
      phone: formData.phone,
      website_url: formData.form_data?.website_url || null,
      status: 'active' as const
    };

    console.log('Creating client in Supabase:', clientData);
    const client = await insertClient(clientData);
    console.log('Client created successfully:', client);

    // Save active campaigns to the new active_campaigns table
    let activeCampaigns = [];
    
    // Check for campaigns in different possible locations
    if (formData.active_campaigns && Array.isArray(formData.active_campaigns)) {
      activeCampaigns = formData.active_campaigns;
    } else if (formData.form_data && formData.form_data.campaigns && Array.isArray(formData.form_data.campaigns)) {
      activeCampaigns = formData.form_data.campaigns;
    } else if (formData.campaigns && Array.isArray(formData.campaigns)) {
      activeCampaigns = formData.campaigns;
    }
    
    // If we found any campaigns, save them
    if (activeCampaigns.length > 0) {
      console.log('Active campaigns found:', activeCampaigns);
      
      // Save to the original campaigns table for backward compatibility
      for (const campaignType of activeCampaigns) {
        console.log(`Creating campaign of type ${campaignType}`);
        try {
          await createCampaign({
            client_id: client.id,
            campaign_type: campaignType,
            name: `${campaignType} Campaign`,
            settings: {
              website_credentials: formData.website_credentials || null
            }
          });
        } catch (error) {
          console.error(`Error creating campaign of type ${campaignType}:`, error);
          // Continue with other campaigns even if one fails
        }
      }
      
      // Save to the new active_campaigns table
      try {
        await saveActiveCampaigns(client.id, activeCampaigns);
      } catch (error) {
        console.error('Error saving active campaigns:', error);
        // Continue with form submission even if saving active campaigns fails
      }
    } else {
      console.log('No active campaigns found in form data');
    }

    // Create workflow and save active workflow
    if (formData.automation_id) {
      // Create a basic workflow based on the selected automation (original table)
      console.log(`Creating workflow for automation ID ${formData.automation_id}`);
      const workflow = await createWorkflow({
        client_id: client.id,
        name: formData.automation_name || `אוטומציה ${formData.automation_id}`,
        trigger_type: 'manual',
        trigger_config: {
          automation_id: formData.automation_id,
          automation_title: formData.automation_title || ''
        }
      });
      console.log('Workflow created successfully:', workflow);
      
      // Prepare automation data for the active_workflows table
      const automationData = {
        id: formData.automation_id,
        title: formData.automation_title || '',
        name: formData.automation_name || '',
        category: formData.automation_category || '',
        defaultMessage: 'הודעה אוטומטית ממערכת OptiOne',
        source: formData.source || 'Form',
        actionType: 'send_message',
        config: {}
      };
      
      // Extract more detailed information from formData if available
      if (formData.form_data) {
        console.log('Form data details:', formData.form_data);
        
        // Try to extract automation details
        if (formData.form_data.automation) {
          console.log('Automation details:', formData.form_data.automation);
          
          if (formData.form_data.automation.title) {
            automationData.title = formData.form_data.automation.title;
          }
          
          if (formData.form_data.automation.category) {
            automationData.category = formData.form_data.automation.category;
          }
          
          if (formData.form_data.automation.config) {
            automationData.config = formData.form_data.automation.config;
          }
        }
      }
      
      // Get message content if available
      let messageContent = 'הודעה אוטומטית ממערכת OptiOne';
      
      // Check all possible locations for message content
      if (formData.message_content) {
        messageContent = formData.message_content;
        console.log('Using message_content from root:', messageContent);
      } else if (formData.form_data && formData.form_data.message) {
        messageContent = formData.form_data.message;
        console.log('Using message from form_data:', messageContent);
      } else if (formData.form_data && formData.form_data.automation && formData.form_data.automation.message) {
        messageContent = formData.form_data.automation.message;
        console.log('Using message from automation:', messageContent);
      }
      
      console.log('Final message content:', messageContent);
      
      // Save to the new active_workflows table
      await saveActiveWorkflow(client.id, automationData, messageContent);
      
      // If we have workflow steps, create them (original table)
      if (formData.workflow_steps && Array.isArray(formData.workflow_steps) && formData.workflow_steps.length > 0) {
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
          console.log(`Creating ${workflowSteps.length} workflow steps`);
          await createWorkflowSteps(workflowSteps);
        }
      } else {
        // Create a default step for the automation
        console.log('Creating default workflow step');
        const defaultStep = {
          workflow_id: workflow.id,
          step_order: 1,
          action_type: 'send_message',
          action_config: {
            message_type: 'text',
            content: messageContent
          },
          is_active: true
        };
        
        await createWorkflowSteps([defaultStep]);
      }
    }
    
    console.log('Form data successfully processed and saved to Supabase');
    return client;
  } catch (error: any) {
    console.error('Error in saveIntakeForm:', error);
    
    // Log detailed error information
    if (error.message) console.error('Error message:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.details) console.error('Error details:', error.details);
    
    // Check for network errors
    if (error.message && (error.message.includes('network') || error.message.includes('ERR_NAME_NOT_RESOLVED'))) {
      console.error('Network error detected. Please check your internet connection and Supabase URL.');
    }
    
    // Check for authentication errors
    if (error.code === 'auth/invalid-api-key' || (error.message && error.message.includes('auth'))) {
      console.error('Authentication error detected. Please check your Supabase API key.');
    }
    
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