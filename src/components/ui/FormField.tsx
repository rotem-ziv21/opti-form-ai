import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Automation } from '../../types';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import { Textarea } from './Textarea';
import { generateMessageContent } from '../../services/openai';

interface FormFieldProps {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'url' | 'multiselect' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  value: string | string[] | boolean;
  onChange: (value: string | string[] | boolean) => void;
  options?: { value: string; label: string }[];
  error?: string;
  supportAI?: boolean;
  selectedAutomation?: Automation;
  automations?: Automation[];
  isOptional?: boolean;
  isMultiple?: boolean;
  required?: boolean;
  accept?: string;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  options,
  error,
  supportAI,
  selectedAutomation,
  // automations parameter is not used in this implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  automations,
  isOptional,
  isMultiple,
  required,
  accept,
  description,
}) => {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [businessInfo, setBusinessInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  
  // Handle AI content generation
  const handleGenerate = async () => {
    if (!businessInfo.trim() || !selectedAutomation) return;
    
    setIsGenerating(true);
    try {
      // Create a prompt string with the business info and automation details
      const prompt = `Business Info: ${businessInfo}\n\nAutomation Category: ${selectedAutomation.category}\n\nAutomation Title: ${selectedAutomation.title}\n\nAutomation Description: ${selectedAutomation.description}`;
      
      const content = await generateMessageContent(prompt);
      
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Apply generated content to the form field
  const applyGeneratedContent = () => {
    onChange(generatedContent);
    setIsAIDialogOpen(false);
  };
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="form-label">
          {label}
          {(required || !isOptional) && <span className="text-error mr-1">*</span>}
        </label>
      </div>
      
      <div className="relative">
        {type === 'textarea' ? (
          <div className="relative form-field-ai-support">
            {/* Direct AI button implementation */}
            {supportAI && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAIDialogOpen(true)}
                className="ai-assistant-button"
                title="יצירת תוכן באמצעות AI"
                style={{ 
                  position: 'absolute',
                  top: '8px',
                  right: '-40px',
                  zIndex: 100,
                  backgroundColor: '#0070f3',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '6px',
                  boxShadow: '0 0 10px rgba(0, 112, 243, 0.5)',
                  display: 'block',
                  opacity: 1,
                  visibility: 'visible'
                }}
              >
                <Sparkles size={16} className="text-white" />
              </Button>
            )}
            <textarea
              id={id}
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={cn(
                'form-textarea',
                error && 'border-error focus:border-error focus:ring-error/30'
              )}
            />
            
            {/* AI Dialog */}
            {supportAI && (
              <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>יצירת תוכן באמצעות AI</DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <Textarea
                      placeholder="תאר את העסק שלך, קהל היעד, והמטרות השיווקיות שלך כדי לקבל הצעה מותאמת אישית"
                      value={businessInfo}
                      onChange={(e) => setBusinessInfo(e.target.value)}
                      className="min-h-[100px]"
                    />
                    
                    {generatedContent && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">תוכן שנוצר:</h3>
                        <div className="p-3 bg-muted rounded-md">{generatedContent}</div>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating || !businessInfo.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          מייצר תוכן...
                        </>
                      ) : (
                        'ייצר תוכן'
                      )}
                    </Button>
                    
                    {generatedContent && (
                      <Button
                        type="button"
                        onClick={applyGeneratedContent}
                        variant="outline"
                      >
                        החל תוכן
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : type === 'select' ? (
          <select
            id={id}
            value={isMultiple ? (value as string[]) : (value as string)}
            onChange={(e) => {
              if (isMultiple) {
                const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                onChange(selectedOptions);
              } else {
                onChange(e.target.value);
              }
            }}
            multiple={isMultiple}
            size={isMultiple ? 8 : undefined}
            className={cn(
              'form-select',
              isMultiple && 'min-h-[200px] cursor-pointer',
              error && 'border-error focus:border-error focus:ring-error/30'
            )}
          >
            {!isMultiple && <option value="">בחר...</option>}
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <div className="mt-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                id={id}
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => onChange(e.target.checked)}
                className="form-checkbox h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="mr-2 text-sm text-gray-700">{placeholder}</span>
            </label>
          </div>
        ) : type === 'radio' ? (
          <div className="mt-2 space-y-2">
            {options?.map((option) => (
              <label key={option.value} className="inline-flex items-center cursor-pointer block">
                <input
                  type="radio"
                  name={id}
                  value={option.value}
                  checked={(value as string) === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="form-radio h-5 w-5 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="mr-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        ) : type === 'file' ? (
          <div className="mt-2">
            <input
              id={id}
              type="file"
              onChange={(e) => {
                // Handle file upload
                const files = e.target.files;
                if (files && files.length > 0) {
                  onChange(files[0].name); // Store file name for now
                }
              }}
              accept={accept}
              className="form-input px-3 py-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
            />
            {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
          </div>
        ) : (
          <input
            id={id}
            type={type}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'form-input',
              error && 'border-error focus:border-error focus:ring-error/30'
            )}
          />
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {description && !error && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
      {isOptional && !error && !description && (
        <p className="mt-1 text-sm text-slate-500">שדה זה אינו חובה</p>
      )}
      {isMultiple && type === 'select' && !error && (
        <div className="mt-1 text-sm">
          <p className="text-slate-500 mb-1">ניתן לבחור מספר אפשרויות:</p>
          <ul className="list-disc list-inside text-slate-500 text-xs">
            <li>לחיצה על Ctrl/Cmd + לחיצה על האפשרות הרצויה לבחירה מרובה</li>
            <li>לחיצה על Shift + לחיצה לבחירת טווח אפשרויות</li>
            <li>לחיצה כפולה על אפשרות לבחירה/ביטול</li>
          </ul>
        </div>
      )}
    </div>
  );
};