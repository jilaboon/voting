import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.eventState.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      registrationOpen: true,
      votingOpen: false,
    },
  });
  console.log('EventState singleton ensured.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
