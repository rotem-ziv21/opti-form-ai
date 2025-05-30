import React, { useEffect, useState } from 'react';
import { Check, Send, MessageSquare, Settings, Users } from 'lucide-react';

interface WorkflowAnimationProps {
  currentStep: number;
  totalSteps: number;
}

export const WorkflowAnimation: React.FC<WorkflowAnimationProps> = ({
  currentStep,
  totalSteps
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((currentStep / (totalSteps - 1)) * 100);
  }, [currentStep, totalSteps]);

  const steps = [
    { icon: Settings, label: 'הגדרות' },
    { icon: MessageSquare, label: 'הודעות' },
    { icon: Users, label: 'לקוחות' },
    { icon: Send, label: 'שליחה' },
    { icon: Check, label: 'סיום' }
  ];

  return (
    <div className="relative py-12 px-4">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Workflow Steps */}
      <div className="flex justify-between relative mt-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          const Icon = step.icon;

          return (
            <div key={index} className="flex flex-col items-center">
              <div className={`workflow-node ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
                {isActive && <div className="workflow-pulse" />}
                <Icon size={16} />
              </div>
              <span className={`mt-2 text-sm ${isActive ? 'text-primary font-medium' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};