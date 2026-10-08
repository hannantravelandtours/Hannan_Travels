"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

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

  // Check if attendance already exists for this registration & date
  const existing = await prisma.attendanceRecord.findFirst({
    where: {
      registrationId: data.registrationId,
      date: new Date(data.date),
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
        date: new Date(data.date),
        status: data.status,
        markedBy: session.user.id,
        isOneOnOne: true,
      },
    });
  }

  return { success: true };
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

  return prisma.attendanceRecord.findMany({
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
export async function getTeacherOneOnOneStudents(teacherId: string) {
  return prisma.registration.findMany({
    where: {
      isOneOnOne: true,
      teacherSlots: {
        some: {
          teacher: {
            userId: teacherId
          }
        }
      },
      status: {
        in: ["ACTIVE", "PENDING_ADMIN_CONFIRMATION"]
      }
    },
    include: {
      student: {
        include: { user: true }
      },
      course: true,
      teacherSlots: true
    }
  });
}
