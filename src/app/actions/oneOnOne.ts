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

// Get available (unbooked) time slots for a specific teacher profile
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

    // Custom sort by day of week
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

// Get all slots created by a teacher (both booked and unbooked)
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

// Create a new time slot for a teacher
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

    // Check overlap or duplicates
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

// Delete an unbooked time slot
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

// Admin: Get all 1-on-1 registrations sorted chronologically by timetable
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
        teacherSlot: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    // Also fetch preferred teachers if teacherSlot is not assigned yet
    const teacherProfiles = await prisma.teacherProfile.findMany({
      include: { user: true },
    });
    const teacherMap = new Map(teacherProfiles.map((t) => [t.id, t.user.name]));

    const formatted = registrations.map((r) => {
      const preferredTeacherName = r.preferredTeacherId ? teacherMap.get(r.preferredTeacherId) || "Any Teacher" : "Not specified";
      return {
        ...r,
        preferredTeacherName,
      };
    });

    // Chronological timetable sorting (Monday 00:00 -> Sunday 23:59)
    formatted.sort((a, b) => {
      const dayA = a.teacherSlot ? DAY_ORDER[a.teacherSlot.dayOfWeek] || 99 : 100;
      const dayB = b.teacherSlot ? DAY_ORDER[b.teacherSlot.dayOfWeek] || 99 : 100;
      if (dayA !== dayB) return dayA - dayB;

      const timeA = a.teacherSlot ? a.teacherSlot.startTime : "99:99";
      const timeB = b.teacherSlot ? b.teacherSlot.startTime : "99:99";
      return timeA.localeCompare(timeB);
    });

    return { success: true, registrations: formatted };
  } catch (error) {
    console.error("Error fetching 1-on-1 admin timetable:", error);
    return { success: false, registrations: [] };
  }
}

// Admin action: Confirm/Approve 1-on-1 Registration
export async function confirmOneOnOneRegistration(registrationId: string) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { teacherSlot: true },
    });

    if (!registration) {
      return { error: "Registration record not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: registrationId },
        data: { status: "ACTIVE" },
      });

      if (registration.teacherSlotId) {
        await tx.teacherSlot.update({
          where: { id: registration.teacherSlotId },
          data: { isBooked: true },
        });
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

// Teacher action: Get 1-on-1 timetable for specific teacher
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
          { teacherSlot: { teacherId: teacherProfile.id } },
          { preferredTeacherId: teacherProfile.id },
        ],
      },
      include: {
        student: {
          include: { user: true },
        },
        course: true,
        teacherSlot: true,
      },
    });

    registrations.sort((a, b) => {
      const dayA = a.teacherSlot ? DAY_ORDER[a.teacherSlot.dayOfWeek] || 99 : 100;
      const dayB = b.teacherSlot ? DAY_ORDER[b.teacherSlot.dayOfWeek] || 99 : 100;
      if (dayA !== dayB) return dayA - dayB;

      const timeA = a.teacherSlot ? a.teacherSlot.startTime : "99:99";
      const timeB = b.teacherSlot ? b.teacherSlot.startTime : "99:99";
      return timeA.localeCompare(timeB);
    });

    return { success: true, registrations, teacherProfileId: teacherProfile.id };
  } catch (error) {
    console.error("Error fetching teacher timetable:", error);
    return { success: false, registrations: [] };
  }
}

// Student action: Get 1-on-1 schedule for specific student
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
        teacherSlot: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    return { success: true, registrations };
  } catch (error) {
    console.error("Error fetching student 1-on-1 schedule:", error);
    return { success: false, registrations: [] };
  }
}
