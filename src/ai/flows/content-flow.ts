
'use server';

/**
 * @fileOverview Content Studio flow for Fortuna AI using OpenRouter.
 */

import { getOpenRouterClient, DEFAULT_MODEL } from '@/lib/openrouter';

export interface ContentInput {
  type: 'story' | 'essay' | 'email' | 'linkedin' | 'poem';
  topic: string;
  instructions?: string;
}

export async function generateContent(input: ContentInput): Promise<string> {
  try {
    const openrouter = getOpenRouterClient();
    const prompt = `Generate a premium quality ${input.type} about the following topic: ${input.topic}. 
    ${input.instructions ? `Additional specific instructions: ${input.instructions}` : ''}
    
    Ensure the tone matches the content type (e.g., professional for emails, creative for stories).`;

    const completion = await openrouter.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are a professional creative writer and communications expert. Your goal is to produce high-quality, engaging, and context-appropriate content.' },
        { role: 'user', content: prompt }
      ]
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Content generation returned empty');
    }

    console.log("SUCCESS:", content);
    return content;
  } catch (error) {
    console.error("FULL ERROR:", error);
    return `AI Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
