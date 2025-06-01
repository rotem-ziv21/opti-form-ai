import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AIButton } from './ui/AIButton';
import { useFormStore } from '../store/formStore';
import { automations } from '../data/automations';
import { Automation } from '../types';

export const AIButtonInjector: React.FC = () => {
  const { selectedAutomation, updateFormData } = useFormStore();
  
  // Function to update form data
  const setFieldValue = (fieldId: string, value: string) => {
    updateFormData({ [fieldId]: value });
  };

  useEffect(() => {
    // Function to inject AI buttons
    const injectAIButtons = () => {
      // Find all textarea fields that should have AI support
      const textareaFields = document.querySelectorAll('textarea.form-textarea');
      
      textareaFields.forEach((textarea) => {
        const fieldId = textarea.id;
        
        // Skip if no ID or already has an AI button
        if (!fieldId || document.querySelector(`#ai-button-${fieldId}`)) {
          return;
        }
        
        // Check if this field should have AI support
        let shouldHaveAISupport = false;
        
        // Check in automations data
        automations.forEach(automation => {
          automation.requiredFields.forEach(field => {
            if (field.id === fieldId && field.supportAI) {
              shouldHaveAISupport = true;
            }
          });
        });
        
        if (!shouldHaveAISupport) {
          return;
        }
        
        // Create a container for the AI button
        const container = document.createElement('div');
        container.id = `ai-button-${fieldId}`;
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.right = '-50px';
        container.style.zIndex = '9999';
        
        // Add the container next to the textarea
        textarea.parentNode?.appendChild(container);
        
        // Create a React root and render the AIButton
        const root = createRoot(container);
        root.render(
          <AIButton
            fieldId={fieldId}
            selectedAutomation={selectedAutomation || undefined}
            onGenerate={(content) => {
              // Update the textarea value
              if (textarea instanceof HTMLTextAreaElement) {
                textarea.value = content;
                
                // Also update the form store
                setFieldValue(fieldId, content);
                
                // Dispatch an input event to trigger React's onChange
                const event = new Event('input', { bubbles: true });
                textarea.dispatchEvent(event);
              }
            }}
          />
        );
      });
    };
    
    // Run initially
    injectAIButtons();
    
    // Set up a MutationObserver to detect when new textareas are added
    const observer = new MutationObserver((mutations) => {
      let shouldInject = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldInject = true;
        }
      });
      
      if (shouldInject) {
        injectAIButtons();
      }
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, [selectedAutomation, setFieldValue]);
  
  return null; // This component doesn't render anything
};
