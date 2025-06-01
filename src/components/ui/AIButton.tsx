import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import { Textarea } from './Textarea';
import { generateMessageContent } from '../../services/openai';
import { Automation } from '../../types';

interface AIButtonProps {
  fieldId: string;
  onGenerate: (content: string) => void;
  selectedAutomation?: Automation;
}

export const AIButton: React.FC<AIButtonProps> = ({
  fieldId,
  onGenerate,
  selectedAutomation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [businessInfo, setBusinessInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    // Find the textarea element by ID and position the button next to it
    const positionButton = () => {
      const textarea = document.getElementById(fieldId);
      if (textarea) {
        // We don't need the rect for now, just using fixed positioning
        setButtonPosition({
          top: 8,
          right: -40,
        });
      }
    };

    positionButton();
    // Reposition on window resize
    window.addEventListener('resize', positionButton);
    return () => window.removeEventListener('resize', positionButton);
  }, [fieldId]);

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

  const applyGeneratedContent = () => {
    onGenerate(generatedContent);
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="ai-button"
        title="יצירת תוכן באמצעות AI"
        style={{ 
          position: 'absolute',
          top: `${buttonPosition.top}px`,
          right: `${buttonPosition.right}px`,
          zIndex: 9999,
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '50%',
          padding: '6px',
          boxShadow: '0 0 10px rgba(0, 112, 243, 0.5)',
          border: 'none',
          display: 'block',
          opacity: 1,
          visibility: 'visible'
        }}
      >
        <Sparkles size={16} className="text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
    </>
  );
};
