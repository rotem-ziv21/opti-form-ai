import OpenAI from 'openai';

// Use environment variable exposed by Vite
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OpenAI API key');
}

// Initialize OpenAI client
const openai = new OpenAI({ apiKey });

export async function generateContent(
  businessInfo: string,
  automationType: string,
  automationTitle: string,
  automationDescription: string
) {
  try {
    const prompt = `
      אתה עוזר כתיבה מקצועי שמסייע בכתיבת הודעות שיווקיות עבור מערכת אוטומציה שיווקית.
      
      מידע על העסק וקהל היעד:
      ${businessInfo}
      
      סוג האוטומציה: ${automationType || 'לא צוין'}
      כותרת האוטומציה: ${automationTitle || 'לא צוין'}
      תיאור האוטומציה: ${automationDescription || 'לא צוין'}
      
      אנא כתוב הודעה שיווקית מקצועית, אישית ואפקטיבית שמתאימה לאוטומציה זו ולקהל היעד.
      ההודעה צריכה להיות בעברית, בטון אישי ומקצועי, ולכלול:
      1. פנייה אישית (אם רלוונטי)
      2. הצגת הערך המרכזי
      3. קריאה לפעולה ברורה
      
      אורך ההודעה צריך להיות בין 3-5 משפטים.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "אתה עוזר כתיבה מקצועי המתמחה בכתיבת הודעות שיווקיות בעברית." },
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
