import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const registrations = await prisma.registration.findMany({
    include: { student: { include: { user: true } } }
  });
  console.log("Total registrations:", registrations.length);
  registrations.forEach(r => {
    console.log(`- ${r.student?.user?.name} (Status: ${r.status})`);
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
