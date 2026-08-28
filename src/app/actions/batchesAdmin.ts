"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBatch(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const courseId = formData.get("courseId") as string;
    const teacherId = formData.get("teacherId") as string;
    const daysOfWeekStr = formData.get("daysOfWeek") as string; // comma separated
    const time = formData.get("time") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const currency = formData.get("currency") as string || "USD";
    const classesPerWeek = parseInt(formData.get("classesPerWeek") as string) || 3;
    const liveClassLink = formData.get("liveClassLink") as string;
    const trialVideoUrl = formData.get("trialVideoUrl") as string;

    if (!name || !courseId || !teacherId || !daysOfWeekStr || !time) {
      return { error: "Please fill all required fields." };
    }

    const daysOfWeek = daysOfWeekStr.split(",").map(d => d.trim()).filter(Boolean);

    await prisma.batch.create({
      data: {
        name,
        courseId,
        teacherId,
        daysOfWeek,
        time,
        classesPerWeek,
        price,
        currency,
        liveClassLink: liveClassLink || null,
        trialVideoUrl: trialVideoUrl || null,
      },
    });

    revalidatePath("/admin/batches");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create batch." };
  }
}

export async function deleteBatch(id: string) {
  try {
    await prisma.batch.delete({
      where: { id },
    });
    revalidatePath("/admin/batches");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete batch. It may have registered students." };
  }
}

export async function editBatch(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const courseId = formData.get("courseId") as string;
    const teacherId = formData.get("teacherId") as string;
    const daysOfWeekStr = formData.get("daysOfWeek") as string; 
    const time = formData.get("time") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const currency = formData.get("currency") as string || "USD";
    const classesPerWeek = parseInt(formData.get("classesPerWeek") as string) || 3;
    const liveClassLink = formData.get("liveClassLink") as string;
    const trialVideoUrl = formData.get("trialVideoUrl") as string;

    if (!id || !name || !courseId || !teacherId || !daysOfWeekStr || !time) {
      return { error: "Please fill all required fields." };
    }

    const daysOfWeek = daysOfWeekStr.split(",").map(d => d.trim()).filter(Boolean);

    await prisma.batch.update({
      where: { id },
      data: {
        name,
        courseId,
        teacherId,
        daysOfWeek,
        time,
        classesPerWeek,
        price,
        currency,
        liveClassLink: liveClassLink || null,
        trialVideoUrl: trialVideoUrl || null,
      },
    });

    revalidatePath("/admin/batches");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update batch." };
  }
}
