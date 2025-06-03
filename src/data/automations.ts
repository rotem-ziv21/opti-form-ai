// No imports needed

export interface Automation {
  id: number;
  title: string;
  description: string;
  category: 'leads' | 'sales' | 'clients' | 'marketing' | 'meetings' | 'call_center' | 'general';
  icon: string;
  requiredFields: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'url' | 'multiselect' | 'checkbox' | 'radio' | 'file';
    placeholder?: string;
    options?: { value: string; label: string }[];
    defaultValue?: string | number | boolean;
    supportAI?: boolean;
    isOptional?: boolean;
    isMultiple?: boolean;
    required?: boolean;
    accept?: string;
    description?: string;
    showWhen?: {
      field: string;
      value: string | string[] | boolean;
    };
  }[];
}

export const automations: Automation[] = [
  {
    id: 10,
    title: 'תיאום פגישות',
    description: 'הגדרת פרטי פגישות שהלקוח יוכל לתאם דרך המערכת',
    category: 'meetings',
    icon: 'calendar',
    requiredFields: [
      {
        id: 'meeting_name',
        label: 'שם הפגישה שיופיע ללקוח ביומן',
        type: 'text',
        placeholder: 'דוגמה: שיחת היכרות עם [שם העסק], פגישת ייעוץ, אבחון ראשוני',
        supportAI: false,
        required: true
      },
      {
        id: 'meeting_representative',
        label: 'מי הנציג שיקבל את הפגישה?',
        type: 'text',
        placeholder: 'הנציג שיקבל את ההתראה והפגישה תישמר ביומן שלו',
        supportAI: false,
        required: true
      },
      {
        id: 'meeting_available_times',
        label: 'באילו ימים ושעות ניתן לקבוע את הפגישה?',
        type: 'text',
        placeholder: 'דוגמה: א–ה בין 10:00 ל–15:00 / רק בימי שלישי וחמישי בבוקר',
        supportAI: false,
        required: true
      },
      {
        id: 'meeting_location',
        label: 'מה מיקום הפגישה?',
        type: 'text',
        placeholder: 'כתובת מדויקת או קישור לפגישת זום',
        supportAI: false,
        required: true
      },
      {
        id: 'meeting_duration',
        label: 'מה אורך הפגישה?',
        type: 'text',
        placeholder: 'לדוגמה: 30 דקות, שעה',
        supportAI: false,
        required: true
      },
      {
        id: 'no_show_message',
        label: 'הודעה ללקוח שלא הופיע לפגישה',
        type: 'textarea',
        placeholder: 'דוגמה: היי [שם], שמנו לב שלא הצלחת להגיע לפגישת [שם הפגישה] – זה לגמרי מובן, קורה לכולם 🙂 אם עדיין רלוונטי לך – אפשר לקבוע פגישה חדשה כאן: 📅 [קישור לתיאום] אם נוח לך יותר שנחזור אליך לתיאום – שלח לנו 1 ונשמח לעזור.',
        supportAI: true,
        required: true
      },
      {
        id: 'enable_ai_scheduling',
        label: 'מאשר שימוש בסוכן בינה מלאכותית לתיאום פגישה- ידוע לי שזה בתשלום נוסף',
        type: 'checkbox',
        defaultValue: false
      }
    ]
  },
  {
    id: 11,
    title: 'מעקב אחר הצעות מחיר',
    description: 'הפעלת מעקב אוטומטי אחר הצעות מחיר וחתימה דיגיטלית',
    category: 'sales',
    icon: 'file-text',
    requiredFields: [
      {
        id: 'enable_price_quote_tracking',
        label: 'האם אתם רוצים שנפעיל עבורכם מעקב אוטומטי להצעת המחיר?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'כן' },
          { value: 'no', label: 'לא' }
        ],
        defaultValue: 'no'
      },
      {
        id: 'signed_quote_message',
        label: 'הודעה לאחר חתימה על הסכם',
        type: 'textarea',
        placeholder: 'דוגמה: היי [שם] 🙌 קיבלנו את החתימה שלך – תודה על האמון! מכאן אנחנו מתחילים – בקרוב תקבל מאיתנו [הסבר קצר על השלב הבא] ואנחנו זמינים לכל שאלה!',
        supportAI: true,
        showWhen: {
          field: 'enable_price_quote_tracking',
          value: 'yes'
        }
      }
    ]
  },
  {
    id: 12,
    title: 'אוטומציות מרכזייה',
    description: 'אוטומציות חכמות לשיחות נכנסות ויוצאות',
    category: 'call_center',
    icon: 'phone',
    requiredFields: [
      {
        id: 'missed_call_message',
        label: 'הודעה לשיחה נכנסת שלא נענתה',
        type: 'textarea',
        placeholder: 'דוגמה: היי, ראינו שהתקשרת אלינו ולא הצלחנו לענות. קיבלנו את השיחה שלך ונדאג לחזור אליך בהקדם',
        supportAI: true
      },
      {
        id: 'enable_custom_hold_music',
        label: 'מוזיקת המתנה אישית לעסק',
        type: 'file',
        accept: '.mp3',
        description: 'קובץ המתנה נעימה MP3 בלבד!'
      },
      {
        id: 'enable_auto_dialer',
        label: 'להפעיל תותח שיחות?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'כן' },
          { value: 'no', label: 'לא' }
        ],
        defaultValue: 'no'
      }
    ]
  },
  {
    id: 13,
    title: 'הערות למטמיע',
    description: 'הערות, דגשים או בקשות לפני תחילת העבודה',
    category: 'general',
    icon: 'message-square',
    requiredFields: [
      {
        id: 'implementation_notes',
        label: 'הערות למטמיע',
        type: 'textarea',
        placeholder: 'אפשר לכתוב כאן כל דבר שחשוב לכם: ניסוח, שפה, תהליכים, אנשי קשר או כל פרט קטן שעושה את ההבדל.',
        supportAI: false
      }
    ]
  },
  {
    id: 9,
    title: 'תגובה באינסטגרם + הודעה בפרטי',
    description: 'אוטומציה להפעלה כאשר מישהו מגיב לפוסט באינסטגרם עם מילות מפתח',
    category: 'marketing',
    icon: 'instagram',
    requiredFields: [
      {
        id: 'enable_instagram_automation',
        label: 'האם להפעיל אוטומציה כשמישהו מגיב לפוסט באינסטגרם?',
        type: 'checkbox',
        defaultValue: false
      },
      {
        id: 'instagram_trigger_keywords',
        label: 'מילות הפעלה לתגובה בפוסט',
        type: 'text',
        placeholder: 'לדוגמה: שולחת, רוצה, אני, לינק',
        supportAI: false,
        showWhen: {
          field: 'enable_instagram_automation',
          value: true
        }
      },
      {
        id: 'instagram_public_reply',
        label: 'תגובה פומבית לפוסט',
        type: 'textarea',
        placeholder: 'לדוגמה: שלחנו לך הודעה בפרטי 💬',
        supportAI: true,
        showWhen: {
          field: 'enable_instagram_automation',
          value: true
        }
      },
      {
        id: 'instagram_private_message',
        label: 'הודעה פרטית באינסטגרם',
        type: 'textarea',
        placeholder: 'לדוגמה: היי! 😊\n\nכמו שביקשת, הנה הקישור למדריך: [קישור]\n\nרוצה שנשלח לך פרטים נוספים או נתאם שיחה? כתוב/י לי כאן את מספר הטלפון שלך 👇',
        supportAI: true,
        showWhen: {
          field: 'enable_instagram_automation',
          value: true
        }
      },
      {
        id: 'instagram_invalid_response_message',
        label: 'הודעה למקרה של תגובה לא תקינה',
        type: 'textarea',
        placeholder: 'לדוגמה: אולי זו אני, אולי זו המערכת... 😅\n\nאבל נראה שלא קיבלנו מספר טלפון.\n\nאם בא לך שנחזור אליך – כתוב/י כאן את המספר שלך 👇',
        supportAI: true,
        showWhen: {
          field: 'enable_instagram_automation',
          value: true
        }
      },
      {
        id: 'instagram_success_response_message',
        label: 'הודעה לאחר קבלת מספר טלפון',
        type: 'textarea',
        placeholder: 'לדוגמה: תודה! קיבלנו את המספר שלך ונחזור אליך בהקדם 🙏',
        supportAI: true,
        showWhen: {
          field: 'enable_instagram_automation',
          value: true
        }
      },
      {
        id: 'enable_facebook_comments_automation',
        label: 'האם לבצע תהליך דומה גם בפייסבוק?',
        type: 'checkbox',
        defaultValue: false,
        showWhen: {
          field: 'enable_instagram_automation',
          value: true
        }
      }
    ]
  },
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