"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Mark attendance for 1-on-1 students
 */
export async function markOneOnOneAttendance(data: {
  registrationId: string;
  studentId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  // Parse YYYY-MM-DD cleanly in UTC (midday to eliminate timezone drift)
  const [year, month, day] = data.date.split("-").map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  // Check if attendance already exists for this registration & date
  const existing = await prisma.attendanceRecord.findFirst({
    where: {
      registrationId: data.registrationId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      isOneOnOne: true,
    },
  });

  if (existing) {
    // Update
    await prisma.attendanceRecord.update({
      where: { id: existing.id },
      data: {
        status: data.status,
        markedBy: session.user.id,
      },
    });
  } else {
    // Create
    await prisma.attendanceRecord.create({
      data: {
        registrationId: data.registrationId,
        studentId: data.studentId,
        date: targetDate,
        status: data.status,
        markedBy: session.user.id,
        isOneOnOne: true,
      },
    });
  }

  return { success: true };
}

/**
 * Get all 1-on-1 attendance records for a teacher's students (across all dates)
 */
export async function getTeacherAllOneOnOneAttendance(teacherUserId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: teacherUserId }
  });

  if (!teacherProfile) return [];

  // Find all registrations for this teacher
  const registrations = await prisma.registration.findMany({
    where: {
      isOneOnOne: true,
      OR: [
        { teacherSlots: { some: { teacherId: teacherProfile.id } } },
        { teacherSlot: { teacherId: teacherProfile.id } },
        { preferredTeacherId: teacherProfile.id }
      ]
    },
    select: { id: true, studentId: true }
  });

  const regIds = registrations.map(r => r.id);
  const studentIds = registrations.map(r => r.studentId);

  if (regIds.length === 0) return [];

  return prisma.attendanceRecord.findMany({
    where: {
      isOneOnOne: true,
      OR: [
        { registrationId: { in: regIds } },
        { studentId: { in: studentIds }, markedBy: teacherUserId }
      ]
    },
    orderBy: {
      date: "asc"
    }
  });
}

/**
 * Get 1-on-1 attendance records for a specific teacher's registrations
 */
export async function getTeacherOneOnOneAttendance(teacherId: string, date: string) {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  return prisma.attendanceRecord.findMany({
    where: {
      isOneOnOne: true,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      registration: {
        teacherSlots: {
          some: {
            teacher: {
              userId: teacherId
            }
          }
        }
      }
    },
    include: {
      registration: {
        include: {
          student: {
            include: { user: true }
          }
        }
      }
    }
  });
}

/**
 * Get all 1-on-1 attendance (Admin)
 */
export async function getAllOneOnOneAttendance(date: string) {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const records = await prisma.attendanceRecord.findMany({
    where: {
      isOneOnOne: true,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      }
    },
    include: {
      registration: {
        include: {
          student: {
            include: { user: true }
          },
          course: true,
          oneOnOnePlan: true,
          teacherSlots: {
            include: {
              teacher: {
                include: { user: true }
              }
            }
          }
        }
      }
    }
  });

  // Collect any preferredTeacherIds where teacherSlots is empty
  const missingTeacherIds = records
    .map(r => r.registration?.preferredTeacherId)
    .filter((id): id is string => Boolean(id));

  const preferredTeachers = missingTeacherIds.length > 0
    ? await prisma.teacherProfile.findMany({
        where: { id: { in: missingTeacherIds } },
        include: { user: true }
      })
    : [];

  const teacherMap = new Map(preferredTeachers.map(t => [t.id, t.user.name]));

  return records.map(r => {
    const reg = r.registration;
    const fallbackTeacherName = reg?.preferredTeacherId ? teacherMap.get(reg.preferredTeacherId) : null;
    return {
      ...r,
      fallbackTeacherName,
    };
  });
}

/**
 * Get a specific student's 1-on-1 attendance
 */
export async function getStudentOneOnOneAttendance(studentProfileId: string) {
  return prisma.attendanceRecord.findMany({
    where: {
      isOneOnOne: true,
      studentId: studentProfileId
    },
    orderBy: {
      date: "desc"
    },
    include: {
      registration: {
        include: {
          course: true
        }
      }
    }
  });
}

/**
 * Get all 1-on-1 students for a specific teacher
 */
export async function getTeacherOneOnOneStudents(teacherUserId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: teacherUserId }
  });

  if (!teacherProfile) return [];

  return prisma.registration.findMany({
    where: {
      isOneOnOne: true,
      OR: [
        { teacherSlots: { some: { teacherId: teacherProfile.id } } },
        { teacherSlot: { teacherId: teacherProfile.id } },
        { preferredTeacherId: teacherProfile.id }
      ],
      status: {
        in: ["ACTIVE", "PENDING_ADMIN_CONFIRMATION"]
      }
    },
    include: {
      student: {
        include: { user: true }
      },
      course: true,
      teacherSlots: true,
      teacherSlot: true,
    }
  });
}
