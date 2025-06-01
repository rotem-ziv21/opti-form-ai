export interface Automation {
  id: number;
  title: string;
  description: string;
  category: 'leads' | 'sales' | 'clients' | 'marketing';
  icon: string;
  requiredFields: AutomationField[];
}

export interface AutomationField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'url' | 'multiselect' | 'checkbox';
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
  supportAI?: boolean;
  isOptional?: boolean;
  isMultiple?: boolean;
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
