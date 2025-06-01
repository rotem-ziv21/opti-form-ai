import React, { useEffect } from 'react';
import { generateMessageContent } from '../services/openai';
import { useFormStore } from '../store/formStore';

export const AIFix: React.FC = () => {
  const { selectedAutomation, updateFormData } = useFormStore();

  useEffect(() => {
    // Function to add AI buttons to all textareas
    const addAIButtons = () => {
      console.log('Adding AI buttons to textareas');
      
      // Find all textareas
      const textareas = document.querySelectorAll('textarea');
      
      textareas.forEach((textarea) => {
        const fieldId = textarea.id;
        
        // Skip if no ID or already has an AI button
        if (!fieldId || document.querySelector(`#ai-button-${fieldId}`)) {
          return;
        }
        
        console.log(`Found textarea with ID: ${fieldId}`);
        
        // Create AI button
        const aiButton = document.createElement('button');
        aiButton.id = `ai-button-${fieldId}`;
        aiButton.className = 'ai-button';
        aiButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/></svg>';
        aiButton.title = 'יצירת תוכן באמצעות AI';
        
        // Style the button
        aiButton.style.position = 'absolute';
        aiButton.style.top = '8px';
        aiButton.style.right = '-40px';
        aiButton.style.zIndex = '9999';
        aiButton.style.backgroundColor = '#0070f3';
        aiButton.style.color = 'white';
        aiButton.style.borderRadius = '50%';
        aiButton.style.width = '32px';
        aiButton.style.height = '32px';
        aiButton.style.display = 'flex';
        aiButton.style.alignItems = 'center';
        aiButton.style.justifyContent = 'center';
        aiButton.style.border = 'none';
        aiButton.style.boxShadow = '0 0 10px rgba(0, 112, 243, 0.5)';
        aiButton.style.cursor = 'pointer';
        
        // Create a container for the button
        const container = document.createElement('div');
        container.style.position = 'relative';
        
        // Insert the container and button
        const parent = textarea.parentNode;
        if (parent) {
          // Wrap textarea in the container
          parent.insertBefore(container, textarea);
          container.appendChild(textarea);
          
          // Add button to container
          container.appendChild(aiButton);
          
          // Handle click event
          aiButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create modal dialog
            const modal = document.createElement('div');
            modal.className = 'ai-modal';
            modal.innerHTML = `
              <div class="ai-modal-content">
                <div class="ai-modal-header">
                  <h2>יצירת תוכן באמצעות AI</h2>
                  <button class="ai-modal-close">&times;</button>
                </div>
                <div class="ai-modal-body">
                  <textarea id="ai-business-info" placeholder="תאר את העסק שלך, קהל היעד, והמטרות השיווקיות שלך כדי לקבל הצעה מותאמת אישית" rows="4"></textarea>
                  <div id="ai-generated-content" style="display:none;">
                    <h3>תוכן שנוצר:</h3>
                    <div id="ai-content-preview"></div>
                  </div>
                </div>
                <div class="ai-modal-footer">
                  <button id="ai-generate-btn">ייצר תוכן</button>
                  <button id="ai-apply-btn" style="display:none;">החל תוכן</button>
                </div>
              </div>
            `;
            
            // Style the modal
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '10000';
            
            const modalContent = modal.querySelector('.ai-modal-content');
            if (modalContent instanceof HTMLElement) {
              modalContent.style.backgroundColor = 'white';
              modalContent.style.borderRadius = '8px';
              modalContent.style.width = '90%';
              modalContent.style.maxWidth = '500px';
              modalContent.style.padding = '20px';
              modalContent.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
              modalContent.style.direction = 'rtl';
            }
            
            // Add modal to body
            document.body.appendChild(modal);
            
            // Close button functionality
            const closeBtn = modal.querySelector('.ai-modal-close');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
              });
            }
            
            // Generate button functionality
            const generateBtn = modal.querySelector('#ai-generate-btn');
            const businessInfoInput = modal.querySelector('#ai-business-info');
            const contentPreview = modal.querySelector('#ai-content-preview');
            const generatedContentDiv = modal.querySelector('#ai-generated-content');
            const applyBtn = modal.querySelector('#ai-apply-btn');
            
            if (generateBtn && businessInfoInput instanceof HTMLTextAreaElement && 
                contentPreview && generatedContentDiv && applyBtn) {
              
              generateBtn.addEventListener('click', async () => {
                const businessInfo = businessInfoInput.value.trim();
                if (!businessInfo || !selectedAutomation) return;
                
                // Show loading state
                generateBtn.textContent = 'מייצר תוכן...';
                generateBtn.setAttribute('disabled', 'true');
                
                try {
                  // Create prompt
                  const prompt = `Business Info: ${businessInfo}\n\nAutomation Category: ${selectedAutomation.category}\n\nAutomation Title: ${selectedAutomation.title}\n\nAutomation Description: ${selectedAutomation.description}`;
                  
                  // Generate content
                  const content = await generateMessageContent(prompt);
                  
                  // Display generated content
                  if (contentPreview instanceof HTMLElement && generatedContentDiv instanceof HTMLElement && applyBtn instanceof HTMLElement) {
                    contentPreview.textContent = content;
                    generatedContentDiv.style.display = 'block';
                    applyBtn.style.display = 'inline-block';
                  }
                } catch (error) {
                  console.error('Error generating content:', error);
                  alert('אירעה שגיאה בעת יצירת התוכן. אנא נסה שוב.');
                } finally {
                  generateBtn.textContent = 'ייצר תוכן';
                  generateBtn.removeAttribute('disabled');
                }
              });
              
              // Apply button functionality
              applyBtn.addEventListener('click', () => {
                if (contentPreview instanceof HTMLElement && textarea instanceof HTMLTextAreaElement) {
                  const content = contentPreview.textContent || '';
                  
                  // Update textarea value
                  textarea.value = content;
                  
                  // Update form store
                  updateFormData({ [fieldId]: content });
                  
                  // Trigger input event to notify React
                  const event = new Event('input', { bubbles: true });
                  textarea.dispatchEvent(event);
                  
                  // Close modal
                  document.body.removeChild(modal);
                }
              });
            }
          });
        }
      });
    };
    
    // Run initially
    addAIButtons();
    
    // Set up a MutationObserver to detect when new textareas are added
    const observer = new MutationObserver((mutations) => {
      let shouldAddButtons = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldAddButtons = true;
        }
      });
      
      if (shouldAddButtons) {
        setTimeout(addAIButtons, 100); // Slight delay to ensure DOM is updated
      }
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Add styles to the document
    const style = document.createElement('style');
    style.textContent = `
      .ai-button {
        position: absolute !important;
        top: 8px !important;
        right: -40px !important;
        z-index: 9999 !important;
        background-color: #0070f3 !important;
        color: white !important;
        border-radius: 50% !important;
        width: 32px !important;
        height: 32px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: none !important;
        box-shadow: 0 0 10px rgba(0, 112, 243, 0.5) !important;
        cursor: pointer !important;
      }
      
      .ai-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      
      .ai-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
      }
      
      .ai-modal-body {
        margin-bottom: 16px;
      }
      
      .ai-modal-body textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 16px;
      }
      
      #ai-content-preview {
        background-color: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        margin-top: 8px;
      }
      
      .ai-modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      
      .ai-modal-footer button {
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }
      
      #ai-generate-btn {
        background-color: #0070f3;
        color: white;
        border: none;
      }
      
      #ai-apply-btn {
        background-color: white;
        color: #0070f3;
        border: 1px solid #0070f3;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, [selectedAutomation, updateFormData]);
  
  return null; // This component doesn't render anything
};
