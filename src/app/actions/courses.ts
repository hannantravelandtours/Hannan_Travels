"use server";

import { prisma } from "@/lib/prisma";
import { CourseCategory } from "@prisma/client";

export async function getActiveCourses(category?: CourseCategory) {
  try {
    // 1. Auto-seed logic to ensure 4 static courses always exist
    const staticIds = ["qaida", "nazra", "hifz", "hajj-umrah"];
    const existingCount = await prisma.course.count({
      where: { id: { in: staticIds } }
    });

    if (existingCount !== 4) {
      const staticCourses = [
        { id: "qaida", name: "Noorani Qaida", category: "QAIDA" as any, bannerImage: "/Qaidabanner.webp" },
        { id: "nazra", name: "Nazra Quran", category: "NAZRA" as any, bannerImage: "/Nazra_Hifzbanner.webp" },
        { id: "hifz", name: "Hifz Quran", category: "HIFZ" as any, bannerImage: "/Nazra_Hifzbanner.webp" },
        { id: "hajj-umrah", name: "Hajj & Umrah Guide", category: "ISLAMIC_STUDIES" as any, bannerImage: "/hajj_umrahGuide.webp" },
      ];

      for (const c of staticCourses) {
        await prisma.course.upsert({
          where: { id: c.id },
          update: { name: c.name, category: c.category, bannerImage: c.bannerImage, isActive: true },
          create: { id: c.id, name: c.name, category: c.category, bannerImage: c.bannerImage, description: "Static Course", isActive: true },
        });
      }

      // Cleanup old dynamic courses
      await prisma.course.deleteMany({
        where: { id: { notIn: staticIds } }
      });
    }

    // 2. Fetch courses
    const courses = await prisma.course.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      select: {
        id: true,
        name: true,
        subtitle: true,
        bannerImage: true,
        category: true,
        description: true,
        batches: {
          include: {
            teacher: {
              include: { user: true }
            }
          }
        }
      }
    });
    return courses;
  } catch (error) {
    console.error("Failed to get courses:", error);
    return [];
  }
}

export async function getTeachersForCourse(courseId: string) {
  try {
    // Find all batches for this course to get the teachers
    const batches = await prisma.batch.findMany({
      where: {
        courseId,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    // Extract unique teachers
    const teachersMap = new Map();
    batches.forEach(batch => {
      if (!teachersMap.has(batch.teacherId)) {
        teachersMap.set(batch.teacherId, {
          id: batch.teacherId,
          name: batch.teacher.user.name,
          qualification: batch.teacher.qualification,
          bio: batch.teacher.bio,
        });
      }
    });

    return Array.from(teachersMap.values());
  } catch (error) {
    console.error("Failed to get teachers:", error);
    return [];
  }
}

export async function getCourseDetails(courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        subtitle: true,
        bannerImage: true,
        category: true,
        description: true,
        isActive: true,
        batches: {
          include: {
            teacher: {
              include: { user: true }
            }
          }
        }
      }
    });
    return course;
  } catch (error) {
    console.error("Failed to get course details:", error);
    return null;
  }
}
