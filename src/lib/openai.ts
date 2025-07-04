import OpenAI from 'openai';

// Load the API key from the environment.
// We do not provide a fallback to avoid leaking credentials in the client.
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OpenAI API key. Set OPENAI_API_KEY in your environment.');
}

// Client initialisation. "dangerouslyAllowBrowser" was removed to prevent
// exposing the key when the code is bundled for the browser.
const openai = new OpenAI({ apiKey });

// Rate limit counter - in production this would be in a database
let requestCount = 0;
const MAX_REQUESTS = 20; // Example limit per hour
const RESET_INTERVAL = 1000 * 60 * 60; // 1 hour

// Reset counter periodically
setInterval(() => {
  requestCount = 0;
}, RESET_INTERVAL);

export async function generateTextWithAI(prompt: string, style: string) {
  // Rate limiting
  if (requestCount >= MAX_REQUESTS) {
    throw new Error('מגבלת השימוש השעתית הושגה. נסה שוב מאוחר יותר');
  }
  
  try {
    requestCount++;
    
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `אתה עוזר כתיבה מקצועי. עליך לנסח הודעות שיווקיות בעברית לפי הסגנון המבוקש. הטקסט חייב להיות בעברית ולהתאים לסגנון: ${style}`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o",
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text with AI:', error);
    throw error;
  }
}