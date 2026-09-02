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
