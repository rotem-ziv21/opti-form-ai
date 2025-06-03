import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Tag, ListTodo, X, ChevronDown, ChevronUp, UserPlus, Video, FileText, Bell, Mail, Clock, PlusCircle, Edit, MessageSquare } from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { AIAssistant } from './ui/AIAssistant';
import { automations } from '../data/automations';

interface TriggerOption {
  id: string;
  label: string;
  description: string;
  fields: {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
  }[];
}

interface ActionOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  fields: {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
  }[];
}

const triggerOptions: TriggerOption[] = [
  {
    id: 'facebook_lead',
    label: 'ליד נכנס מפייסבוק',
    description: 'הפעל כאשר ליד חדש נכנס מקמפיין פייסבוק',
    fields: []
  },
  {
    id: 'website_lead',
    label: 'ליד נכנס מהאתר',
    description: 'הפעל כאשר ליד חדש נרשם דרך האתר',
    fields: []
  },
  {
    id: 'whatsapp_lead',
    label: 'ליד נכנס מקמפיין הודעות ווטצאפ',
    description: 'הפעל כאשר ליד חדש מגיע מקמפיין ווטצאפ',
    fields: []
  },
  {
    id: 'tiktok_lead',
    label: 'ליד נכנס מטיקטוק',
    description: 'הפעל כאשר ליד חדש נכנס מקמפיין טיקטוק',
    fields: []
  },
  {
    id: 'instagram_comment',
    label: 'תגובה באינסטגרם + הודעה בפרטי',
    description: 'הפעל כאשר מישהו מגיב לפוסט באינסטגרם עם מילות מפתח',
    fields: [
      {
        id: 'trigger_keywords',
        label: 'מילות הפעלה לתגובה',
        type: 'text',
        placeholder: 'לדוגמה: שולחת, רוצה, אני, לינק',
        description: 'מילים שיפעילו את האוטומציה כאשר מופיעות בתגובה (ניתן יותר ממילה אחת)',
        required: true
      },
      {
        id: 'public_reply',
        label: 'תגובה פומבית לפוסט',
        type: 'textarea',
        placeholder: 'לדוגמה: שלחנו לך הודעה בפרטי 💬',
        description: 'התגובה שתופיע באופן פומבי בתגובה לפוסט',
        required: true
      },
      {
        id: 'private_message',
        label: 'הודעה פרטית באינסטגרם',
        type: 'textarea',
        placeholder: 'לדוגמה: היי! 😊\n\nכמו שביקשת, הנה הקישור למדריך: [קישור]\n\nרוצה שנשלח לך פרטים נוספים או נתאם שיחה? כתוב/י לי כאן את מספר הטלפון שלך 👇',
        description: 'ההודעה שתישלח בפרטי באינסטגרם',
        required: true
      },
      {
        id: 'invalid_response_message',
        label: 'הודעה למקרה של תגובה לא תקינה',
        type: 'textarea',
        placeholder: 'לדוגמה: אולי זו אני, אולי זו המערכת... 😅\n\nאבל נראה שלא קיבלנו מספר טלפון.\n\nאם בא לך שנחזור אליך – כתוב/י כאן את המספר שלך 👇',
        description: 'הודעה שתישלח אם הלקוח לא שלח מספר טלפון',
        required: true
      },
      {
        id: 'success_response_message',
        label: 'הודעה לאחר קבלת מספר טלפון',
        type: 'textarea',
        placeholder: 'לדוגמה: תודה! קיבלנו את המספר שלך ונחזור אליך בהקדם 🙏',
        description: 'הודעה שתישלח לאחר שהלקוח שלח מספר טלפון',
        required: true
      },
      {
        id: 'enable_facebook_automation',
        label: 'האם לבצע תהליך דומה גם בפייסבוק?',
        type: 'checkbox',
        description: 'סמן אם ברצונך להפעיל אוטומציה דומה גם בפייסבוק',
        required: false
      }
    ]
  },
  {
    id: 'lead_no_response_24h',
    label: 'עבר 24 שעות ואף אחד לא טיפל בליד',
    description: 'הפעל כאשר ליד לא קיבל מענה במשך 24 שעות',
    fields: []
  },
  {
    id: 'meeting_scheduled',
    label: 'נקבעה פגישה',
    description: 'הפעל כאשר נקבעת פגישה עם הליד',
    fields: []
  },
  {
    id: 'not_interested_14d',
    label: 'הודעה ללקוח לא מעוניין אחרי 14 יום',
    description: 'הפעל 14 יום לאחר שהליד סומן כלא מעוניין',
    fields: []
  },
  {
    id: 'deal_closed',
    label: 'הודעה לאחר סגירת עסקה',
    description: 'הפעל כאשר עסקה נסגרת בהצלחה',
    fields: []
  }
];

