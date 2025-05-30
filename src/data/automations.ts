import { Icons } from '../lib/icons';

export interface Automation {
  id: number;
  title: string;
  description: string;
  category: 'leads' | 'sales' | 'clients' | 'marketing';
  icon: string;
  requiredFields: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'url' | 'multiselect';
    placeholder?: string;
    options?: { value: string; label: string }[];
    defaultValue?: string | number;
    supportAI?: boolean;
    isOptional?: boolean;
    isMultiple?: boolean;
    showWhen?: {
      field: string;
      value: string | string[];
    };
  }[];
}

export const automations: Automation[] = [
  {
    id: 1,
    title: 'אוטומציית ליד חדש',
    description: 'שליחת הודעה אוטומטית + ביצוע שיחה ראשונית + התראות לנציגים',
    category: 'leads',
    icon: 'user-plus',
    requiredFields: [
      {
        id: 'trigger_type',
        label: 'מתי להפעיל את האוטומציה?',
        type: 'select',
        options: [
          { value: 'new_lead', label: 'ליד חדש נכנס למערכת' },
          { value: 'form_submission', label: 'טופס מולא באתר' },
          { value: 'tag_added', label: 'תגית הוספה לליד' }
        ]
      },
      {
        id: 'welcome_message',
        label: 'הודעה ראשונה שהלקוח יקבל',
        type: 'textarea',
        placeholder: 'שלום! תודה שפנית אלינו 🙌\n\nאני כאן כדי להבין מה בדיוק אתם צריכים ולעזור לכם הכי מהר שאפשר – נתחיל בכמה שאלות קצרות 💬',
        supportAI: true
      },
      {
        id: 'question_1',
        label: 'שאלה 1',
        type: 'text',
        placeholder: 'לדוגמה: מה השירות שאתם מחפשים?'
      },
      {
        id: 'question_2',
        label: 'שאלה 2',
        type: 'text',
        placeholder: 'לדוגמה: האם מדובר בפנייה פרטית או עסקית?'
      },
      {
        id: 'completion_message',
        label: 'הודעה לאחר קבלת כל התשובות',
        type: 'textarea',
        placeholder: 'תודה על התשובות! נציג שלנו יחזור אליכם בהקדם 🙏',
        supportAI: true
      }
    ]
  },
  {
    id: 2,
    title: 'אוטומציית מעקב לידים',
    description: 'מעקב אחר לידים שלא הגיבו + תזכורות אוטומטיות',
    category: 'leads',
    icon: 'bell',
    requiredFields: [
      {
        id: 'trigger_condition',
        label: 'מתי להתחיל מעקב?',
        type: 'select',
        options: [
          { value: 'no_response', label: 'אין תגובה מהליד' },
          { value: 'status_change', label: 'שינוי סטטוס' },
          { value: 'custom_tag', label: 'תגית מותאמת אישית' }
        ]
      },
      {
        id: 'follow_up_delay',
        label: 'זמן המתנה לפני תזכורת',
        type: 'select',
        options: [
          { value: '1', label: 'שעה' },
          { value: '24', label: '24 שעות' },
          { value: '48', label: '48 שעות' },
          { value: '72', label: '72 שעות' }
        ]
      },
      {
        id: 'reminder_message',
        label: 'הודעת תזכורת',
        type: 'textarea',
        placeholder: 'היי! רק רציתי לוודא שקיבלת את ההודעה הקודמת שלי 😊',
        supportAI: true
      }
    ]
  }
];