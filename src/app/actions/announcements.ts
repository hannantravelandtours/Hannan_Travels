"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const targetType = formData.get("targetType") as string;
    const targetId = formData.get("targetId") as string;

    if (!title || !message || !targetType) {
      return { error: "Title, message, and target are required." };
    }

    await prisma.announcement.create({
      data: {
        title,
        message,
        targetType,
        targetId: targetId || null,
        createdBy: "Admin",
      },
    });

    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { error: "Failed to create announcement." };
  }
}

export async function updateAnnouncement(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const targetType = formData.get("targetType") as string;
    const targetId = formData.get("targetId") as string;

    await prisma.announcement.update({
      where: { id },
      data: {
        title,
        message,
        targetType,
        targetId: targetId || null,
      },
    });

    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update announcement." };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete announcement." };
  }
}

export async function getAnnouncementsForTeacher(teacherProfileId: string) {
  try {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherProfileId },
      include: { batches: { select: { id: true } } },
    });

    if (!teacher) return [];

    const batchIds = teacher.batches.map(b => b.id);

    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { targetType: "ALL_TEACHERS" },
          { targetType: "TEACHER", targetId: teacherProfileId },
          { targetType: "ALL_BATCHES" },
          ...batchIds.map(bid => ({ targetType: "BATCH" as string, targetId: bid })),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return announcements;
  } catch (error) {
    return [];
  }
}

export async function getAnnouncementsForStudent(studentProfileId: string) {
  try {
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        registrations: {
          where: { status: "ACTIVE" },
          select: { batchId: true },
        },
      },
    });

    if (!student) return [];

    const batchIds = student.registrations
      .map(r => r.batchId)
      .filter((id): id is string => id !== null);

    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { targetType: "ALL_BATCHES" },
          ...batchIds.map(bid => ({ targetType: "BATCH" as string, targetId: bid })),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return announcements;
  } catch (error) {
    return [];
  }
}
