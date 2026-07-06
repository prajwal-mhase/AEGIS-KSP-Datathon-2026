import { useQuery } from '@tanstack/react-query';
import type { CategoryBreakdown, ChatResponse, CrimeIncident, GeoPoint, Kpi, Paginated } from '@aegis/shared';
import { api, queryString } from '../../lib/api';

export const useDashboardData = (district?: string) => {
  const qs = queryString({ district });
  const suffix = qs ? `?${qs}` : '';
  const overview = useQuery({ queryKey: ['overview', district], queryFn: () => api<Kpi>(`/api/analytics/overview${suffix}`) });
  const categories = useQuery({
    queryKey: ['categories', district],
    queryFn: () => api<CategoryBreakdown[]>(`/api/analytics/categories${suffix}`),
  });
  const trends = useQuery({
    queryKey: ['trends', district],
    queryFn: () => api<Array<{ date: string; count: number }>>(`/api/analytics/trends${suffix}`),
  });
  const geo = useQuery({ queryKey: ['geo', district], queryFn: () => api<GeoPoint[]>(`/api/analytics/geo${suffix}`) });
  const incidents = useQuery({
    queryKey: ['incidents', district],
    queryFn: () => api<Paginated<CrimeIncident>>(`/api/crimes?${queryString({ district, pageSize: '8' })}`),
  });
  return { overview, categories, trends, geo, incidents };
};

export const sendChat = (message: string, language: 'en' | 'kn' | 'hi' = 'en', conversationId?: string) =>
  api<ChatResponse>('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, language, conversationId }),
  });
