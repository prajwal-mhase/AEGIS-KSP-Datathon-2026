import { z } from 'zod';

export const CrimeCategorySchema = z.enum([
  'THEFT',
  'ASSAULT',
  'CYBERCRIME',
  'NARCOTICS',
  'TRAFFIC',
  'FRAUD',
  'PUBLIC_ORDER',
  'WOMEN_CHILD_SAFETY',
  'OTHER',
]);
export type CrimeCategory = z.infer<typeof CrimeCategorySchema>;

export const CrimeSeveritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type CrimeSeverity = z.infer<typeof CrimeSeveritySchema>;

export const CrimeIncidentSchema = z.object({
  id: z.string().uuid(),
  firNumber: z.string(),
  title: z.string(),
  category: CrimeCategorySchema,
  severity: CrimeSeveritySchema,
  district: z.string(),
  station: z.string(),
  occurredAt: z.string().datetime(),
  latitude: z.number(),
  longitude: z.number(),
  status: z.enum(['OPEN', 'UNDER_INVESTIGATION', 'CHARGESHEETED', 'CLOSED']),
});
export type CrimeIncident = z.infer<typeof CrimeIncidentSchema>;

export const CrimeFilterSchema = z.object({
  district: z.string().optional(),
  station: z.string().optional(),
  category: CrimeCategorySchema.optional(),
  severity: CrimeSeveritySchema.optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});
export type CrimeFilter = z.infer<typeof CrimeFilterSchema>;
