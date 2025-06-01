// No imports needed

export interface Automation {
  id: number;
  title: string;
  description: string;
  category: 'leads' | 'sales' | 'clients' | 'marketing';
  icon: string;
  requiredFields: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'url' | 'multiselect' | 'checkbox';
    placeholder?: string;
    options?: { value: string; label: string }[];
    defaultValue?: string | number | boolean;
    supportAI?: boolean;
    isOptional?: boolean;
    isMultiple?: boolean;
    showWhen?: {
      field: string;
      value: string | string[] | boolean;
    };
  }[];
}

export const automations: Automation[] = [
  {
    id: 1,
    title: 'אוטומציית ליד מפייסבוק',
    description: 'אוטומציה להפעלה כאשר ליד נכנס מפייסבוק',
    category: 'leads',
    icon: 'facebook',
    requiredFields: [
      {
        id: 'enable_facebook_automation',
        label: 'האם להפעיל אוטומציה כשליד נכנס מפייסבוק?',
        type: 'checkbox',
        defaultValue: false
      },
      {
        id: 'facebook_lead_message',
        label: 'איזה הודעה תרצה שהלקוח יקבל בוואטסאפ לאחר שהוא משאיר את הפרטים כליד?',
        type: 'textarea',
        placeholder: 'שלום! תודה שהשארת פרטים בפייסבוק. אנחנו שמחים שפנית אלינו ונחזור אליך בהקדם.',
        supportAI: true,
        showWhen: {
          field: 'enable_facebook_automation',
          value: true
        }
      }
    ]
  },
  {
    id: 2,
    title: 'אוטומציית ליד מטיק טוק',
    description: 'אוטומציה להפעלה כאשר ליד נכנס מטיק טוק',
    category: 'leads',
    icon: 'video',
    requiredFields: [
      {
        id: 'enable_tiktok_automation',
        label: 'האם להפעיל אוטומציה כשליד נכנס מטיק טוק?',
        type: 'checkbox',
        defaultValue: false
      },
      {
        id: 'tiktok_lead_message',
        label: 'איזה הודעה תרצה שהלקוח יקבל בוואטסאפ לאחר שהוא משאיר את הפרטים כליד?',
        type: 'textarea',
        placeholder: 'שלום! תודה שהשארת פרטים בטיק טוק. אנחנו שמחים שפנית אלינו ונחזור אליך בהקדם.',
        supportAI: true,
        showWhen: {
          field: 'enable_tiktok_automation',
          value: true
        }
      }
    ]
  },
  {
    id: 3,
    title: 'אוטומציית ליד מהאתר',
    description: 'אוטומציה להפעלה כאשר ליד נכנס מהאתר',
    category: 'leads',
    icon: 'globe',
    requiredFields: [
      {
        id: 'enable_website_automation',
        label: 'האם להפעיל אוטומציה כשליד נכנס מהאתר?',
        type: 'checkbox',
        defaultValue: false
      },
      {
        id: 'website_lead_message',
        label: 'איזה הודעה תרצה שהלקוח יקבל בוואטסאפ לאחר שהוא משאיר את הפרטים כליד?',
        type: 'textarea',
        placeholder: 'שלום! תודה שהשארת פרטים באתר שלנו. אנחנו שמחים שפנית אלינו ונחזור אליך בהקדם.',
        supportAI: true,
        showWhen: {
          field: 'enable_website_automation',
          value: true
        }
      }
    ]
  },
  {
    id: 4,
    title: 'אוטומציית עסקה נסגרת',
    description: 'אוטומציה להפעלה כאשר עסקה נסגרת',
    category: 'sales',
    icon: 'check-circle',
    requiredFields: [
      {
        id: 'deal_closed_message',
        label: 'איזה הודעת וואטסאפ לשלוח ללקוח כשנסגרת עסקה?',
        type: 'textarea',
        placeholder: 'שלום! תודה שבחרת בנו. אנחנו שמחים לבשר לך שהעסקה נסגרה בהצלחה ונשמח לעמוד לשירותך.',
        supportAI: true
      }
    ]
  },
  {
    id: 5,
    title: 'אוטומציית לקוח לא מעוניין',
    description: 'אוטומציה להפעלה כאשר לקוח עובר לסטטוס לא מעוניין',
    category: 'clients',
    icon: 'x-circle',
    requiredFields: [
      {
        id: 'not_interested_message',
        label: 'איזה הודעה הלקוח יקבל אחרי שבועיים מעבר לסטטוס לא מעוניין?',
        type: 'textarea',
        placeholder: 'שלום! עברו שבועיים מאז שדיברנו. רצינו לבדוק האם חל שינוי ואתה מעוניין לשמוע עוד על השירותים שלנו?',
        supportAI: true
      }
    ]
  },
  {
    id: 6,
    title: 'אוטומציית וואטסאפ ישיר',
    description: 'אוטומציה להפעלה בקמפיין וואטסאפ הודעות ישיר',
    category: 'marketing',
    icon: 'message-circle',
    requiredFields: [
      {
        id: 'enable_whatsapp_direct',
        label: 'האם להפעיל אוטומציה בקמפיין וואטסאפ הודעות ישיר?',
        type: 'checkbox',
        defaultValue: false
      },
      {
        id: 'whatsapp_template_message',
        label: 'איזה הודעה אנחנו מקבלים קודם מהלקוח? (הודעת תבנית)',
        type: 'textarea',
        placeholder: 'אני מעוניין לשמוע עוד על השירותים שלכם',
        supportAI: true,
        showWhen: {
          field: 'enable_whatsapp_direct',
          value: true
        }
      },
      {
        id: 'whatsapp_response_message',
        label: 'איזה הודעת וואטסאפ לשלוח ללקוח בתגובה?',
        type: 'textarea',
        placeholder: 'שלום! תודה שפנית אלינו. נשמח לספר לך עוד על השירותים שלנו. מתי נוח לך לשוחח?',
        supportAI: true,
        showWhen: {
          field: 'enable_whatsapp_direct',
          value: true
        }
      }
    ]
  },
  {
    id: 7,
    title: 'התראות פנימיות לצוות',
    description: 'התראות פנימיות לצוות כאשר ליד לא מטופל',
    category: 'leads',
    icon: 'alert-triangle',
    requiredFields: [
      {
        id: 'team_notification_message',
        label: 'איזה הודעה תשלח לצוות ברגע שעבר 24 שעות ואף אחד לא טיפל בליד?',
        type: 'textarea',
        placeholder: 'שימו לב! ליד לא טופל במשך 24 שעות. אנא טפלו בהקדם.',
        supportAI: true
      }
    ]
  },
  {
    id: 8,
    title: 'אוטומציית קביעת פגישה',
    description: 'אוטומציה להפעלה כאשר נקבעת פגישה',
    category: 'sales',
    icon: 'calendar',
    requiredFields: [
      {
        id: 'meeting_scheduled_message',
        label: 'איזה הודעה הלקוח יקבל כשנקבעה פגישה?',
        type: 'textarea',
        placeholder: 'שלום! הפגישה נקבעה בהצלחה. נשמח לראותך ביום {date} בשעה {time}.',
        supportAI: true
      },
      {
        id: 'meeting_reminder_24h',
        label: 'הודעת תזכורת 24 שעות לפני הפגישה',
        type: 'textarea',
        placeholder: 'שלום! רק להזכיר שמחר בשעה {time} יש לנו פגישה. מחכים לראותך!',
        supportAI: true
      },
      {
        id: 'meeting_reminder_1h',
        label: 'תזכורת שעה לפני הפגישה',
        type: 'textarea',
        placeholder: 'שלום! הפגישה שלנו מתחילה בעוד כשעה. להתראות בקרוב!',
        supportAI: true
      }
    ]
  }
];