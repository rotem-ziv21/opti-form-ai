import OpenAI from 'openai';

// Get the API key from environment variables
// Make sure to create a .env file with VITE_OPENAI_API_KEY set
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // This is needed for client-side usage
});

export async function generateMessageContent(
  businessInfo: string,
  automationCategory: string = '',
  automationTitle: string = '',
  automationDescription: string = '',
  writingStyle: string = 'professional',
  includeEmojis: boolean = false
): Promise<string> {
  try {
    // Define writing style instructions based on selected style
    let styleInstruction = '';
    switch(writingStyle) {
      case 'professional':
        styleInstruction = 'מקצועי ורשמי, עם שפה עסקית ברורה';
        break;
      case 'casual':
        styleInstruction = 'קליל וידידותי, כאילו אתה משוחח עם חבר';
        break;
      case 'funny':
        styleInstruction = 'מצחיק והומוריסטי, עם נימה קלילה ומשעשעת';
        break;
      case 'sensitive':
        styleInstruction = 'רגיש ואמפתי, עם הבנה לצרכי הלקוח';
        break;
      case 'formal':
        styleInstruction = 'רשמי ומכובד, מתאים לתקשורת עסקית ברמה גבוהה';
        break;
      default:
        styleInstruction = 'מקצועי ורשמי, עם שפה עסקית ברורה';
    }
    
    // Emoji instruction
    const emojiInstruction = includeEmojis 
      ? 'שלב אימוג׳ים מתאימים בהודעה כדי להוסיף עניין ויזואלי' 
      : 'אל תשתמש באימוג׳ים בהודעה';

    const prompt = `
      אתה עוזר כתיבה מקצועי שמסייע בכתיבת הודעות שיווקיות עבור מערכת אוטומציה שיווקית.
      
      מידע על העסק וקהל היעד:
      ${businessInfo}
      
      קטגוריית האוטומציה: ${automationCategory || 'לא צוין'}
      כותרת האוטומציה: ${automationTitle || 'לא צוין'}
      תיאור האוטומציה: ${automationDescription || 'לא צוין'}
      
      סגנון כתיבה: ${styleInstruction}
      ${emojiInstruction}
      
      אנא כתוב הודעה שיווקית אפקטיבית שמתאימה לאוטומציה זו ולקהל היעד.
      ההודעה צריכה להיות בעברית, בטון שמתאים לסגנון הכתיבה שנבחר, ולכלול:
      1. פנייה אישית (אם רלוונטי)
      2. הצגת הערך המרכזי
      3. קריאה לפעולה ברורה
      
      אורך ההודעה צריך להיות בין 3-5 משפטים.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Using GPT-4.1 (gpt-4-turbo is the API name for GPT-4.1)
      messages: [
        { role: "system", content: "אתה עוזר כתיבה מקצועי המתמחה בכתיבת הודעות שיווקיות בעברית. אתה מומחה בשיווק דיגיטלי ואוטומציות שיווק. אתה מבין היטב את השוק הישראלי ויודע להתאים את המסרים לקהל היעד המקומי. המטרה שלך היא ליצור תוכן שיווקי אפקטיבי שיוביל להמרות ומכירות." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw new Error('Failed to generate content');
  }
}
