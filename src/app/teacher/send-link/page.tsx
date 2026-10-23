export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SendLinkClient from "./SendLinkClient";

export default async function TeacherSendLinkPage() {
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
          _count: { select: { registrations: true } },
        },
      },
    },
  });

  const oneOnOneRegistrations = teacher?.id
    ? await prisma.registration.findMany({
        where: {
          isOneOnOne: true,
          status: "ACTIVE",
          OR: [
            { teacherSlots: { some: { teacherId: teacher.id } } },
            { preferredTeacherId: teacher.id },
          ],
        },
        include: {
          student: { include: { user: true } },
          course: true,
          oneOnOnePlan: true,
          teacherSlots: true,
        },
      })
    : [];

  return (
    <SendLinkClient
      batches={teacher?.batches || []}
      oneOnOneRegistrations={oneOnOneRegistrations}
      teacherUserId={session.user.id}
    />
  );
}
