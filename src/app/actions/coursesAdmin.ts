"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CourseCategory } from "@prisma/client";

export async function createCourse(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const category = formData.get("category") as CourseCategory;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    if (!name || !category) {
      return { error: "Name and Category are required." };
    }

    await prisma.course.create({
      data: {
        name,
        category,
        description: description || null,
        isActive,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create course." };
  }
}

export async function toggleCourseActive(id: string, isActive: boolean) {
  try {
    await prisma.course.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update course." };
  }
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.delete({
      where: { id },
    });
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete course. It may have associated batches or registrations." };
  }
}
