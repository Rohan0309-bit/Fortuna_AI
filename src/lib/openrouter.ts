
import OpenAI from "openai";

/**
 * OpenRouter Client getter.
 * Using a getter prevents the application from crashing during module evaluation
 * if the environment variable is missing.
 */
let client: OpenAI | null = null;

export function getOpenRouterClient() {
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    // Fallback to avoid constructor crash, actual error will surface on request
    client = new OpenAI({
      apiKey: apiKey || "MISSING_API_KEY",
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://fortuna-ai.example.com",
        "X-Title": "Fortuna AI",
      }
    });
  }
  return client;
}

// Using DeepSeek Chat as the default high-performance model
export const DEFAULT_MODEL = "deepseek/deepseek-chat";
