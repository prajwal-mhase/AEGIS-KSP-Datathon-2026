import { Prisma } from '@prisma/client';
import type { AnalyticsFilter } from '@aegis/shared';
import { prisma } from '../../lib/prisma.js';

const whereFromFilter = (filter: AnalyticsFilter): Prisma.CrimeIncidentWhereInput => {
  const where: Prisma.CrimeIncidentWhereInput = {};
  if (filter.district) where.district = filter.district;
  if (filter.station) where.station = filter.station;
  if (filter.category) where.category = filter.category;
  if (filter.from || filter.to) {
    where.occurredAt = {
      ...(filter.from ? { gte: new Date(filter.from) } : {}),
      ...(filter.to ? { lte: new Date(filter.to) } : {}),
    };
  }
  return where;
};

export class AnalyticsService {
  async overview(filter: AnalyticsFilter) {
    const where = whereFromFilter(filter);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const [totalIncidents, activeInvestigations, criticalIncidents, currentWeek, previousWeek] = await prisma.$transaction([
      prisma.crimeIncident.count({ where }),
      prisma.crimeIncident.count({ where: { ...where, status: 'UNDER_INVESTIGATION' } }),
      prisma.crimeIncident.count({ where: { ...where, severity: 'CRITICAL' } }),
      prisma.crimeIncident.count({ where: { ...where, occurredAt: { gte: sevenDaysAgo } } }),
      prisma.crimeIncident.count({ where: { ...where, occurredAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
    ]);

    const sevenDayTrendPct = previousWeek === 0 ? (currentWeek > 0 ? 100 : 0) : ((currentWeek - previousWeek) / previousWeek) * 100;
    return { totalIncidents, activeInvestigations, criticalIncidents, sevenDayTrendPct };
  }

  async categories(filter: AnalyticsFilter) {
    const rows = await prisma.crimeIncident.groupBy({
      by: ['category'],
      where: whereFromFilter(filter),
      _count: { _all: true },
      orderBy: { _count: { category: 'desc' } },
    });
    return rows.map((row) => ({ category: row.category, count: row._count._all }));
  }

  async trends(filter: AnalyticsFilter) {
    const rows = await prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
      select date_trunc('day', "occurredAt") as day, count(*)::bigint as count
      from "CrimeIncident"
      where (${filter.district ?? null}::text is null or district = ${filter.district ?? null})
      and (${filter.station ?? null}::text is null or station = ${filter.station ?? null})
      and (${filter.category ?? null}::"CrimeCategory" is null or category = ${filter.category ?? null}::"CrimeCategory")
      group by 1
      order by 1 asc
    `;
    return rows.map((row) => ({ date: row.day.toISOString().slice(0, 10), count: Number(row.count) }));
  }

  async geo(filter: AnalyticsFilter) {
    const rows = await prisma.crimeIncident.findMany({
      where: whereFromFilter(filter),
      select: { id: true, latitude: true, longitude: true, severity: true, category: true, district: true, occurredAt: true },
      take: 5000,
      orderBy: { occurredAt: 'desc' },
    });
    const weights = { LOW: 0.35, MEDIUM: 0.55, HIGH: 0.75, CRITICAL: 1 };
    return rows.map((row) => ({
      id: row.id,
      latitude: row.latitude.toNumber(),
      longitude: row.longitude.toNumber(),
      weight: weights[row.severity],
      category: row.category,
      district: row.district,
      occurredAt: row.occurredAt.toISOString(),
    }));
  }
}

export const analyticsService = new AnalyticsService();
