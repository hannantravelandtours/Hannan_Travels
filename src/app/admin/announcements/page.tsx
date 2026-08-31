export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  const batches = await prisma.batch.findMany({
    select: { id: true, name: true, course: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  const teachers = await prisma.teacherProfile.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { user: { name: "asc" } },
  });

  return (
    <AnnouncementsClient 
      announcements={announcements} 
      batches={batches} 
      teachers={teachers} 
    />
  );
}
