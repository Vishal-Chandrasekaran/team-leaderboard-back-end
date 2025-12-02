import { PrismaClient } from '@prisma/client';
import { v5 as uuidv5 } from 'uuid';

const prisma = new PrismaClient();

// Namespace UUID used to deterministically generate IDs from the domain names.
// Do not change unless you want the IDs to be regenerated.
const DOMAIN_NAMESPACE = '671c3d4e-1bda-4a56-9c6f-b0a5e1d7ab00';

const DOMAIN_NAMES = [
  'React.js',
  'Node.js',
  'Python (AI)',
  'Python (Web Scraping)',
  'UI/UX Design',
  'Business Analyst',
  'Ruby on Rails',
  'PHP',
  'Android',
  'DevOps',
  'iOS',
  'Quality Assurance',
  'Human Resources',
  'Administration',
];

const DOMAIN_SEED_DATA = DOMAIN_NAMES.map((name) => ({
  id: uuidv5(name, DOMAIN_NAMESPACE),
  name,
}));

async function seedDomains() {
  console.log('↻ Seeding Domain records...');
  for (const domain of DOMAIN_SEED_DATA) {
    await prisma.domain.upsert({
      where: { id: domain.id },
      update: { name: domain.name },
      create: domain,
    });
  }
  console.log(`✅ Seeded ${DOMAIN_SEED_DATA.length} domains`);
}

async function main() {
  await seedDomains();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('❌ Seeding failed', err);
    await prisma.$disconnect();
    process.exit(1);
  });

