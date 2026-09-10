"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DAY_ORDER: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

// --------------------------------------------------------
// 1. OneOnOne Plans & Packages Management
// --------------------------------------------------------

export async function getOneOnOnePlans(courseId?: string) {
  try {
    const existingCount = await prisma.oneOnOnePlan.count();

    // Auto-seed default packages if none exist yet
    if (existingCount === 0) {
      const defaultPlans = [
        { title: "2 Classes / Week", classesPerWeek: 2, defaultPrice: 35 },
        { title: "3 Classes / Week", classesPerWeek: 3, defaultPrice: 50 },
        { title: "5 Classes / Week", classesPerWeek: 5, defaultPrice: 75 },
        { title: "6 Classes / Week", classesPerWeek: 6, defaultPrice: 85 },
      ];

      for (const p of defaultPlans) {
        await prisma.oneOnOnePlan.create({
          data: {
            title: p.title,
            classesPerWeek: p.classesPerWeek,
            defaultPrice: p.defaultPrice,
            currency: "USD",
          },
        });
      }
    }

    const plans = await prisma.oneOnOnePlan.findMany({
      where: courseId
        ? { OR: [{ courseId }, { courseId: null }] }
        : {},
      include: {
        course: true,
        teacherFees: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { classesPerWeek: "asc" },
    });

    return { success: true, plans };
  } catch (error) {
    console.error("Error fetching 1-on-1 plans:", error);
    return { success: false, plans: [] };
  }
}

export async function createOneOnOnePlan(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const classesPerWeek = parseInt(formData.get("classesPerWeek") as string);
    const defaultPrice = parseFloat(formData.get("defaultPrice") as string);
    const currency = (formData.get("currency") as string) || "USD";
    const courseId = (formData.get("courseId") as string) || null;

    if (!title || isNaN(classesPerWeek) || isNaN(defaultPrice)) {
      return { error: "Please fill in Title, Classes Per Week, and Default Monthly Price." };
    }

    await prisma.oneOnOnePlan.create({
      data: {
        title,
        classesPerWeek,
        defaultPrice,
        currency,
        courseId: courseId === "" ? null : courseId,
      },
    });

    revalidatePath("/admin/one-on-one");
    revalidatePath("/register/student");
    return { success: true };
  } catch (error) {
    console.error("Error creating 1-on-1 plan:", error);
    return { error: "Failed to create package plan." };
  }
}

export async function deleteOneOnOnePlan(planId: string) {
  try {
    await prisma.oneOnOnePlan.delete({
      where: { id: planId },
    });
    revalidatePath("/admin/one-on-one");
    revalidatePath("/register/student");
    return { success: true };
  } catch (error) {
    console.error("Error deleting plan:", error);
    return { error: "Failed to delete plan." };
  }
}

// --------------------------------------------------------
// 2. Teacher Custom 1-on-1 Fee Rates Management
// --------------------------------------------------------

export async function setTeacherPlanFee(formData: FormData) {
  try {
    const teacherId = formData.get("teacherId") as string;
    const planId = formData.get("planId") as string;
    const monthlyFee = parseFloat(formData.get("monthlyFee") as string);
    const currency = (formData.get("currency") as string) || "USD";

    if (!teacherId || !planId || isNaN(monthlyFee)) {
      return { error: "Teacher, Plan, and Monthly Fee are required." };
    }

    await prisma.teacherOneOnOneFee.upsert({
      where: {
        teacherId_planId: {
          teacherId,
          planId,
        },
      },
      update: {
        monthlyFee,
        currency,
      },
      create: {
        teacherId,
        planId,
        monthlyFee,
        currency,
      },
    });

    revalidatePath("/admin/one-on-one");
    revalidatePath("/register/student");
    return { success: true };
  } catch (error) {
    console.error("Error setting teacher plan fee:", error);
    return { error: "Failed to update teacher pricing rate." };
  }
}

export async function getAllTeacherCustomFees() {
  try {
    const fees = await prisma.teacherOneOnOneFee.findMany({
      include: {
        teacher: {
          include: { user: true },
        },
        plan: true,
      },
    });
    return { success: true, fees };
  } catch (error) {
    console.error("Error fetching teacher fees:", error);
    return { success: false, fees: [] };
  }
}

// --------------------------------------------------------
// 3. Time Slots Management (2:00 PM - 11:59 PM, 30-min intervals)
// --------------------------------------------------------

