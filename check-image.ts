import { prisma } from "./src/lib/prisma";

async function main() {
  const course = await prisma.course.findFirst({
    where: { name: "hihi" },
    orderBy: { createdAt: "desc" },
  });
  console.log("Course:", course);
}
main();
