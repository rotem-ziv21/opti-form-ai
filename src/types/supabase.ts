export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          business_name: string
          contact_name: string
          email: string
          phone: string
          website_url: string | null
          status: 'active' | 'inactive'
          client_id: string // Unique identifier for the client
        }
        Insert: {
          id?: string
          created_at?: string
          business_name: string
          contact_name: string
          email: string
          phone: string
          website_url?: string | null
          status?: 'active' | 'inactive'
          client_id: string
        }
        Update: {
          id?: string
          created_at?: string
          business_name?: string
          contact_name?: string
          email?: string
          phone?: string
          website_url?: string | null
          status?: 'active' | 'inactive'
          client_id?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          created_at: string
          client_id: string
          campaign_type: string
          name: string
          status: 'active' | 'paused' | 'completed'
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          campaign_type: string
          name: string
          status?: 'active' | 'paused' | 'completed'
          settings: Json
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          campaign_type?: string
          name?: string
          status?: 'active' | 'paused' | 'completed'
          settings?: Json
        }
      }
      workflows: {
        Row: {
          id: string
          created_at: string
          client_id: string
          name: string
          description: string | null
          is_active: boolean
          trigger_type: string
          trigger_config: Json
          last_executed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          name: string
          description?: string | null
          is_active?: boolean
          trigger_type: string
          trigger_config: Json
          last_executed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          trigger_type?: string
          trigger_config?: Json
          last_executed_at?: string | null
        }
      }
      workflow_steps: {
        Row: {
          id: string
          created_at: string
          workflow_id: string
          step_order: number
          action_type: string
          action_config: Json
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          workflow_id: string
          step_order: number
          action_type: string
          action_config: Json
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          workflow_id?: string
          step_order?: number
          action_type?: string
          action_config?: Json
          is_active?: boolean
        }
      }
      workflow_executions: {
        Row: {
          id: string
          created_at: string
          workflow_id: string
          trigger_data: Json
          status: 'pending' | 'running' | 'completed' | 'failed'
          error_message: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          workflow_id: string
          trigger_data: Json
          status?: 'pending' | 'running' | 'completed' | 'failed'
          error_message?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          workflow_id?: string
          trigger_data?: Json
          status?: 'pending' | 'running' | 'completed' | 'failed'
          error_message?: string | null
          completed_at?: string | null
        }
      }
      execution_steps: {
        Row: {
          id: string
          created_at: string
          execution_id: string
          workflow_step_id: string
          status: 'pending' | 'running' | 'completed' | 'failed'
          result: Json | null
          error_message: string | null
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          execution_id: string
          workflow_step_id: string
          status?: 'pending' | 'running' | 'completed' | 'failed'
          result?: Json | null
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          execution_id?: string
          workflow_step_id?: string
          status?: 'pending' | 'running' | 'completed' | 'failed'
          result?: Json | null
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
        }
      }
    }
  }
}