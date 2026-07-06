import type { CrimeCategory } from '@aegis/shared';

export type CrimeIntent =
  | { kind: 'trend'; district?: string; category?: CrimeCategory }
  | { kind: 'categoryBreakdown'; district?: string }
  | { kind: 'recent'; district?: string; category?: CrimeCategory }
  | { kind: 'hotspots'; district?: string };

const categoryAliases: Array<[CrimeCategory, RegExp]> = [
  ['CYBERCRIME', /\b(cyber|online|phishing|digital)\b/i],
  ['THEFT', /\b(theft|robbery|stolen|burglary)\b/i],
  ['NARCOTICS', /\b(drug|narcotic|ganja)\b/i],
  ['TRAFFIC', /\b(traffic|accident|vehicle)\b/i],
  ['FRAUD', /\b(fraud|scam|cheating)\b/i],
  ['ASSAULT', /\b(assault|attack|hurt)\b/i],
  ['WOMEN_CHILD_SAFETY', /\b(women|child|pocso|dowry)\b/i],
  ['PUBLIC_ORDER', /\b(public order|riot|unrest)\b/i],
];

const districts = [
  'Bengaluru Urban',
  'Bengaluru Rural',
  'Mysuru',
  'Mangaluru',
  'Belagavi',
  'Hubballi-Dharwad',
  'Kalaburagi',
  'Shivamogga',
];

export class IntentService {
  detect(message: string): CrimeIntent {
    const category = categoryAliases.find(([, regex]) => regex.test(message))?.[0];
    const district = districts.find((candidate) => message.toLowerCase().includes(candidate.toLowerCase()));
    const context = {
      ...(district ? { district } : {}),
      ...(category ? { category } : {}),
    };

    if (/\b(trend|increase|decrease|over time|month|week)\b/i.test(message)) return { kind: 'trend', ...context };
    if (/\b(category|breakdown|type|distribution)\b/i.test(message)) return { kind: 'categoryBreakdown', ...(district ? { district } : {}) };
    if (/\b(map|hotspot|heat|location|where)\b/i.test(message)) return { kind: 'hotspots', ...(district ? { district } : {}) };
    return { kind: 'recent', ...context };
  }
}

export const intentService = new IntentService();
