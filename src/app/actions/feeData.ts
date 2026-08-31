"use server";

import { prisma } from "@/lib/prisma";

export async function getCoursesWithBatchPrices() {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      include: {
        batches: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true,
            classesPerWeek: true,
            daysOfWeek: true,
            time: true,
            teacher: {
              include: { user: { select: { name: true } } }
            }
          }
        }
      },
      orderBy: { name: "asc" }
    });
    return courses;
  } catch (error) {
    console.error("Failed to get courses with batch prices:", error);
    return [];
  }
}
