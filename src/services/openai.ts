export async function generateMessageContent(
  businessInfo: string,
  automationCategory: string = '',
  automationTitle: string = '',
  automationDescription: string = '',
  writingStyle: string = 'professional',
  includeEmojis: boolean = false
): Promise<string> {
  try {
    const response = await fetch('/api/generate-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        businessInfo,
        automationCategory,
        automationTitle,
        automationDescription,
        writingStyle,
        includeEmojis
      })
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data.content || '';
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw new Error('Failed to generate content');
  }
}
