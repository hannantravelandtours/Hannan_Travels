"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLiveLink(batchId: string, link: string, title?: string, date?: string) {
  try {
    await prisma.batch.update({
      where: { id: batchId },
      data: { 
        liveClassLink: link,
        linkHistory: {
          create: { 
            url: link,
            title: title || null,
            date: date ? new Date(date) : null
          }
        }
      }
    });
    revalidatePath("/teacher/classes");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update link" };
  }
}

export async function markAttendance(batchId: string, records: { studentId: string, status: string }[]) {
  try {
    // We assume markAttendance is called once per day per batch.
    // In a real app we might check if attendance for today is already marked.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dataToInsert = records.map(r => ({
      batchId,
      studentId: r.studentId,
      date: today,
      status: r.status,
      markedBy: "Teacher", // ideally teacher's userId
    }));

    await prisma.attendanceRecord.createMany({
      data: dataToInsert
    });

    revalidatePath(`/teacher/classes/${batchId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to mark attendance" };
  }
}
