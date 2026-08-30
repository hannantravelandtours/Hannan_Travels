"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CourseCategory } from "@prisma/client";
import { supabase } from "@/lib/supabase";

export async function createCourse(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const subtitle = formData.get("subtitle") as string;
    const category = formData.get("category") as CourseCategory;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";
    const bannerFile = formData.get("bannerImage") as File | null;

    if (!name || !category) {
      return { error: "Name and Category are required." };
    }

    let bannerImageUrl = null;

    if (bannerFile && bannerFile.size > 0) {
      const fileExt = bannerFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `course_banners/${fileName}`;

      const { data, error } = await supabase.storage
        .from('courses_Bannar_Images')
        .upload(filePath, bannerFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
         console.error("Upload error:", error);
         return { error: "Failed to upload banner image." };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('courses_Bannar_Images')
        .getPublicUrl(filePath);
        
      bannerImageUrl = publicUrlData.publicUrl;
    }

    await prisma.course.create({
      data: {
        name,
        subtitle: subtitle || null,
        bannerImage: bannerImageUrl,
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
