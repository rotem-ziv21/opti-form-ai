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
    id: 18,
    title: 'העלאת דאטה קיימת',
    description: 'העלאת נתונים קיימים מקבצי אקסל או CSV',
    category: 'general',
    icon: 'upload',
    requiredFields: [
      {
        id: 'data_file',
        label: 'העלאת קובץ נתונים',
        type: 'file',
        accept: '.csv, .xlsx, .xls',
        required: true,
        description: 'ניתן להעלות קבצי CSV או Excel. הקובץ חייב לכלול לפחות שם ומספר טלפון.'
      },
      {
        id: 'send_welcome_message',
        label: 'לשלוח הודעת ברוכים הבאים לכל הלקוחות החדשים?',
        type: 'checkbox',
        defaultValue: true
      },
      {
        id: 'welcome_message',
        label: 'הודעת ברוכים הבאים',
        type: 'textarea',
        placeholder: 'היי [שם], ברוך הבא למערכת שלנו! אנו שמחים שהצטרפת ונשמח לעדכן אותך בחדשות ומבצעים מיוחדים. אם יש לך שאלות, אל תהסס לפנות אלינו!',
        supportAI: true,
        showWhen: {
          field: 'send_welcome_message',
          value: true
        }
      },
      {
        id: 'data_mapping',
        label: 'מיפוי שדות הנתונים',
        type: 'textarea',
        placeholder: 'שם: עמודה A\nטלפון: עמודה B\nדואר אלקטרוני: עמודה C',
        required: true,
        description: 'ציין איזה עמודה בקובץ מתאימה לכל שדה במערכת'
      },
      {
        id: 'skip_duplicates',
        label: 'לדלג על רשומות כפולות',
        type: 'checkbox',
        defaultValue: true
      }
    ]
  },
  {
    id: 17,
    title: 'בוט ביטול ואי הגעה לפגישה',
    description: 'טיפול אוטומטי בביטולי פגישות ואי הגעה',
    category: 'meetings',
    icon: 'calendar-x',
    requiredFields: [
      {
        id: 'enable_cancellation_bot',
        label: 'הפעלת בוט ביטול פגישות',
        type: 'checkbox',
        defaultValue: true
      },
      {
        id: 'cancellation_message',
        label: 'הודעה ללקוח בעת ביטול פגישה',
        type: 'textarea',
        placeholder: 'היי [שם], אנו מאשרים את ביטול הפגישה שלך בתאריך [תאריך] בשעה [שעה]. נשמח לקבוע פגישה חדשה בקישור הבא: [קישור לתיאום]',
        supportAI: true,
        showWhen: {
          field: 'enable_cancellation_bot',
          value: true
        }
      },
      {
        id: 'enable_no_show_bot',
        label: 'הפעלת בוט אי הגעה לפגישה',
        type: 'checkbox',
        defaultValue: true
      },
      {
        id: 'no_show_message',
        label: 'הודעה ללקוח לאחר אי הגעה לפגישה',
        type: 'textarea',
        placeholder: 'היי [שם], שמנו לב שלא הצלחת להגיע לפגישה שלנו היום. אם ברצונך לקבוע פגישה חדשה, אנא לחץ כאן: [קישור לתיאום]',
        supportAI: true,
        showWhen: {
          field: 'enable_no_show_bot',
          value: true
        }
      },
      {
        id: 'reschedule_window_days',
        label: 'חלון זמן לתיאום מחדש (ימים)',
        type: 'number',
        placeholder: '7',
        defaultValue: 7,
        required: true
      }
    ]
  },
  {
    id: 16,
    title: 'הסרה אוטומטית מרשימת תפוצה',
    description: 'הסרה אוטומטית של לקוחות לא פעילים מרשימת התפוצה',
    category: 'marketing',
    icon: 'user-x',
    requiredFields: [
      {
        id: 'inactive_days_threshold',
        label: 'לאחר כמה ימים ללא תגובה יוסר הלקוח מהרשימה?',
        type: 'number',
        placeholder: '180',
        defaultValue: 180,
        required: true
      },
      {
        id: 'last_chance_message',
        label: 'הודעת הזדמנות אחרונה לפני הסרה',
        type: 'textarea',
        placeholder: 'היי [שם], שמנו לב שלא הייתה תגובה מצדך להודעות שלנו בתקופה האחרונה. אם אתה עדיין מעוניין לקבל מאיתנו עדכונים, אנא השב להודעה זו. אחרת, נסיר אותך מרשימת התפוצה שלנו בתוך 7 ימים.',
        supportAI: true,
        required: true
      },
      {
        id: 'removal_confirmation',
        label: 'הודעת אישור הסרה למנהל המערכת',
        type: 'textarea',
        placeholder: 'הלקוח [שם הלקוח] הוסר אוטומטית מרשימת התפוצה לאחר [מספר ימים] ימים ללא תגובה.',
        supportAI: true,
        required: true
      }
    ]
  },
  {
    id: 15,
    title: 'משוב בווצאפ לאחר שירות',
    description: 'שליחת הודעת ווצאפ לבקשת משוב לאחר שירות',
    category: 'clients',
    icon: 'message-square',
    requiredFields: [
      {
        id: 'days_after_service',
        label: 'לאחר כמה ימים מסיום השירות תישלח הודעת המשוב?',
        type: 'number',
        placeholder: '3',
        defaultValue: 3,
        required: true
      },
      {
        id: 'feedback_message',
        label: 'הודעת בקשת משוב',
        type: 'textarea',
        placeholder: 'היי [שם], תודה שבחרת בשירותים שלנו. נשמח לשמוע את המשוב שלך על השירות שקיבלת. אנא דרג אותנו מ-1 עד 5 כאשר 5 הוא הטוב ביותר. תודה!',
        supportAI: true,
        required: true
      },
      {
        id: 'enable_review_request',
        label: 'לבקש גם ביקורת בגוגל מלקוחות מרוצים?',
        type: 'checkbox',
        defaultValue: false
      },
      {
        id: 'google_review_message',
        label: 'הודעת בקשת ביקורת בגוגל',
        type: 'textarea',
        placeholder: 'תודה רבה על המשוב החיובי! נשמח מאוד אם תוכל להשאיר לנו ביקורת גם בגוגל: [קישור לביקורת]',
        supportAI: true,
        showWhen: {
          field: 'enable_review_request',
          value: true
        }
      }
    ]
  },
  {
    id: 19,
    title: 'חבר מביא חבר',
    description: 'שליחת הודעה ללקוחות שסגרו עסקה להביא חברים/קולגות',
    category: 'clients',
    icon: 'users',
    requiredFields: [
      {
        id: 'days_after_won',
        label: 'לאחר כמה ימים מסגירת עסקה תישלח ההודעה?',
        type: 'number',
        placeholder: '14',
        defaultValue: 14,
        required: true
      },
      {
        id: 'referral_message',
        label: 'הודעה לבקשת הפניה מחבר/קולגה',
        type: 'textarea',
        placeholder: 'היי [שם], מקווים שאתה נהנה מהמוצר/שירות שלנו! האם יש לך חבר או קולגה שהמוצר שלנו יכול להתאים לו? על כל הפניה שתסגור עבורנו, תקבל [פרטי ההטבה].',
        supportAI: true,
        required: true
      },
      {
        id: 'referral_benefit',
        label: 'הטבה ללקוח המפנה',
        type: 'text',
        placeholder: 'הנחה של 10% על החידוש הבא / שובר מתנה בשווי 100 ש"ח',
        required: true
      }
    ]
  },
  {
    id: 14,
    title: 'מכירה חוזרת ללקוחות קיימים',
    description: 'שליחת הצעה אוטומטית לאחר תקופה מוגדרת',
    category: 'clients',
    icon: 'repeat',
    requiredFields: [
      {
        id: 'days_after_purchase',
        label: 'לאחר כמה ימים מרכישה תישלח ההצעה החוזרת?',
        type: 'number',
        placeholder: '90',
        defaultValue: 90,
        required: true
      },
      {
        id: 'repeat_sale_message',
        label: 'הודעת הצעה חוזרת ללקוחות קיימים',
        type: 'textarea',
        placeholder: 'היי [שם], מקווים שאתה נהנה מהמוצר/שירות שלנו! רצינו לעדכן אותך שיש לנו הצעה מיוחדת עבורך כלקוח נאמן: [פרטי ההצעה]. נשמח לעזור!',
        supportAI: true,
        required: true
      }
    ]
  },
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
      },
      {
        id: 'days_until_offer',
        label: 'לאחר כמה ימים תישלח הצעה אוטומטית בווצאפ?',
        type: 'number',
        placeholder: '14',
        defaultValue: 14,
        required: true
      },
      {
        id: 'custom_offer_message',
        label: 'הודעת הצעה שיווקית מותאמת ללקוח שאמר "לא מעוניין"',
        type: 'textarea',
        placeholder: 'היי [שם], מבינים שבפעם הקודמת הטיימינג לא היה מתאים. רצינו להציע לך הצעה מיוחדת שמותאמת בדיוק לצרכים שלך: [פרטי ההצעה]. מה דעתך?',
        supportAI: true,
        required: true
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