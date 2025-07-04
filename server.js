const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set.');
}
const openai = new OpenAI({ apiKey });

app.post('/api/generate-message', async (req, res) => {
  const { businessInfo, automationCategory = '', automationTitle = '', automationDescription = '', writingStyle = 'professional', includeEmojis = false } = req.body;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  try {
    let styleInstruction = '';
    switch (writingStyle) {
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
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'אתה עוזר כתיבה מקצועי המתמחה בכתיבת הודעות שיווקיות בעברית. אתה מומחה בשיווק דיגיטלי ואוטומציות שיווק.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content?.trim() || '';
    res.json({ content });
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