const actionOptions: ActionOption[] = [
  {
    id: 'assign_rep',
    label: 'שיוך לנציג',
    description: 'שייך את הליד לנציג מכירות',
    icon: <UserPlus size={18} />,
    fields: [
      {
        id: 'rep',
        label: 'בחר נציג',
        type: 'select',
        options: [
          { value: 'rep1', label: 'נציג 1' },
          { value: 'rep2', label: 'נציג 2' },
          { value: 'rep3', label: 'נציג 3' },
          { value: 'auto', label: 'הקצאה אוטומטית' }
        ]
      }
    ]
  },
  {
    id: 'send_message',
    label: 'שליחת הודעה',
    description: 'שלח הודעת טקסט אוטומטית',
    icon: <MessageSquare size={18} />,
    fields: [
      {
        id: 'message',
        label: 'תוכן ההודעה',
        type: 'textarea',
        placeholder: 'הכנס את תוכן ההודעה...'
      }
    ]
  },
  {
    id: 'send_video',
    label: 'שליחת סרטון',
    description: 'שלח סרטון אוטומטי',
    icon: <Video size={18} />,
    fields: [
      {
        id: 'video_url',
        label: 'קישור לסרטון',
        type: 'url',
        placeholder: 'https://example.com/video.mp4'
      },
      {
        id: 'message',
        label: 'הודעה מקדימה',
        type: 'textarea',
        placeholder: 'הודעה שתופיע לפני הסרטון...'
      }
    ]
  },
  {
    id: 'send_pdf',
    label: 'שליחת קובץ PDF',
    description: 'שלח קובץ PDF אוטומטי',
    icon: <FileText size={18} />,
    fields: [
      {
        id: 'pdf_url',
        label: 'קישור לקובץ',
        type: 'url',
        placeholder: 'https://example.com/document.pdf'
      },
      {
        id: 'message',
        label: 'הודעה מקדימה',
        type: 'textarea',
        placeholder: 'הודעה שתופיע לפני הקובץ...'
      }
    ]
  },
  {
    id: 'notify_team',
    label: 'התראה לאיש צוות',
    description: 'שלח התראה לאיש צוות',
    icon: <Bell size={18} />,
    fields: [
      {
        id: 'team_member',
        label: 'בחר איש צוות',
        type: 'select',
        options: [
          { value: 'member1', label: 'איש צוות 1' },
          { value: 'member2', label: 'איש צוות 2' },
          { value: 'member3', label: 'איש צוות 3' },
          { value: 'all', label: 'כל הצוות' }
        ]
      },
      {
        id: 'message',
        label: 'תוכן ההתראה',
        type: 'textarea',
        placeholder: 'הכנס את תוכן ההתראה...'
      }
    ]
  },
  {
    id: 'send_email',
    label: 'שליחת מייל',
    description: 'שלח הודעת דוא"ל אוטומטית',
    icon: <Mail size={18} />,
    fields: [
      {
        id: 'subject',
        label: 'נושא',
        type: 'text',
        placeholder: 'נושא המייל...'
      },
      {
        id: 'content',
        label: 'תוכן',
        type: 'textarea',
        placeholder: 'תוכן המייל...'
      }
    ]
  },
  {
    id: 'wait',
    label: 'המתנה',
    description: 'המתן פרק זמן מוגדר',
    icon: <Clock size={18} />,
    fields: [
      {
        id: 'duration',
        label: 'משך זמן',
        type: 'select',
        options: [
          { value: '300', label: '5 דקות' },
          { value: '900', label: '15 דקות' },
          { value: '3600', label: 'שעה' },
          { value: '86400', label: '24 שעות' },
          { value: '604800', label: 'שבוע' }
        ]
      }
    ]
  },
  {
    id: 'add_to_pipeline',
    label: 'הוספת הליד לפייפליין',
    description: 'הוסף את הליד לפייפליין מכירות',
    icon: <PlusCircle size={18} />,
    fields: [
      {
        id: 'pipeline',
        label: 'בחר פייפליין',
        type: 'select',
        options: [
          { value: 'sales', label: 'פייפליין מכירות' },
          { value: 'support', label: 'פייפליין תמיכה' },
          { value: 'custom', label: 'פייפליין מותאם אישית' }
        ]
      },
      {
        id: 'stage',
        label: 'שלב התחלתי',
        type: 'select',
        options: [
          { value: 'new', label: 'ליד חדש' },
          { value: 'contacted', label: 'נוצר קשר' },
          { value: 'qualified', label: 'ליד מוכשר' },
          { value: 'proposal', label: 'הצעת מחיר' }
        ]
      }
    ]
  },
  {
    id: 'update_pipeline_stage',
    label: 'עדכון שלב בפייפליין',
    description: 'שנה את השלב של הליד בפייפליין',
    icon: <Edit size={18} />,
    fields: [
      {
        id: 'stage',
        label: 'שלב חדש',
        type: 'select',
        options: [
          { value: 'contacted', label: 'נוצר קשר' },
          { value: 'qualified', label: 'ליד מוכשר' },
          { value: 'proposal', label: 'הצעת מחיר' },
          { value: 'negotiation', label: 'משא ומתן' },
          { value: 'closed_won', label: 'נסגר בהצלחה' },
          { value: 'closed_lost', label: 'נסגר ללא הצלחה' }
        ]
      }
    ]
  },
  {
    id: 'add_note',
    label: 'הוספת הערה לליד',
    description: 'הוסף הערה אוטומטית לכרטיס הליד',
    icon: <Edit size={18} />,
    fields: [
      {
        id: 'note',
        label: 'תוכן ההערה',
        type: 'textarea',
        placeholder: 'הכנס את תוכן ההערה...'
      }
    ]
  }
];

