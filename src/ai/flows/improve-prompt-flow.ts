
'use server';

/**
 * @fileOverview Prompt Optimizer flow for Fortuna AI using OpenRouter.
 */

import { getOpenRouterClient, DEFAULT_MODEL } from '@/lib/openrouter';

export interface ImprovePromptInput {
  prompt: string;
}

export async function improvePrompt(input: ImprovePromptInput): Promise<string> {
  try {
    const openrouter = getOpenRouterClient();
    const prompt = `Rewrite the following simple request into a professional, highly effective AI prompt: "${input.prompt}"
    
    Provide ONLY the optimized prompt text without any introductory or concluding remarks.`;

    const completion = await openrouter.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are a world-class Prompt Engineer. Your goal is to transform basic requests into structured, professional prompts.' },
        { role: 'user', content: prompt }
      ]
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      throw new Error('Prompt optimization failed');
    }

    console.log("SUCCESS:", result);
    return result;
  } catch (error) {
    console.error("FULL ERROR:", error);
    return `AI Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