export async function getAvailableSlotsForTeacher(teacherProfileId: string) {
  try {
    const slots = await prisma.teacherSlot.findMany({
      where: {
        teacherId: teacherProfileId,
        isBooked: false,
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });

    slots.sort((a, b) => {
      const dayA = DAY_ORDER[a.dayOfWeek] || 8;
      const dayB = DAY_ORDER[b.dayOfWeek] || 8;
      if (dayA !== dayB) return dayA - dayB;
      return a.startTime.localeCompare(b.startTime);
    });

    return { success: true, slots };
  } catch (error) {
    console.error("Error fetching teacher slots:", error);
    return { success: false, error: "Failed to fetch teacher slots", slots: [] };
  }
}

export async function getTeacherSlotsByUserId(userId: string) {
  try {
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!teacherProfile) {
      return { success: false, error: "Teacher profile not found", slots: [] };
    }

    const slots = await prisma.teacherSlot.findMany({
      where: { teacherId: teacherProfile.id },
      include: {
        registrations: {
          include: {
            student: {
              include: { user: true },
            },
            course: true,
          },
        },
      },
    });

    slots.sort((a, b) => {
      const dayA = DAY_ORDER[a.dayOfWeek] || 8;
      const dayB = DAY_ORDER[b.dayOfWeek] || 8;
      if (dayA !== dayB) return dayA - dayB;
      return a.startTime.localeCompare(b.startTime);
    });

    return { success: true, slots, teacherProfileId: teacherProfile.id };
  } catch (error) {
    console.error("Error fetching teacher slots:", error);
    return { success: false, error: "Failed to fetch slots", slots: [] };
  }
}

export async function createTeacherSlot(formData: FormData) {
  try {
    const teacherProfileId = formData.get("teacherId") as string;
    const userId = formData.get("userId") as string;
    const dayOfWeek = formData.get("dayOfWeek") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    let targetTeacherProfileId = teacherProfileId;

    if (!targetTeacherProfileId && userId) {
      const profile = await prisma.teacherProfile.findUnique({
        where: { userId },
      });
      if (profile) {
        targetTeacherProfileId = profile.id;
      }
    }

    if (!targetTeacherProfileId || !dayOfWeek || !startTime || !endTime) {
      return { error: "All fields are required (Teacher, Day, Start Time, End Time)." };
    }

    // Check 2:00 PM to 11:59 PM restriction (14:00 - 23:59)
    const [startH] = startTime.split(":").map(Number);
    if (startH < 14) {
      return { error: "Time slots must be scheduled between 2:00 PM (14:00) and 11:59 PM." };
    }

    // Check existing
    const existing = await prisma.teacherSlot.findFirst({
      where: {
        teacherId: targetTeacherProfileId,
        dayOfWeek,
        startTime,
        endTime,
      },
    });

    if (existing) {
      return { error: "This time slot already exists." };
    }

    await prisma.teacherSlot.create({
      data: {
        teacherId: targetTeacherProfileId,
        dayOfWeek,
        startTime,
        endTime,
        isBooked: false,
      },
    });

    revalidatePath("/teacher/one-on-one");
    revalidatePath("/admin/one-on-one");

    return { success: true };
  } catch (error) {
    console.error("Error creating slot:", error);
    return { error: "Failed to create slot." };
  }
}

export async function deleteTeacherSlot(slotId: string) {
  try {
    const slot = await prisma.teacherSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) return { error: "Slot not found." };
    if (slot.isBooked) return { error: "Cannot delete a slot that is already booked by a student." };

    await prisma.teacherSlot.delete({
      where: { id: slotId },
    });

    revalidatePath("/teacher/one-on-one");
    revalidatePath("/admin/one-on-one");
    return { success: true };
  } catch (error) {
    console.error("Error deleting slot:", error);
    return { error: "Failed to delete slot." };
  }
}

// --------------------------------------------------------
// 4. Timetable & Confirmation Queries
// --------------------------------------------------------

