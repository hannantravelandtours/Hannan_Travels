"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendClassLink(
  batchId: string, 
  url: string, 
  teacherUserId: string,
  title?: string,
  date?: string
) {
  try {
    if (!batchId || !url) return { error: "Batch and URL are required." };

    await prisma.$transaction(async (tx) => {
      // Update the batch's current live class link
      await tx.batch.update({
        where: { id: batchId },
        data: { liveClassLink: url },
      });

      // Create link history entry
      await tx.liveLinkHistory.create({
        data: { 
          batchId, 
          url,
          title: title || null,
          date: date ? new Date(date) : null
        },
      });

      // Create class link record
      await tx.classLink.create({
        data: {
          batchId,
          url,
          sentBy: teacherUserId,
        },
      });
    });

    revalidatePath("/teacher/send-link");
    revalidatePath("/teacher/classes");
    revalidatePath("/student/classes");
    return { success: true };
  } catch (error) {
    console.error("Error sending class link:", error);
    return { error: "Failed to send class link." };
  }
}

export async function sendOneOnOneClassLink(
  registrationId: string,
  url: string,
  teacherUserId: string
) {
  try {
    if (!registrationId || !url) {
      return { error: "Registration and link URL are required." };
    }

    await prisma.registration.update({
      where: { id: registrationId },
      data: { classLink: url.trim() },
    });

    revalidatePath("/teacher/send-link");
    revalidatePath("/teacher/one-on-one");
    revalidatePath("/student");
    revalidatePath("/student/classes");
    revalidatePath("/student/one-on-one");
    return { success: true };
  } catch (error) {
    console.error("Error sending 1-on-1 class link:", error);
    return { error: "Failed to update 1-on-1 class link." };
  }
}
