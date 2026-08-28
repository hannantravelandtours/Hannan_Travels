"use server";

import { prisma } from "@/lib/prisma";
import { CourseCategory } from "@prisma/client";

export async function getActiveCourses(category?: CourseCategory) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      select: {
        id: true,
        name: true,
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
