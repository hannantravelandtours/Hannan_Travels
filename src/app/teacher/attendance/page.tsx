export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TeacherAttendanceClient } from "./TeacherAttendanceClient";

export default async function TeacherAttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div>Please log in</div>;
  }

  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      batches: {
        include: {
          course: true,
          registrations: {
            where: { status: "ACTIVE" },
            include: {
              student: {
                include: { user: { select: { name: true } } }
              }
            }
          },
          attendance: {
            orderBy: { date: "desc" },
            take: 100,
          }
        },
      },
    },
  });

  return <TeacherAttendanceClient batches={teacher?.batches || []} teacherUserId={session.user.id} />;
}
