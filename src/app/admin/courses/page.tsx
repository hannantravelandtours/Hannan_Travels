export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { CoursesClient } from "./CoursesClient";

export default async function CoursesPage() {
  // Ensure the 4 static courses exist in the DB
  const staticCourses = [
    { id: "qaida", name: "Noorani Qaida", category: "QAIDA" as any, bannerImage: "/qaida_banner_ai.png" },
    { id: "nazra", name: "Nazra Quran", category: "NAZRA" as any, bannerImage: "/nazra_banner_ai.png" },
    { id: "hifz", name: "Hifz Quran", category: "HIFZ" as any, bannerImage: "/hifz_banner_ai.png" },
    { id: "hajj-umrah", name: "Hajj & Umrah Guide", category: "ISLAMIC_STUDIES" as any, bannerImage: "/hajj_umrahGuide.webp" },
  ];

  for (const c of staticCourses) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: { name: c.name, category: c.category, bannerImage: c.bannerImage },
      create: { id: c.id, name: c.name, category: c.category, bannerImage: c.bannerImage, description: "Static Course", isActive: true },
    });
  }

  // Delete any other dynamic courses that are not these 4
  await prisma.course.deleteMany({
    where: {
      id: {
        notIn: ["qaida", "nazra", "hifz", "hajj-umrah"]
      }
    }
  });

  const courses = await prisma.course.findMany({
    include: {
      batches: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <CoursesClient courses={courses} />;
}
