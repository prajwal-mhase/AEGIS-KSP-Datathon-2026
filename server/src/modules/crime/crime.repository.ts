import { Prisma } from '@prisma/client';
import type { CrimeFilter } from '@aegis/shared';
import { prisma } from '../../lib/prisma.js';

const whereFromFilter = (filter: CrimeFilter, scope?: { district?: string | null; station?: string | null }) => {
  const where: Prisma.CrimeIncidentWhereInput = {};
  if (scope?.district) where.district = scope.district;
  if (scope?.station) where.station = scope.station;
  if (filter.district) where.district = filter.district;
  if (filter.station) where.station = filter.station;
  if (filter.category) where.category = filter.category;
  if (filter.severity) where.severity = filter.severity;
  if (filter.from || filter.to) {
    where.occurredAt = {
      ...(filter.from ? { gte: new Date(filter.from) } : {}),
      ...(filter.to ? { lte: new Date(filter.to) } : {}),
    };
  }
  if (filter.search) {
    where.OR = [
      { firNumber: { contains: filter.search, mode: 'insensitive' } },
      { title: { contains: filter.search, mode: 'insensitive' } },
      { description: { contains: filter.search, mode: 'insensitive' } },
    ];
  }
  return where;
};

const serializeIncident = (incident: {
  id: string;
  firNumber: string;
  title: string;
  category: 'THEFT' | 'ASSAULT' | 'CYBERCRIME' | 'NARCOTICS' | 'TRAFFIC' | 'FRAUD' | 'PUBLIC_ORDER' | 'WOMEN_CHILD_SAFETY' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  district: string;
  station: string;
  occurredAt: Date;
  latitude: Prisma.Decimal;
  longitude: Prisma.Decimal;
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'CHARGESHEETED' | 'CLOSED';
}) => ({
  ...incident,
  occurredAt: incident.occurredAt.toISOString(),
  latitude: incident.latitude.toNumber(),
  longitude: incident.longitude.toNumber(),
});

export class CrimeRepository {
  async list(filter: CrimeFilter, scope?: { district?: string | null; station?: string | null }) {
    const where = whereFromFilter(filter, scope);
    const [items, total] = await prisma.$transaction([
      prisma.crimeIncident.findMany({
        where,
        orderBy: { occurredAt: 'desc' },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
      prisma.crimeIncident.count({ where }),
    ]);

    return { items: items.map(serializeIncident), page: filter.page, pageSize: filter.pageSize, total };
  }

  async recent(limit = 8) {
    const items = await prisma.crimeIncident.findMany({ orderBy: { occurredAt: 'desc' }, take: limit });
    return items.map(serializeIncident);
  }
}

export const crimeRepository = new CrimeRepository();