export async function getOneOnOneAdminTimetable() {
  try {
    const registrations = await prisma.registration.findMany({
      where: {
        isOneOnOne: true,
      },
      include: {
        student: {
          include: { user: true },
        },
        course: true,
        oneOnOnePlan: true,
        teacherSlot: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
        teacherSlots: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    const teacherProfiles = await prisma.teacherProfile.findMany({
      include: { user: true },
    });
    const teacherMap = new Map(teacherProfiles.map((t) => [t.id, t.user.name]));

    const formatted = registrations.map((r) => {
      const preferredTeacherName = r.preferredTeacherId
        ? teacherMap.get(r.preferredTeacherId) || "Any Teacher"
        : "Not specified";

      const allSlots = r.teacherSlots && r.teacherSlots.length > 0
        ? r.teacherSlots
        : r.teacherSlot ? [r.teacherSlot] : [];

      return {
        ...r,
        preferredTeacherName,
        allSlots,
      };
    });

    formatted.sort((a, b) => {
      const firstSlotA = a.allSlots[0];
      const firstSlotB = b.allSlots[0];

      const dayA = firstSlotA ? DAY_ORDER[firstSlotA.dayOfWeek] || 99 : 100;
      const dayB = firstSlotB ? DAY_ORDER[firstSlotB.dayOfWeek] || 99 : 100;
      if (dayA !== dayB) return dayA - dayB;

      const timeA = firstSlotA ? firstSlotA.startTime : "99:99";
      const timeB = firstSlotB ? firstSlotB.startTime : "99:99";
      return timeA.localeCompare(timeB);
    });

    return { success: true, registrations: formatted };
  } catch (error) {
    console.error("Error fetching 1-on-1 admin timetable:", error);
    return { success: false, registrations: [] };
  }
}

export async function confirmOneOnOneRegistration(registrationId: string) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { teacherSlot: true, teacherSlots: true },
    });

    if (!registration) {
      return { error: "Registration record not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: registrationId },
        data: { status: "ACTIVE" },
      });

      // Mark single slot booked if linked
      if (registration.teacherSlotId) {
        await tx.teacherSlot.update({
          where: { id: registration.teacherSlotId },
          data: { isBooked: true },
        });
      }

      // Mark all multi-slots booked if linked
      if (registration.teacherSlots && registration.teacherSlots.length > 0) {
        for (const slot of registration.teacherSlots) {
          await tx.teacherSlot.update({
            where: { id: slot.id },
            data: { isBooked: true },
          });
        }
      }
    });

    revalidatePath("/admin/one-on-one");
    revalidatePath("/admin/students");
    revalidatePath("/teacher/one-on-one");
    revalidatePath("/student/one-on-one");

    return { success: true };
  } catch (error) {
    console.error("Error confirming 1-on-1 registration:", error);
    return { error: "Failed to confirm registration." };
  }
}

export async function getOneOnOneTeacherTimetable(userId: string) {
  try {
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!teacherProfile) {
      return { success: false, error: "Teacher profile not found.", registrations: [] };
    }

    const registrations = await prisma.registration.findMany({
      where: {
        isOneOnOne: true,
        OR: [
          { teacherSlots: { some: { teacherId: teacherProfile.id } } },
          { teacherSlot: { teacherId: teacherProfile.id } },
          { preferredTeacherId: teacherProfile.id },
        ],
      },
      include: {
        student: {
          include: { user: true },
        },
        course: true,
        oneOnOnePlan: true,
        teacherSlot: true,
        teacherSlots: true,
      },
    });

    const formatted = registrations.map((r) => {
      const allSlots = r.teacherSlots && r.teacherSlots.length > 0
        ? r.teacherSlots
        : r.teacherSlot ? [r.teacherSlot] : [];

      return {
        ...r,
        allSlots,
      };
    });

    formatted.sort((a, b) => {
      const firstSlotA = a.allSlots[0];
      const firstSlotB = b.allSlots[0];

      const dayA = firstSlotA ? DAY_ORDER[firstSlotA.dayOfWeek] || 99 : 100;
      const dayB = firstSlotB ? DAY_ORDER[firstSlotB.dayOfWeek] || 99 : 100;
      if (dayA !== dayB) return dayA - dayB;

      const timeA = firstSlotA ? firstSlotA.startTime : "99:99";
      const timeB = firstSlotB ? firstSlotB.startTime : "99:99";
      return timeA.localeCompare(timeB);
    });

    return { success: true, registrations: formatted, teacherProfileId: teacherProfile.id };
  } catch (error) {
    console.error("Error fetching teacher timetable:", error);
    return { success: false, registrations: [] };
  }
}

export async function getOneOnOneStudentSchedule(userId: string) {
  try {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      return { success: false, error: "Student profile not found.", registrations: [] };
    }

    const registrations = await prisma.registration.findMany({
      where: {
        studentId: studentProfile.id,
        isOneOnOne: true,
      },
      include: {
        course: true,
        oneOnOnePlan: true,
        teacherSlot: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
        teacherSlots: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    const formatted = registrations.map((r) => {
      const allSlots = r.teacherSlots && r.teacherSlots.length > 0
        ? r.teacherSlots
        : r.teacherSlot ? [r.teacherSlot] : [];

      return {
        ...r,
        allSlots,
      };
    });

    return { success: true, registrations: formatted };
  } catch (error) {
    console.error("Error fetching student 1-on-1 schedule:", error);
    return { success: false, registrations: [] };
  }
}
