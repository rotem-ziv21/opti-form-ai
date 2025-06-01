import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import { Automation } from '../../types';
import { generateMessageContent } from '../../services/openai';

interface AIAssistantProps {
  onGenerate: (content: string) => void;
  automations?: Automation[];
  selectedAutomationId?: string;
  placeholder?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onGenerate,
  automations = [],
  selectedAutomationId = '',
  placeholder = 'תאר את העסק שלך, קהל היעד והמטרה של ההודעה...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [businessInfo, setBusinessInfo] = useState('');
  const [automationId, setAutomationId] = useState(selectedAutomationId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    if (!businessInfo.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Get the selected automation details if available
      const selectedAutomation = automations.find(a => String(a.id) === automationId);
      
      // Call OpenAI service directly
      const content = await generateMessageContent(
        businessInfo,
        selectedAutomation?.category || '',
        selectedAutomation?.title || '',
        selectedAutomation?.description || ''
      );
      
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('אירעה שגיאה בעת יצירת התוכן. אנא נסה שוב מאוחר יותר.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    onGenerate(generatedContent);
    setIsOpen(false);
    // Reset states
    setBusinessInfo('');
    setGeneratedContent('');
  };

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="ai-assistant-button"
        title="יצירת תוכן באמצעות AI"
        style={{ 
          display: 'block', 
          opacity: 1, 
          visibility: 'visible',
          position: 'absolute',
          top: '8px',
          right: '-40px',
          zIndex: 100,
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '50%',
          padding: '6px',
          boxShadow: '0 0 10px rgba(0, 112, 243, 0.5)'
        }}
      >
        <Sparkles size={16} className="text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-center">יצירת תוכן באמצעות AI</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="business-info" className="text-sm font-medium">
                מידע על העסק וקהל היעד
              </label>
              <Textarea
                id="business-info"
                value={businessInfo}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBusinessInfo(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="resize-none"
                dir="rtl"
              />
            </div>

            {automations.length > 0 && (
              <div className="space-y-2">
                <label htmlFor="automation-select" className="text-sm font-medium">
                  בחר אוטומציה רלוונטית
                </label>
                <select
                  id="automation-select"
                  value={automationId}
                  onChange={(e) => setAutomationId(e.target.value)}
                  className="form-select w-full"
                  dir="rtl"
                >
                  <option value="">בחר אוטומציה...</option>
                  {automations.map((automation) => (
                    <option key={automation.id} value={String(automation.id)}>
                      {automation.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {generatedContent && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">התוכן שנוצר</label>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[100px] whitespace-pre-wrap">
                  {generatedContent}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex space-x-2 rtl:space-x-reverse">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              ביטול
            </Button>
            
            {!generatedContent ? (
              <Button 
                type="button" 
                onClick={handleGenerate} 
                disabled={isGenerating || !businessInfo.trim()}
                className="tech-button"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    מייצר תוכן...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    יצירת תוכן
                  </>
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleApply}
                className="tech-button"
              >
                החל תוכן
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
