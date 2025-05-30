import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  onStepClick 
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && index < currentStep;
          
          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  onClick={isClickable ? () => onStepClick(index) : undefined}
                  disabled={!isClickable}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all",
                    isCompleted ? "bg-primary text-white" : 
                    isCurrent ? "bg-primary/20 border-2 border-primary text-primary" : 
                    "bg-slate-100 text-slate-400",
                    isClickable && "cursor-pointer hover:opacity-80"
                  )}
                >
                  {isCompleted ? <Check size={18} /> : index + 1}
                </button>
                <span className={cn(
                  "mt-2 text-sm text-center",
                  (isCompleted || isCurrent) ? "text-primary font-medium" : "text-slate-400"
                )}>
                  {step}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-1 mx-2",
                  index < currentStep ? "bg-primary" : "bg-slate-200"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};