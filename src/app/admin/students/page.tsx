export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { StudentsClient } from "./StudentsClient";

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      studentProfile: {
        include: {
          registrations: {
            include: { 
              course: true,
              batch: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <StudentsClient students={students} />;
}
