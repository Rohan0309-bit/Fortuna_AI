
'use server';

/**
 * @fileOverview Chat flow for Fortuna AI using OpenRouter.
 */

import { getOpenRouterClient, DEFAULT_MODEL } from '@/lib/openrouter';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatInput {
  history?: { role: 'user' | 'assistant'; content: string }[];
  message: string;
}

export async function generateChatResponse(input: ChatInput): Promise<string> {
  try {
    const openrouter = getOpenRouterClient();
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are Fortuna AI, a premium productivity assistant. Be helpful, direct, intelligent, creative, and concise. Use Markdown formatting when useful.'
      },
      ...(input.history || []).map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.content
      })),
      { role: 'user', content: input.message }
    ];

    const completion = await openrouter.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: messages as any,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No content returned from OpenRouter');
    }

    console.log("SUCCESS:", responseText);
    return responseText;
  } catch (error) {
    console.error("FULL ERROR:", error);
    return `AI Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
