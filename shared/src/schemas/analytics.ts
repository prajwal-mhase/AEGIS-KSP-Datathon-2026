import { z } from 'zod';
import { CrimeCategorySchema, CrimeSeveritySchema } from './crime.js';

export const AnalyticsFilterSchema = z.object({
  district: z.string().optional(),
  station: z.string().optional(),
  category: CrimeCategorySchema.optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
export type AnalyticsFilter = z.infer<typeof AnalyticsFilterSchema>;

export const KpiSchema = z.object({
  totalIncidents: z.number().int(),
  activeInvestigations: z.number().int(),
  criticalIncidents: z.number().int(),
  sevenDayTrendPct: z.number(),
});
export type Kpi = z.infer<typeof KpiSchema>;

export const CategoryBreakdownSchema = z.object({
  category: CrimeCategorySchema,
  count: z.number().int(),
});
export type CategoryBreakdown = z.infer<typeof CategoryBreakdownSchema>;

export const SeverityBreakdownSchema = z.object({
  severity: CrimeSeveritySchema,
  count: z.number().int(),
});
export type SeverityBreakdown = z.infer<typeof SeverityBreakdownSchema>;

export const GeoPointSchema = z.object({
  id: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  weight: z.number().min(0),
  category: CrimeCategorySchema,
  district: z.string(),
  occurredAt: z.string().datetime(),
});
export type GeoPoint = z.infer<typeof GeoPointSchema>;
