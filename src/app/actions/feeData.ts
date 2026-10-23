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

export async function getOneOnOneFeePlans() {
  try {
    const plans = await prisma.oneOnOnePlan.findMany({
      orderBy: { classesPerWeek: "asc" }
    });

    if (plans.length > 0) {
      return plans.map(p => ({
        id: p.id,
        title: p.title,
        classesPerWeek: p.classesPerWeek,
        defaultPrice: Number(p.defaultPrice),
        currency: p.currency || "USD",
      }));
    }

    // Default fallback plans if database has none seeded
    return [
      { id: "plan-2", title: "2 Classes / Week", classesPerWeek: 2, defaultPrice: 35, currency: "USD" },
      { id: "plan-3", title: "3 Classes / Week", classesPerWeek: 3, defaultPrice: 50, currency: "USD" },
      { id: "plan-5", title: "5 Classes / Week", classesPerWeek: 5, defaultPrice: 75, currency: "USD" },
    ];
  } catch (error) {
    console.error("Failed to get 1-on-1 plans:", error);
    return [
      { id: "plan-2", title: "2 Classes / Week", classesPerWeek: 2, defaultPrice: 35, currency: "USD" },
      { id: "plan-3", title: "3 Classes / Week", classesPerWeek: 3, defaultPrice: 50, currency: "USD" },
      { id: "plan-5", title: "5 Classes / Week", classesPerWeek: 5, defaultPrice: 75, currency: "USD" },
    ];
  }
}
