
'use server';

/**
 * @fileOverview Summarization flow for Fortuna AI using OpenRouter.
 */

import { getOpenRouterClient, DEFAULT_MODEL } from '@/lib/openrouter';

export interface SummarizeInput {
  text: string;
  mode: 'quick' | 'detailed' | 'bullets';
}

export interface SummarizeOutput {
  summary: string;
}

export async function summarizeText(input: SummarizeInput): Promise<SummarizeOutput> {
  try {
    const openrouter = getOpenRouterClient();
    const modeInstructions = {
      quick: '1-2 concise, high-impact sentences.',
      detailed: 'A comprehensive paragraph covering all main points and nuances.',
      bullets: 'A structured list of the most critical key takeaways.'
    };

    const prompt = `
      Analyze the following text and provide a summary based on the requested mode: ${input.mode}.
      
      Mode instructions: ${modeInstructions[input.mode]}

      Text to summarize:
      ${input.text}
    `;

    const completion = await openrouter.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are a professional summarizer. Provide accurate, clean summaries.' },
        { role: 'user', content: prompt }
      ]
    });

    const summary = completion.choices[0]?.message?.content || 'Failed to generate summary.';

    console.log("SUCCESS:", summary);
    return { summary };
  } catch (error) {
    console.error("FULL ERROR:", error);
    return {
      summary: `AI Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
