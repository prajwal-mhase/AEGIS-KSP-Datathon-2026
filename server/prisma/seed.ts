import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/modules/auth/token.service.js';

const prisma = new PrismaClient();

const districts = [
  ['Bengaluru Urban', 'Cubbon Park PS', 12.976, 77.599],
  ['Mysuru', 'Lashkar PS', 12.311, 76.649],
  ['Mangaluru', 'Bunder PS', 12.871, 74.843],
  ['Belagavi', 'Market PS', 15.849, 74.497],
  ['Kalaburagi', 'University PS', 17.329, 76.835],
] as const;

const categories = ['THEFT', 'CYBERCRIME', 'FRAUD', 'NARCOTICS', 'TRAFFIC', 'ASSAULT'] as const;
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@aegis.local' },
    update: {},
    create: {
      name: 'AEGIS Administrator',
      email: 'admin@aegis.local',
      passwordHash: await hashPassword('AegisAdmin!2026'),
      role: 'ADMIN',
    },
  });

  for (let index = 0; index < 120; index += 1) {
    const [district, station, baseLat, baseLng] = districts[index % districts.length]!;
    const occurredAt = new Date();
    occurredAt.setDate(occurredAt.getDate() - index);
    await prisma.crimeIncident.upsert({
      where: { firNumber: `KSP-${String(index + 1).padStart(5, '0')}` },
      update: {},
      create: {
        firNumber: `KSP-${String(index + 1).padStart(5, '0')}`,
        title: `${categories[index % categories.length]} incident under review`,
        description: `Verified FIR record imported for analytics validation in ${district}.`,
        category: categories[index % categories.length],
        severity: severities[index % severities.length],
        status: index % 5 === 0 ? 'UNDER_INVESTIGATION' : index % 7 === 0 ? 'CHARGESHEETED' : 'OPEN',
        district,
        station,
        latitude: baseLat + (index % 9) * 0.004,
        longitude: baseLng + (index % 7) * 0.004,
        occurredAt,
        investigatingOfficer: `Officer ${1000 + index}`,
      },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