export const WorkflowBuilder: React.FC = () => {
  const { workflowSteps, addWorkflowStep, updateWorkflowStep, removeWorkflowStep } = useFormStore();
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const handleAddStep = (type: 'trigger' | 'action') => {
    addWorkflowStep(type);
  };

  const handleStepChange = (stepId: string, type: string, optionId: string) => {
    const option = type === 'trigger' 
      ? triggerOptions.find(t => t.id === optionId)
      : actionOptions.find(a => a.id === optionId);

    if (option) {
      updateWorkflowStep(stepId, {
        optionId,
        fields: {}
      });
      setExpandedStep(stepId);
    }
  };

  const handleFieldChange = (stepId: string, fieldId: string, value: string) => {
    const step = workflowSteps.find(s => s.id === stepId);
    if (step) {
      updateWorkflowStep(stepId, {
        ...step.config,
        fields: {
          ...step.config.fields,
          [fieldId]: value
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => handleAddStep('trigger')}
          leftIcon={<Tag size={18} />}
          variant="outline"
          className="flex-1"
        >
          הוסף טריגר
        </Button>
        <Button
          onClick={() => handleAddStep('action')}
          leftIcon={<ListTodo size={18} />}
          variant="outline"
          className="flex-1"
        >
          הוסף פעולה
        </Button>
      </div>

      <div className="space-y-4">
        {workflowSteps.map((step, index) => {
          const isExpanded = expandedStep === step.id;
          const options = step.type === 'trigger' ? triggerOptions : actionOptions;
          const selectedOption = step.config.optionId 
            ? options.find(o => o.id === step.config.optionId)
            : null;

          return (
            <Card key={step.id} className="relative">
              <button
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
                onClick={() => removeWorkflowStep(step.id)}
              >
                <X size={16} />
              </button>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {step.type === 'trigger' ? (
                    <Tag className="text-primary\" size={24} />
                  ) : (
                    <ListTodo className="text-primary" size={24} />
                  )}
                  <div className="flex-1">
                    <select
                      className="form-select"
                      value={step.config.optionId || ''}
                      onChange={(e) => handleStepChange(step.id, step.type, e.target.value)}
                    >
                      <option value="">בחר {step.type === 'trigger' ? 'טריגר' : 'פעולה'}</option>
                      {options.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedOption && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  )}
                </div>

                {selectedOption && isExpanded && (
                  <div className="mt-6 space-y-4 animate-slide-down">
                    <p className="text-slate-600 mb-4">{selectedOption.description}</p>
                    {selectedOption.fields.map(field => (
                      <div key={field.id}>
                        <label className="form-label">{field.label}</label>
                        {field.type === 'select' ? (
                          <select
                            className="form-select"
                            value={step.config.fields?.[field.id] || ''}
                            onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                          >
                            <option value="">בחר...</option>
                            {field.options?.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'url' ? (
                          <input
                            type="url"
                            className="form-input"
                            value={step.config.fields?.[field.id] || ''}
                            onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        ) : field.type === 'text' ? (
                          <input
                            type="text"
                            className="form-input"
                            value={step.config.fields?.[field.id] || ''}
                            onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <div className="relative form-field-ai-support">
                            <AIAssistant
                              automations={automations}
                              selectedAutomationId={String(step.id)}
                              placeholder="תאר את העסק שלך, קהל היעד, והמטרות השיווקיות שלך כדי לקבל הצעה מותאמת אישית"
                              onGenerate={(content: string) => {
                                handleFieldChange(step.id, field.id, content);
                              }}
                            />
                            <textarea
                              className="form-textarea"
                              value={step.config.fields?.[field.id] || ''}
                              onChange={(e) => handleFieldChange(step.id, field.id, e.target.value)}
                              placeholder={field.placeholder || ''}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {index < workflowSteps.length - 1 && (
                <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-px h-8 bg-primary/20" />
              )}
            </Card>
          );
        })}

        {workflowSteps.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-slate-600 mb-4">
              התחל ליצור את תהליך האוטומציה על ידי הוספת טריגר או פעולה
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleAddStep('trigger')}
                leftIcon={<Tag size={18} />}
                variant="outline"
              >
                הוסף טריגר
              </Button>
              <Button
                onClick={() => handleAddStep('action')}
                leftIcon={<ListTodo size={18} />}
                variant="outline"
              >
                הוסף פעולה
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};