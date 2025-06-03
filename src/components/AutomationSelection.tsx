import React, { useState, useEffect } from 'react';
import { Automation, automations } from '../data/automations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { ChevronDown, ChevronUp, Settings, Facebook, Video, Globe, CheckCircle, XCircle, MessageCircle, AlertTriangle, Calendar, Loader2, Sparkles, Instagram } from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { Button } from './ui/Button';
import { FormField } from './ui/FormField';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { generateMessageContent } from '../services/openai';

interface AutomationSelectionProps {
  selectedAutomation: Automation | null;
}

export const AutomationSelection: React.FC<AutomationSelectionProps> = ({
  selectedAutomation
}) => {
  const { formData, updateFormData, validateCurrentStep, setStep, submitForm, selectAutomation } = useFormStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  
  // Initialize field values from form data
  useEffect(() => {
    setFieldValues(formData);
  }, [formData]);

  // We're using a specific order of automations instead of grouping by category

  // Define the specific order of automations as per requirements
  const automationOrder = [
    1, // Facebook lead
    2, // TikTok lead
    3, // Website lead
    4, // Deal closed
    5, // Not interested
    6, // WhatsApp direct
    7, // Team notifications
    8, // Meeting scheduled
    9, // Instagram comment + private message
    10, // תיאום פגישות
    11, // מעקב אחר הצעות מחיר
    12, // אוטומציות מרכזייה
    13  // הערות למטמיע
  ];
  
  // Handle field change
  const handleFieldChange = (id: string, value: any) => {
    setFieldValues(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Toggle section expansion
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Check if a field should be shown based on its showWhen condition
  const shouldShowField = (field: any) => {
    if (!field.showWhen) return true;
    
    const { field: conditionField, value: conditionValue } = field.showWhen;
    const currentValue = fieldValues[conditionField];
    
    if (Array.isArray(conditionValue)) {
      return Array.isArray(currentValue) 
        ? conditionValue.some(v => currentValue.includes(v))
        : conditionValue.includes(currentValue);
    }
    
    return currentValue === conditionValue;
  };
  
  // Auto-expand sections when checkbox is checked
  useEffect(() => {
    // Check all checkbox fields and auto-expand their sections if checked
    Object.entries(fieldValues).forEach(([fieldId, value]) => {
      if (fieldId.startsWith('enable_') && value === true) {
        // Find the automation ID from the field ID
        const automationId = automationOrder.find(id => {
          const automation = automations.find(a => a.id === id);
          return automation?.requiredFields.some(field => field.id === fieldId);
        });
        
        if (automationId) {
          setExpandedSections(prev => ({
            ...prev,
            [`automation_${automationId}`]: true
          }));
        }
      }
    });
  }, [fieldValues]);
  
  // Save and submit form
  const handleSaveAndContinue = () => {
    // Save all field values to form store
    updateFormData(fieldValues);
    
    // Validate and submit form
    if (validateCurrentStep()) {
      submitForm(); // Submit the form directly instead of moving to next step
    }
  };

  // AI Dialog
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [businessInfo, setBusinessInfo] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFieldId, setCurrentFieldId] = useState('');
  const [currentAutomation, setCurrentAutomation] = useState<Automation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [writingStyle, setWritingStyle] = useState('professional'); // Default to professional style
  const [includeEmojis, setIncludeEmojis] = useState(false); // Default to no emojis

  // Open AI dialog for a specific field
  const openAIDialog = (fieldId: string, automation: Automation) => {
    setCurrentFieldId(fieldId);
    setCurrentAutomation(automation);
    setBusinessInfo('');
    setGeneratedContent('');
    setErrorMessage(''); // Reset any previous error messages
    setWritingStyle('professional'); // Reset to default writing style
    setIncludeEmojis(false); // Reset emoji preference
    setIsAIDialogOpen(true);
  };

  const handleGenerate = async () => {
    if (!businessInfo.trim() || !currentAutomation) return;
    
    setIsGenerating(true);
    setErrorMessage('');
    
    try {
      // Pass the parameters correctly to the generateMessageContent function
      const content = await generateMessageContent(
        businessInfo,
        currentAutomation.category,
        currentAutomation.title,
        currentAutomation.description,
        writingStyle,
        includeEmojis
      );
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
      setErrorMessage('אירעה שגיאה בעת יצירת התוכן. אנא נסה שוב מאוחר יותר.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedContent = () => {
    if (currentFieldId && generatedContent) {
      updateFormData({ [currentFieldId]: generatedContent });
      setIsAIDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AI Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={(open) => setIsAIDialogOpen(open)}>
        <DialogContent className="fixed inset-0 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-[90vw] max-w-[1000px] h-[80vh] max-h-[800px] m-auto p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-xl font-bold text-primary">יצירת תוכן באמצעות AI</DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">הזן מידע על העסק שלך כדי ליצור תוכן מותאם אישית</p>
          </DialogHeader>
          
          {/* Main content area - scrollable */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Business Info Section */}
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">מידע על העסק שלך</label>
                <span className="text-xs text-gray-500">שדה חובה</span>
              </div>
              
              {/* Automation Context - Show at the top */}
              {currentAutomation && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">אוטומציה נבחרת:</h3>
                  <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    <div><span className="font-medium">קטגוריה:</span> {currentAutomation.category}</div>
                    <div><span className="font-medium">כותרת:</span> {currentAutomation.title}</div>
                    {currentAutomation.description && (
                      <div><span className="font-medium">תיאור:</span> {currentAutomation.description}</div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Textarea container with relative positioning */}
              <div className="relative w-full mb-8">
                <textarea
                  placeholder="תאר את העסק שלך, קהל היעד, והמטרות השיווקיות שלך כדי לקבל הצעה מותאמת אישית"
                  value={businessInfo}
                  onChange={(e) => setBusinessInfo(e.target.value)}
                  className="w-full min-h-[150px] p-4 text-base leading-relaxed rounded-lg border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm resize-y"
                  style={{ direction: 'rtl' }}
                  maxLength={500}
                />
                <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">
                  {businessInfo.length} / 500 תווים
                </div>
              </div>
              
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>טיפ: </span>
                <span>ככל שתספק יותר מידע, כך התוכן שייוצר יהיה מותאם יותר לעסק שלך</span>
              </div>
              
              {/* Writing Style and Emoji Options */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">סגנון כתיבה</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                      { id: 'professional', label: 'מקצועי' },
                      { id: 'casual', label: 'קליל' },
                      { id: 'funny', label: 'מצחיק' },
                      { id: 'sensitive', label: 'רגיש' },
                      { id: 'formal', label: 'רשמי' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setWritingStyle(style.id)}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${writingStyle === style.id 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeEmojis"
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="includeEmojis" className="mr-2 block text-sm text-gray-700 dark:text-gray-300">
                    הוסף אימוג'ים לתוכן
                  </label>
                </div>
              </div>
              
              {errorMessage && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                  <AlertTriangle className="inline-block mr-1" size={16} />
                  {errorMessage}
                </div>
              )}
              
              {generatedContent && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <h3 className="text-base font-medium text-green-800 dark:text-green-400 mb-2">התוכן שנוצר:</h3>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-green-100 dark:border-green-900 text-gray-800 dark:text-gray-200">
                    {generatedContent}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer with buttons - fixed at bottom */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex justify-end items-center">
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !businessInfo.trim()}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md text-base font-medium shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
                    className="border-2 border-primary text-primary hover:bg-primary/10 px-6 py-2 rounded-md text-base font-medium"
                  >
                    החל תוכן
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-primary">הגדרת אוטומציות</h2>
        <p className="text-gray-600 mb-2">אנא עבור על השאלות הבאות כדי להגדיר את האוטומציות שיופעלו במערכת:</p>
      </div>
      
      <div className="flex flex-col space-y-6">
        {automationOrder.map(automationId => {
          const automation = automations.find(a => a.id === automationId);
          if (!automation) return null;
          
          const isExpanded = expandedSections[`automation_${automation.id}`];
          
          // Get the appropriate icon based on icon name
          const getIconComponent = (iconName: string) => {
            switch (iconName) {
              case 'facebook':
                return <Facebook className="text-primary" size={20} />;
              case 'video':
                return <Video className="text-primary" size={20} />;
              case 'globe':
                return <Globe className="text-primary" size={20} />;
              case 'check-circle':
                return <CheckCircle className="text-primary" size={20} />;
              case 'x-circle':
                return <XCircle className="text-primary" size={20} />;
              case 'message-circle':
                return <MessageCircle className="text-primary" size={20} />;
              case 'alert-triangle':
                return <AlertTriangle className="text-primary" size={20} />;
              case 'calendar':
                return <Calendar className="text-primary" size={20} />;
              case 'instagram':
                return <Instagram className="text-primary" size={20} />;
              default:
                return <Settings className="text-primary" size={20} />;
            }
          };
          
          return (
            <Card 
              key={automation.id} 
              className={`overflow-hidden w-full mb-4 ${selectedAutomation?.id === automation.id ? 'border-primary border-2' : ''}`}
            >
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  toggleSection(`automation_${automation.id}`)
                  // בחירת האוטומציה הנוכחית
                  selectAutomation(automation);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getIconComponent(automation.icon)}
                    </div>
                    <div className="flex-1">
                      <CardTitle>{automation.title}</CardTitle>
                      <CardDescription>{automation.description}</CardDescription>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? (
                      <ChevronUp className="text-gray-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-4 pb-6 border-t">
                  <div className="space-y-6">
                    {/* First show the checkbox fields */}
                    {automation.requiredFields
                      .filter(field => field.type === 'checkbox')
                      .map(field => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <FormField
                              id={field.id}
                              label={field.label}
                              type={field.type}
                              value={fieldValues[field.id] ?? field.defaultValue ?? false}
                              onChange={(value) => handleFieldChange(field.id, value)}
                            />
                            
                            {/* Add AI button for checkbox fields */}
                            {field.id.includes('enable_') && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="ml-4 flex items-center gap-1 bg-primary text-white hover:bg-primary/90"
                                onClick={() => {
                                  console.log('AI button clicked for field:', field.id);
                                  // Find the corresponding message field ID
                                  const messageFieldId = field.id.replace('enable_', '') + '_message';
                                  console.log('Message field ID:', messageFieldId);
                                  // Find the automation message field
                                  const messageField = automation.requiredFields.find(f => f.id === messageFieldId);
                                  console.log('Message field:', messageField);
                                  console.log('Has supportAI:', messageField?.supportAI);
                                  
                                  if (messageField && messageField.supportAI) {
                                    // Open AI dialog for this field
                                    openAIDialog(messageFieldId, automation);
                                  } else {
                                    console.log('Cannot open AI dialog: messageField is null or supportAI is false');
                                    // Force open the dialog anyway for debugging
                                    openAIDialog(messageFieldId || 'unknown', automation);
                                  }
                                }}
                              >
                                <Sparkles size={16} />
                                <span>השתמש ב-AI</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    }
                    
                    {/* Then show the other fields that should be visible based on conditions */}
                    {automation.requiredFields
                      .filter(field => field.type !== 'checkbox' && shouldShowField(field))
                      .map(field => (
                        <div key={field.id} className="space-y-2">
                          <FormField
                            id={field.id}
                            label={field.label}
                            type={field.type}
                            placeholder={field.placeholder}
                            options={field.options}
                            value={fieldValues[field.id] ?? field.defaultValue ?? ''}
                            onChange={(value) => handleFieldChange(field.id, value)}
                            isMultiple={field.isMultiple}
                            supportAI={field.supportAI}
                            selectedAutomation={automation}
                            automations={automations}
                          />
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={() => setStep(2)} // Go back to campaign settings
        >
          חזרה
        </Button>
        <Button 
          onClick={handleSaveAndContinue}
        >
          שמור והמשך
        </Button>
      </div>
    </div>
  );
};