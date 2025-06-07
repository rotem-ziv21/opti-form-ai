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
export async function saveActiveWorkflow(clientId: string, automationData: any, messageContent?: string, formData?: any) {
  console.log('Saving active workflow for client:', clientId);
  console.log('Automation data received:', JSON.stringify(automationData, null, 2));
  console.log('Form data received:', formData ? JSON.stringify(formData, null, 2) : 'No form data');
  
  try {
    // Log detailed debugging info
    console.log('Active workflow table check - using client ID:', clientId);
    console.log('Message content:', messageContent);
    
    // Make sure we have valid data - this is critical
    if (!automationData) {
      console.error('No automation data provided');
      return null;
    }
    
    // Create the active workflow data with safe defaults
    const workflowData: any = {
      client_id: clientId,
      automation_id: typeof automationData.id === 'number' ? automationData.id : 0,
      automation_name: '',  // Will be set properly below
      automation_title: automationData.title || 'אוטומציה',
      // New field - automation_type
      automation_type: automationData.type || automationData.source?.toLowerCase() || 'general',
      message_content: messageContent || automationData.defaultMessage || 'הודעה אוטומטית ממערכת OptiOne',
      action_type: automationData.actionType || 'send_message',
      source: automationData.source || 'Form',
      // New fields for triggers and scheduling
      trigger_type: automationData.triggerType || 'manual',
      trigger_config: automationData.triggerConfig || {},
      schedule_type: automationData.scheduleType || 'immediate',
      schedule_config: automationData.scheduleConfig || {},
      is_active: true,
      // הסרנו את שדה ה-status כי הוא לא קיים בטבלה
      action_config: {}
    };
    
    // Set automation_name properly
    if (automationData.name) {
      workflowData.automation_name = automationData.name;
    } else if (automationData.category && automationData.title) {
      workflowData.automation_name = `${automationData.category} - ${automationData.title}`;
    } else if (automationData.title) {
      workflowData.automation_name = automationData.title;
    } else {
      workflowData.automation_name = 'אוטומציה חדשה';
    }
    
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
    }
    
    // Store all form data in action_config for detailed reference
    if (formData) {
      // Create a detailed configuration object with all form inputs
      const detailedConfig = {
        ...workflowData.action_config,
        form_inputs: {}
      };
      
      // Add all message fields from the form
      if (formData.facebook_lead_message) detailedConfig.form_inputs.facebook_lead_message = formData.facebook_lead_message;
      if (formData.tiktok_lead_message) detailedConfig.form_inputs.tiktok_lead_message = formData.tiktok_lead_message;
      if (formData.website_lead_message) detailedConfig.form_inputs.website_lead_message = formData.website_lead_message;
      if (formData.whatsapp_template_message) detailedConfig.form_inputs.whatsapp_template_message = formData.whatsapp_template_message;
      if (formData.whatsapp_response_message) detailedConfig.form_inputs.whatsapp_response_message = formData.whatsapp_response_message;
      if (formData.deal_closed_message) detailedConfig.form_inputs.deal_closed_message = formData.deal_closed_message;
      if (formData.not_interested_message) detailedConfig.form_inputs.not_interested_message = formData.not_interested_message;
      if (formData.team_notification_message) detailedConfig.form_inputs.team_notification_message = formData.team_notification_message;
      if (formData.meeting_scheduled_message) detailedConfig.form_inputs.meeting_scheduled_message = formData.meeting_scheduled_message;
      if (formData.meeting_reminder_24h) detailedConfig.form_inputs.meeting_reminder_24h = formData.meeting_reminder_24h;
      if (formData.meeting_reminder_1h) detailedConfig.form_inputs.meeting_reminder_1h = formData.meeting_reminder_1h;
      
      // Add fields for new automations (Stage 4)
      // חבר מביא חבר
      if (formData.referral_message) detailedConfig.form_inputs.referral_message = formData.referral_message;
      if (formData.referral_benefit) detailedConfig.form_inputs.referral_benefit = formData.referral_benefit;
      if (formData.days_after_won) detailedConfig.form_inputs.days_after_won = formData.days_after_won;
      
      // מכירה חוזרת ללקוחות קיימים
      if (formData.repeat_sale_message) detailedConfig.form_inputs.repeat_sale_message = formData.repeat_sale_message;
      if (formData.days_after_purchase) detailedConfig.form_inputs.days_after_purchase = formData.days_after_purchase;
      
      // משוב בווצאפ לאחר שירות
      if (formData.feedback_message) detailedConfig.form_inputs.feedback_message = formData.feedback_message;
      if (formData.days_after_service) detailedConfig.form_inputs.days_after_service = formData.days_after_service;
      if (formData.google_review_message) detailedConfig.form_inputs.google_review_message = formData.google_review_message;
      
      // הסרה אוטומטית מרשימת תפוצה
      if (formData.last_chance_message) detailedConfig.form_inputs.last_chance_message = formData.last_chance_message;
      if (formData.removal_confirmation) detailedConfig.form_inputs.removal_confirmation = formData.removal_confirmation;
      if (formData.days_inactive) detailedConfig.form_inputs.days_inactive = formData.days_inactive;
      
      // בוט ביטול ואי הגעה לפגישה
      if (formData.cancellation_message) detailedConfig.form_inputs.cancellation_message = formData.cancellation_message;
      if (formData.no_show_message) detailedConfig.form_inputs.no_show_message = formData.no_show_message;
      if (formData.reschedule_message) detailedConfig.form_inputs.reschedule_message = formData.reschedule_message;
      
      // העלאת דאטה קיימת
      if (formData.welcome_message) detailedConfig.form_inputs.welcome_message = formData.welcome_message;
      if (formData.field_mapping) detailedConfig.form_inputs.field_mapping = formData.field_mapping;
      
      // לקוח לא מעוניין - שדות חדשים
      if (formData.days_to_offer) detailedConfig.form_inputs.days_to_offer = formData.days_to_offer;
      if (formData.custom_offer_message) detailedConfig.form_inputs.custom_offer_message = formData.custom_offer_message;
      
      // Add all boolean flags for enabled features
      if (formData.enable_facebook_automation !== undefined) detailedConfig.form_inputs.enable_facebook_automation = formData.enable_facebook_automation;
      if (formData.enable_tiktok_automation !== undefined) detailedConfig.form_inputs.enable_tiktok_automation = formData.enable_tiktok_automation;
      if (formData.enable_website_automation !== undefined) detailedConfig.form_inputs.enable_website_automation = formData.enable_website_automation;
      if (formData.enable_whatsapp_direct !== undefined) detailedConfig.form_inputs.enable_whatsapp_direct = formData.enable_whatsapp_direct;
      
      // Add Instagram automation fields
      if (formData.enable_instagram_automation !== undefined) detailedConfig.form_inputs.enable_instagram_automation = formData.enable_instagram_automation;
      if (formData.instagram_trigger_keywords) detailedConfig.form_inputs.instagram_trigger_keywords = formData.instagram_trigger_keywords;
      if (formData.instagram_public_reply) detailedConfig.form_inputs.instagram_public_reply = formData.instagram_public_reply;
      if (formData.instagram_private_message) detailedConfig.form_inputs.instagram_private_message = formData.instagram_private_message;
      if (formData.instagram_invalid_response_message) detailedConfig.form_inputs.instagram_invalid_response_message = formData.instagram_invalid_response_message;
      if (formData.instagram_success_response_message) detailedConfig.form_inputs.instagram_success_response_message = formData.instagram_success_response_message;
      if (formData.enable_facebook_comments_automation !== undefined) detailedConfig.form_inputs.enable_facebook_comments_automation = formData.enable_facebook_comments_automation;
      
      // Add Meeting scheduling fields
      if (formData.meeting_name) detailedConfig.form_inputs.meeting_name = formData.meeting_name;
      if (formData.meeting_representative) detailedConfig.form_inputs.meeting_representative = formData.meeting_representative;
      if (formData.meeting_available_times) detailedConfig.form_inputs.meeting_available_times = formData.meeting_available_times;
      if (formData.meeting_location) detailedConfig.form_inputs.meeting_location = formData.meeting_location;
      if (formData.meeting_duration) detailedConfig.form_inputs.meeting_duration = formData.meeting_duration;
      if (formData.no_show_message) detailedConfig.form_inputs.no_show_message = formData.no_show_message;
      if (formData.enable_ai_scheduling !== undefined) detailedConfig.form_inputs.enable_ai_scheduling = formData.enable_ai_scheduling;
      
      // Add Price quote tracking fields
      if (formData.enable_price_quote_tracking) detailedConfig.form_inputs.enable_price_quote_tracking = formData.enable_price_quote_tracking;
      if (formData.signed_quote_message) detailedConfig.form_inputs.signed_quote_message = formData.signed_quote_message;
      
      // Add Call center automation fields
      if (formData.missed_call_message) detailedConfig.form_inputs.missed_call_message = formData.missed_call_message;
      if (formData.enable_custom_hold_music !== undefined) detailedConfig.form_inputs.enable_custom_hold_music = formData.enable_custom_hold_music;
      if (formData.enable_auto_dialer) detailedConfig.form_inputs.enable_auto_dialer = formData.enable_auto_dialer;
      
      // Add Implementation notes
      if (formData.implementation_notes) detailedConfig.form_inputs.implementation_notes = formData.implementation_notes;
      
      // Add active campaigns list
      if (formData.active_campaigns) detailedConfig.form_inputs.active_campaigns = formData.active_campaigns;
      
      // Update the action_config with our detailed information
      workflowData.action_config = detailedConfig;
    }
    
    console.log('Final active workflow data to insert:', JSON.stringify(workflowData, null, 2));
    
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

// פונקציות עבור אזור המנהל
export async function getActiveWorkflows() {
  try {
    const { data, error } = await supabaseAdmin
      .from('active_workflows')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active workflows:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception in getActiveWorkflows:', error);
    return [];
  }
}

export async function getActiveWorkflowById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('active_workflows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching active workflow by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception in getActiveWorkflowById:', error);
    return null;
  }
}

