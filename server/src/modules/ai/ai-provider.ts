import OpenAI from 'openai';
import { env } from '../../config/env.js';

export type GenerationInput = {
  question: string;
  facts: string[];
  language: 'en' | 'kn' | 'hi';
};

export interface AiProvider {
  generate(input: GenerationInput): Promise<string>;
}

export class OpenAiProvider implements AiProvider {
  private readonly client = new OpenAI({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_BASE_URL });

  async generate(input: GenerationInput) {
    const response = await this.client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are AEGIS, an evidence-focused assistant for Karnataka Police crime analytics. Answer only from supplied facts. Be concise, cite uncertainty, and do not invent records.',
        },
        {
          role: 'user',
          content: `Language: ${input.language}\nQuestion: ${input.question}\nFacts:\n${input.facts.join('\n')}`,
        },
      ],
    });

    return response.choices[0]?.message.content?.trim() || 'No answer could be generated from the available facts.';
  }
}

export class LocalEvidenceProvider implements AiProvider {
  async generate(input: GenerationInput) {
    const heading =
      input.language === 'kn'
        ? 'ಲಭ್ಯ ದಾಖಲೆಗಳ ಆಧಾರದ ಮೇಲೆ'
        : input.language === 'hi'
          ? 'उपलब्ध अभिलेखों के आधार पर'
          : 'Based on verified records';
    return `${heading}: ${input.facts.join(' ')}`;
  }
}

export const aiProvider: AiProvider = env.OPENAI_API_KEY ? new OpenAiProvider() : new LocalEvidenceProvider();
