import { randomUUID } from 'node:crypto';
import type { ChatRequest } from '@aegis/shared';
import { prisma } from '../../lib/prisma.js';
import { analyticsService } from '../analytics/analytics.service.js';
import { intentService, type CrimeIntent } from './intent.service.js';
import { aiProvider } from './ai-provider.js';

export class ChatService {
  async answer(userId: string, request: ChatRequest) {
    const conversation = request.conversationId
      ? await prisma.conversation.findFirst({ where: { id: request.conversationId, userId } })
      : await prisma.conversation.create({
          data: { userId, title: request.message.slice(0, 80) },
        });

    if (!conversation) {
      throw new Error('Conversation was not found.');
    }

    const intent = intentService.detect(request.message);
    const evidence = await this.evidence(intent);
    const answer = await aiProvider.generate({
      question: request.message,
      facts: evidence.facts,
      language: request.language,
    });

    const citations = evidence.citations;
    const confidence = Math.min(0.94, 0.62 + citations.length * 0.08);
    const sql = evidence.sql;

    await prisma.chatMessage.createMany({
      data: [
        { conversationId: conversation.id, role: 'user', content: request.message },
        {
          conversationId: conversation.id,
          role: 'assistant',
          content: answer,
          sql,
          confidence,
          citations: citations as unknown as object,
        },
      ],
    });

    return {
      conversationId: conversation.id,
      answer,
      sql,
      confidence,
      citations,
      followUps: this.followUps(intent),
      chart: evidence.chart,
    };
  }

  private async evidence(intent: CrimeIntent) {
    if (intent.kind === 'categoryBreakdown') {
      const data = await analyticsService.categories({ district: intent.district });
      return {
        facts: data.map((item) => `${item.category}: ${item.count} incidents.`),
        citations: data.slice(0, 5).map((item) => ({ label: item.category, reference: 'CrimeIncident.category group', confidence: 0.86 })),
        sql: 'select category, count(*) from "CrimeIncident" group by category order by count desc',
        chart: { type: 'bar' as const, title: 'Crime category distribution', data },
      };
    }

    if (intent.kind === 'trend') {
      const data = await analyticsService.trends({ district: intent.district, category: intent.category });
      return {
        facts: data.slice(-8).map((item) => `${item.date}: ${item.count} incidents.`),
        citations: [{ label: 'Daily incident trend', reference: 'CrimeIncident.occurredAt aggregation', confidence: 0.84 }],
        sql: 'select date_trunc(day, occurredAt), count(*) from "CrimeIncident" group by 1 order by 1',
        chart: { type: 'line' as const, title: 'Incident trend', data },
      };
    }

    if (intent.kind === 'hotspots') {
      const data = await analyticsService.geo({ district: intent.district });
      const byDistrict = new Map<string, number>();
      for (const point of data) byDistrict.set(point.district, (byDistrict.get(point.district) ?? 0) + 1);
      const facts = [...byDistrict.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([district, count]) => `${district} has ${count} mapped incidents.`);
      return {
        facts,
        citations: [{ label: 'Geocoded incidents', reference: 'CrimeIncident latitude/longitude', confidence: 0.82 }],
        sql: 'select district, latitude, longitude, severity from "CrimeIncident"',
        chart: null,
      };
    }

    const rows = await prisma.crimeIncident.findMany({
      where: {
        ...(intent.district ? { district: intent.district } : {}),
        ...(intent.category ? { category: intent.category } : {}),
      },
      orderBy: { occurredAt: 'desc' },
      take: 6,
    });
    return {
      facts: rows.map((row) => `${row.firNumber} in ${row.district}/${row.station}: ${row.title} (${row.status}).`),
      citations: rows.map((row) => ({ label: row.firNumber, reference: `CrimeIncident:${row.id}`, confidence: 0.88 })),
      sql: 'select * from "CrimeIncident" order by "occurredAt" desc limit 6',
      chart: null,
    };
  }

  private followUps(intent: CrimeIntent) {
    const id = randomUUID().slice(0, 4);
    if (intent.kind === 'hotspots') return ['Show hotspots on the map', 'Compare districts for the last 30 days', `Export hotspot evidence ${id}`];
    if (intent.kind === 'trend') return ['Break this trend down by category', 'Show the same period last year', 'Which stations contributed most?'];
    return ['Show related FIRs', 'Visualize this as a chart', 'Filter to critical severity only'];
  }
}

export const chatService = new ChatService();
