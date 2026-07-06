import { z } from 'zod';

export const ChatRequestSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(3).max(2000),
  language: z.enum(['en', 'kn', 'hi']).default('en'),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const SourceCitationSchema = z.object({
  label: z.string(),
  reference: z.string(),
  confidence: z.number().min(0).max(1),
});
export type SourceCitation = z.infer<typeof SourceCitationSchema>;

export const ChartSpecSchema = z.object({
  type: z.enum(['line', 'bar', 'pie', 'area']),
  title: z.string(),
  data: z.array(z.record(z.union([z.string(), z.number()]))),
});
export type ChartSpec = z.infer<typeof ChartSpecSchema>;

export const ChatResponseSchema = z.object({
  conversationId: z.string().uuid(),
  answer: z.string(),
  sql: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  citations: z.array(SourceCitationSchema),
  followUps: z.array(z.string()),
  chart: ChartSpecSchema.nullable(),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
