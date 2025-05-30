import React from 'react';
import { Card } from './ui/Card';
import { WorkflowBuilder } from './WorkflowBuilder';
import { Button } from './ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useFormStore } from '../store/formStore';

interface DynamicFormProps {
  automation: any;
  formData: Record<string, string | string[]>;
  setFormData: (data: Record<string, string | string[]>) => void;
  errors: Record<string, string>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  automation,
  formData,
  setFormData,
  errors
}) => {
  const { validateCurrentStep } = useFormStore();

  const handleNext = () => {
    if (validateCurrentStep()) {
      // This will trigger the form submission in the store
      validateCurrentStep();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden">
        <div className="mb-8 p-6 bg-gradient-to-r from-background/5 to-primary/5">
          <h2 className="text-2xl font-bold text-background mb-2">{automation.title}</h2>
          <p className="text-slate-600">{automation.description}</p>
        </div>
        
        <div className="p-6">
          <WorkflowBuilder />
        </div>

        <div className="p-6 border-t bg-slate-50">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              חזור
            </Button>
            <Button 
              onClick={handleNext}
              rightIcon={<ArrowLeft size={20} />}
            >
              שמור והמשך
            </Button>
          </div>
          {errors.workflow && (
            <p className="mt-4 text-sm text-error text-center">{errors.workflow}</p>
          )}
        </div>
      </Card>
    </div>
  );
}