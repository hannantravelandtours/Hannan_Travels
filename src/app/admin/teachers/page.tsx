export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { TeachersClient } from "./TeachersClient";

export default async function TeachersPage() {
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: {
      teacherProfile: {
        include: {
          batches: {
            include: {
              course: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <TeachersClient teachers={teachers} />;
}