export async function updateActiveWorkflowStatus(id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') {
  try {
    const { data, error } = await supabaseAdmin
      .from('active_workflows')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating active workflow status:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception in updateActiveWorkflowStatus:', error);
    return null;
  }
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
      
      // יצירת לוג מפורט של כל הנתונים שמגיעים מהטופס
      console.log('Full form data for debugging:', JSON.stringify(formData, null, 2));
      
      // הכנת נתוני האוטומציה לטבלת active_workflows
      // שימוש בנתונים מה-selectedAutomation שנשלח מה-formStore
      const automationData = {
        id: formData.automation_id,
        title: formData.automation_title || '',
        name: formData.automation_name || '',
        category: formData.automation_category || '',
        type: formData.automation_type || formData.source?.toLowerCase() || 'general',
        defaultMessage: 'הודעה אוטומטית ממערכת OptiOne',
        source: formData.source || 'Form',
        actionType: 'send_message',
        config: {},
        // שדות חדשים לטריגרים ותזמונים
        triggerType: formData.trigger_type || 'manual',
        triggerConfig: formData.trigger_config || {},
        scheduleType: formData.schedule_type || 'immediate',
        scheduleConfig: formData.schedule_config || {}
      };
      
      // הוספת לוג לבדיקת נתוני האוטומציה הבסיסיים
      console.log('Basic automation data:', automationData);
      
      // חילוץ מידע מפורט יותר מ-formData אם זמין
      if (formData.form_data) {
        console.log('Form data details available');
        
        // ניסיון לחלץ פרטי אוטומציה
        if (formData.selectedAutomation) {
          console.log('Selected automation found in form data:', formData.selectedAutomation);
          
          // עדכון נתוני האוטומציה מ-selectedAutomation
          automationData.id = formData.selectedAutomation.id || automationData.id;
          automationData.title = formData.selectedAutomation.title || automationData.title;
          automationData.name = `${formData.selectedAutomation.category || ''} - ${formData.selectedAutomation.title || ''}`.trim() || automationData.name;
          automationData.category = formData.selectedAutomation.category || automationData.category;
          
          // עדכון שדות נוספים אם קיימים
          if (formData.selectedAutomation.type) {
            automationData.type = formData.selectedAutomation.type;
          }
          
          if (formData.selectedAutomation.config) {
            automationData.config = formData.selectedAutomation.config;
          }
          
          // עדכון נתוני טריגר ותזמון
          if (formData.selectedAutomation.triggerType) {
            automationData.triggerType = formData.selectedAutomation.triggerType;
          }
          
          if (formData.selectedAutomation.triggerConfig) {
            automationData.triggerConfig = formData.selectedAutomation.triggerConfig;
          }
          
          if (formData.selectedAutomation.scheduleType) {
            automationData.scheduleType = formData.selectedAutomation.scheduleType;
          }
          
          if (formData.selectedAutomation.scheduleConfig) {
            automationData.scheduleConfig = formData.selectedAutomation.scheduleConfig;
          }
        } else if (formData.form_data.automation) {
          console.log('Automation details found in form_data:', formData.form_data.automation);
          
          // עדכון שדות בסיסיים
          if (formData.form_data.automation.title) {
            automationData.title = formData.form_data.automation.title;
          }
          
          if (formData.form_data.automation.category) {
            automationData.category = formData.form_data.automation.category;
          }
          
          if (formData.form_data.automation.type) {
            automationData.type = formData.form_data.automation.type;
          }
          
          if (formData.form_data.automation.config) {
            automationData.config = formData.form_data.automation.config;
          }
          
          // עדכון נתוני טריגר ותזמון
          if (formData.form_data.automation.triggerType) {
            automationData.triggerType = formData.form_data.automation.triggerType;
          }
          
          if (formData.form_data.automation.triggerConfig) {
            automationData.triggerConfig = formData.form_data.automation.triggerConfig;
          }
          
          if (formData.form_data.automation.scheduleType) {
            automationData.scheduleType = formData.form_data.automation.scheduleType;
          }
          
          if (formData.form_data.automation.scheduleConfig) {
            automationData.scheduleConfig = formData.form_data.automation.scheduleConfig;
          }
        }
      }
      
      // קבלת תוכן ההודעה אם זמין
      let messageContent = 'הודעה אוטומטית ממערכת OptiOne';
      
      // בדיקת כל המיקומים האפשריים לתוכן ההודעה
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
      
      // לוג סופי של הנתונים שיישמרו
      console.log('Final automation data for active_workflows:', JSON.stringify(automationData, null, 2));
      console.log('Final message content:', messageContent);
      
      // הכנת נתוני הטופס לשמירה מפורטת
      const formDataToSave = formData.form_data || {};
      
      // שמירה בטבלת active_workflows החדשה עם כל נתוני הטופס
      await saveActiveWorkflow(client.id, automationData, messageContent, formDataToSave);
      
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
    
    // הכנת אובייקט מידע מפורט להחזרה עבור ה-webhook
    const completeSubmissionData = {
      client,
      form_data: formData,
      business_data: {
        business_name: formData.business_name || formData.businessName || 'Unknown Business',
        contact_name: formData.client_name || formData.fullName || 'Unknown Contact',
        email: formData.email,
        phone: formData.phone
      },
      automation: {
        id: formData.automation_id,
        title: formData.automation_title || '',
        name: formData.automation_name || '',
        category: formData.automation_category || ''
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('Form data successfully processed and saved to Supabase');
    return completeSubmissionData;
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
    const mockClient = {
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
    
    return {
      client: mockClient,
      form_data: formData,
      business_data: {
        business_name: formData.businessName || 'Unknown Business',
        contact_name: formData.fullName || 'Unknown User',
        email: formData.email || 'unknown@example.com',
        phone: formData.phone || '000-000-0000'
      },
      automation: {
        id: formData.automation_id || 0,
        title: formData.automation_title || 'Unknown Automation',
        name: formData.automation_name || 'Unknown Automation',
        category: formData.automation_category || 'general'
      },
      timestamp: new Date().toISOString(),
      error: error.message || 'Unknown error'
    };
  }
}