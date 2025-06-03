import { create } from 'zustand';
import { Automation } from '../data/automations';
import { saveIntakeForm } from '../lib/supabase';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action';
  config: Record<string, any>;
}

interface FormState {
  currentStep: number;
  selectedAutomation: Automation | null;
  formData: Record<string, string | string[]>;
  workflowSteps: WorkflowStep[];
  errors: Record<string, string>;
  isSubmitting: boolean;
  isComplete: boolean;
  
  setStep: (step: number) => void;
  selectAutomation: (automation: Automation) => void;
  updateFormData: (data: Record<string, string | string[]>) => void;
  addWorkflowStep: (type: 'trigger' | 'action') => void;
  updateWorkflowStep: (id: string, config: Record<string, any>) => void;
  removeWorkflowStep: (id: string) => void;
  validateCurrentStep: () => boolean;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  currentStep: 0,
  selectedAutomation: null,
  formData: {},
  workflowSteps: [],
  errors: {},
  isSubmitting: false,
  isComplete: false,
  
  setStep: (step) => set({ currentStep: step }),
  
  selectAutomation: (automation) => set({ 
    selectedAutomation: automation
    // לא משנים את currentStep כדי להישאר בשלב הנוכחי
  }),
  
  updateFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),

  addWorkflowStep: (type) => set((state) => ({
    workflowSteps: [
      ...state.workflowSteps,
      {
        id: `${type}_${Date.now()}`,
        type,
        config: {}
      }
    ]
  })),

  updateWorkflowStep: (id, config) => set((state) => ({
    workflowSteps: state.workflowSteps.map(step =>
      step.id === id ? { ...step, config } : step
    )
  })),

  removeWorkflowStep: (id) => set((state) => ({
    workflowSteps: state.workflowSteps.filter(step => step.id !== id)
  })),
  
  validateCurrentStep: () => {
    const { currentStep, formData, workflowSteps } = get();
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      // Validate registration form
      const requiredFields = ['fullName', 'phone', 'email', 'businessName'];
      requiredFields.forEach(field => {
        if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
          isValid = false;
          newErrors[field] = 'שדה חובה';
        }
      });

      // Basic email validation
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email as string)) {
        isValid = false;
        newErrors.email = 'כתובת דוא״ל לא תקינה';
      }

      // Basic phone validation
      if (formData.phone && !/^[\d-]{9,}$/.test(formData.phone as string)) {
        isValid = false;
        newErrors.phone = 'מספר טלפון לא תקין';
      }
    } else if (currentStep === 2) {
      // Validate campaign settings
      if (!formData.active_campaigns || (Array.isArray(formData.active_campaigns) && formData.active_campaigns.length === 0)) {
        isValid = false;
        newErrors.active_campaigns = 'יש לבחור לפחות קמפיין אחד';
      }
    } else if (currentStep === 3) {
      // Validate automation selection
      const { selectedAutomation } = get();
      if (!selectedAutomation) {
        isValid = false;
        newErrors.automation = 'יש לבחור אוטומציה';
      }
    } else if (currentStep === 4) {
      // Validate workflow steps
      if (workflowSteps.length === 0) {
        isValid = false;
        newErrors.workflow = 'יש להוסיף לפחות צעד אחד לתהליך';
      }

      workflowSteps.forEach((step, index) => {
        if (Object.keys(step.config).length === 0) {
          isValid = false;
          newErrors[`step_${index}`] = 'יש להגדיר את כל השדות';
        }
      });
    }
    
    set({ errors: newErrors });
    return isValid;
  },
  
  submitForm: async () => {
    const { selectedAutomation, formData, workflowSteps } = get();
    
    if (!selectedAutomation) return;
    
    set({ isSubmitting: true });
    
    try {
      // הוספת לוג לבדיקת הנתונים שנשלחים
      console.log('Submitting form with selectedAutomation:', selectedAutomation);
      
      await saveIntakeForm({
        automation_id: selectedAutomation.id,
        automation_title: selectedAutomation.title,
        automation_name: `${selectedAutomation.category} - ${selectedAutomation.title}`,
        automation_category: selectedAutomation.category,
        client_name: formData.fullName as string,
        business_name: formData.businessName as string,
        email: formData.email as string,
        phone: formData.phone as string,
        form_data: {
          ...formData,
          workflow_steps: workflowSteps
        },
        // העברת ה-selectedAutomation כדי שיהיה זמין בפונקציית השמירה
        selectedAutomation,
        status: 'pending'
      });
      
      set({ 
        isSubmitting: false,
        isComplete: true,
        currentStep: 4
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      set({ isSubmitting: false });
      alert('אירעה שגיאה בשליחת הטופס. אנא נסה שנית.');
    }
  },
  
  resetForm: () => set({
    currentStep: 0,
    selectedAutomation: null,
    formData: {},
    workflowSteps: [],
    errors: {},
    isSubmitting: false,
    isComplete: false
  })
}));