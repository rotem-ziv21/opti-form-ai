export interface Automation {
  id: number;
  title: string;
  description: string;
  category: 'leads' | 'sales' | 'clients' | 'marketing' | 'meetings' | 'call_center' | 'general';
  icon: string;
  requiredFields: AutomationField[];
}

export interface AutomationField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'url' | 'multiselect' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
  supportAI?: boolean;
  isOptional?: boolean;
  isMultiple?: boolean;
  required?: boolean;
  accept?: string;
  description?: string;
  showWhen?: {
    field: string;
    value: string | string[] | boolean;
  };
}

export interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string;
  campaignType?: string;
  campaignGoal?: string;
  campaignBudget?: string;
  targetAudience?: string;
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}
