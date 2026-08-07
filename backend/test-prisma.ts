import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const deleted = await prisma.curso.findMany({ where: { deletedAt: { not: null } } });
  console.log("DELETED COUNT:", deleted.length);
  const active = await prisma.curso.findMany({ where: { deletedAt: null } });
  console.log("ACTIVE COUNT:", active.length);
}
main();
