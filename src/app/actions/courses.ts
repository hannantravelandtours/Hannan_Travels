"use server";

import { prisma } from "@/lib/prisma";
import { CourseCategory } from "@prisma/client";
import { staticCoursesData } from "@/data/staticCourses";

export async function getActiveCourses(category?: CourseCategory) {
  try {
    // 1. Direct fetch of active courses for maximum speed
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
        },
        oneOnOnePlans: {
          select: {
            id: true,
            title: true,
            classesPerWeek: true,
            defaultPrice: true,
            currency: true,
          }
        }
      }
    });

    // If courses already exist in DB, return them immediately
    if (courses && courses.length > 0) {
      return courses.map((course) => ({
        ...course,
        bannerImage: staticCoursesData[course.id]?.bannerImage || course.bannerImage,
        thumbnailImage: staticCoursesData[course.id]?.thumbnailImage || course.bannerImage,
        oneOnOnePlans: course.oneOnOnePlans.map((p) => ({
          ...p,
          defaultPrice: Number(p.defaultPrice),
        })),
      }));
    }

    // Fallback: If DB is empty, seed 4 static courses
    const staticCourses = [
      { id: "qaida", name: "Noorani Qaida", category: "QAIDA" as any, bannerImage: "/qaida_banner_ai.png" },
      { id: "nazra", name: "Nazra Quran", category: "NAZRA" as any, bannerImage: "/nazra_banner_ai.png" },
      { id: "hifz", name: "Hifz Quran", category: "HIFZ" as any, bannerImage: "/hifz_banner_ai.png" },
      { id: "hajj-umrah", name: "Hajj & Umrah Guide", category: "ISLAMIC_STUDIES" as any, bannerImage: "/hajj_umrahGuide.webp" },
    ];

    for (const c of staticCourses) {
      await prisma.course.upsert({
        where: { id: c.id },
        update: { name: c.name, category: c.category, bannerImage: c.bannerImage, isActive: true },
        create: { id: c.id, name: c.name, category: c.category, bannerImage: c.bannerImage, description: staticCoursesData[c.id]?.desc || "Learn Quran with verified native scholars.", isActive: true },
      });
    }

    return staticCourses.map(c => ({
      ...c,
      subtitle: "Personalized 1-on-1 Quran Classes",
      description: "Learn Quran with verified native scholars.",
      batches: [],
      oneOnOnePlans: [],
      thumbnailImage: staticCoursesData[c.id]?.thumbnailImage || c.bannerImage,
    }));
  } catch (error) {
    console.error("Failed to get courses:", error);
    // Return static courses data as graceful fallback so user is never stuck
    return [
      { id: "qaida", name: "Noorani Qaida", category: "QAIDA" as any, bannerImage: "/qaida_banner_ai.png", subtitle: "1-on-1 Basics", description: "", batches: [], oneOnOnePlans: [] },
      { id: "nazra", name: "Nazra Quran", category: "NAZRA" as any, bannerImage: "/nazra_banner_ai.png", subtitle: "Recitation & Tajweed", description: "", batches: [], oneOnOnePlans: [] },
      { id: "hifz", name: "Hifz Quran", category: "HIFZ" as any, bannerImage: "/hifz_banner_ai.png", subtitle: "Quran Memorization", description: "", batches: [], oneOnOnePlans: [] },
      { id: "hajj-umrah", name: "Hajj & Umrah Guide", category: "ISLAMIC_STUDIES" as any, bannerImage: "/hajj_umrahGuide.webp", subtitle: "Practical Guide", description: "", batches: [], oneOnOnePlans: [] },
    ];
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
    // 1. Parallel fetch of Course, 1-on-1 Plans, and Teachers with Free Slots in a single roundtrip
    let [course, plans, teachers] = await Promise.all([
      prisma.course.findUnique({
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
                include: { user: true },
              },
            },
          },
        },
      }),
      prisma.oneOnOnePlan.findMany({
        where: { courseId },
        orderBy: { classesPerWeek: "asc" },
        select: {
          id: true,
          title: true,
          classesPerWeek: true,
          defaultPrice: true,
          currency: true,
          courseId: true,
          teacherFees: {
            select: {
              teacherId: true,
              monthlyFee: true,
              currency: true,
            },
          },
        },
      }),
      prisma.teacherProfile.findMany({
        select: {
          id: true,
          bio: true,
          qualification: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          slots: {
            where: { isBooked: false },
            select: {
              id: true,
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              isBooked: true,
            },
            orderBy: [
              { dayOfWeek: "asc" },
              { startTime: "asc" },
            ],
          },
          customOneOnOneFees: {
            select: {
              planId: true,
              monthlyFee: true,
              currency: true,
            },
          },
        },
      }),
    ]);

    // Fallback: If course is not in DB yet, create it on the fly
    if (!course) {
      const staticCourses = [
        { id: "qaida", name: "Noorani Qaida", category: "QAIDA" as const, bannerImage: "/Qaidabanner.webp" },
        { id: "nazra", name: "Nazra Quran", category: "NAZRA" as const, bannerImage: "/Nazra_Hifzbanner.webp" },
        { id: "hifz", name: "Hifz Quran", category: "HIFZ" as const, bannerImage: "/Nazra_Hifzbanner.webp" },
        { id: "hajj-umrah", name: "Hajj & Umrah Guide", category: "ISLAMIC_STUDIES" as const, bannerImage: "/hajj_umrahGuide.webp" },
      ];
      const match = staticCourses.find((c) => c.id === courseId);
      if (match) {
        course = await prisma.course.upsert({
          where: { id: match.id },
          update: { isActive: true },
          create: {
            id: match.id,
            name: match.name,
            category: match.category as any,
            bannerImage: match.bannerImage,
            description: "Online 1-on-1 Quran Course",
            isActive: true,
          },
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
                  include: { user: true },
                },
              },
            },
          }
        }) as any;
      }
    }

    if (!course) return null;

    // If no course-specific plans exist in DB, look for universal plans (courseId: null)
    let finalPlans = plans;
    if (!finalPlans || finalPlans.length === 0) {
      finalPlans = await prisma.oneOnOnePlan.findMany({
        where: { courseId: null },
        orderBy: { classesPerWeek: "asc" },
        select: {
          id: true,
          title: true,
          classesPerWeek: true,
          defaultPrice: true,
          currency: true,
          courseId: true,
          teacherFees: {
            select: {
              teacherId: true,
              monthlyFee: true,
              currency: true,
            },
          },
        },
      });
    }

    if (!finalPlans) {
      finalPlans = [];
    }

    // Default template slots if teachers have none
    const defaultSlotTemplates = [
      { dayOfWeek: "Monday", startTime: "15:00", endTime: "15:30" },
      { dayOfWeek: "Monday", startTime: "17:00", endTime: "17:30" },
      { dayOfWeek: "Tuesday", startTime: "16:00", endTime: "16:30" },
      { dayOfWeek: "Tuesday", startTime: "18:00", endTime: "18:30" },
      { dayOfWeek: "Wednesday", startTime: "15:00", endTime: "15:30" },
      { dayOfWeek: "Wednesday", startTime: "17:00", endTime: "17:30" },
      { dayOfWeek: "Thursday", startTime: "16:00", endTime: "16:30" },
      { dayOfWeek: "Friday", startTime: "15:00", endTime: "15:30" },
      { dayOfWeek: "Saturday", startTime: "11:00", endTime: "11:30" },
    ];

    const teachersWithNoSlots = teachers.filter((t) => t.slots.length === 0);
    if (teachersWithNoSlots.length > 0) {
      for (const t of teachersWithNoSlots) {
        t.slots = defaultSlotTemplates.map((s, idx) => ({
          id: `slot-auto-${t.id}-${idx}`,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isBooked: false,
        })) as any;
        // Seed DB in background asynchronously
        prisma.teacherSlot.createMany({
          data: defaultSlotTemplates.map((s) => ({
            teacherId: t.id,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            isBooked: false,
          })),
        }).catch(() => {});
      }
    }

    const DAY_ORDER: Record<string, number> = {
      Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4,
      Friday: 5, Saturday: 6, Sunday: 7,
    };

    const formattedTeachers = teachers.map((teacher) => {
      const sortedSlots = [...teacher.slots].sort((a, b) => {
        const dA = DAY_ORDER[a.dayOfWeek] || 8;
        const dB = DAY_ORDER[b.dayOfWeek] || 8;
        if (dA !== dB) return dA - dB;
        return a.startTime.localeCompare(b.startTime);
      });

      return {
        id: teacher.id,
        name: teacher.user?.name || "Expert Scholar",
        email: teacher.user?.email || "",
        bio: teacher.bio || "Certified Quran Tutor with extensive online 1-on-1 teaching experience.",
        qualification: teacher.qualification || "Certified Scholar / Hafiz-e-Quran",
        slots: sortedSlots,
        customFees: teacher.customOneOnOneFees.map((cf) => ({
          planId: cf.planId,
          monthlyFee: Number(cf.monthlyFee),
          currency: cf.currency,
        })),
      };
    });

    const formattedPlans = finalPlans.map((p) => ({
      id: p.id,
      title: p.title,
      classesPerWeek: p.classesPerWeek,
      defaultPrice: Number(p.defaultPrice),
      currency: p.currency,
      courseId: (p as any).courseId || null,
      teacherFees: (p.teacherFees || []).map((tf: any) => ({
        teacherId: tf.teacherId,
        monthlyFee: Number(tf.monthlyFee),
        currency: tf.currency,
      })),
    }));

    const cleanDescription = (course.description && course.description !== "Static Course" && course.description !== "Online 1-on-1 Quran Course")
      ? course.description
      : (staticCoursesData[course.id]?.desc || course.description || "Comprehensive Islamic & Quran instruction with certified scholars.");

    return {
      ...course,
      description: cleanDescription,
      bannerImage: staticCoursesData[course.id]?.bannerImage || course.bannerImage,
      plans: formattedPlans,
      teachers: formattedTeachers,
    };
  } catch (error) {
    console.error("Failed to get course details:", error);
    return null;
  }
}
