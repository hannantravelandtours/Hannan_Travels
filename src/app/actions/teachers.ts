"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createTeacher(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const qualification = formData.get("qualification") as string;
    const bio = formData.get("bio") as string;
    const description = formData.get("description") as string;

    if (!name || !email || !password) {
      return { error: "Name, email, and password are required." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "TEACHER",
          phone: phone || null,
        },
      });

      await tx.teacherProfile.create({
        data: {
          userId: user.id,
          qualification: qualification || null,
          bio: bio || null,
          description: description || null,
        },
      });
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    return { error: "Failed to create teacher." };
  }
}

export async function deleteTeacher(id: string) {
  try {
    // Delete user will cascade to TeacherProfile due to Cascade delete rules
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete teacher." };
  }
}

export async function updateTeacher(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const qualification = formData.get("qualification") as string;
    const bio = formData.get("bio") as string;
    const description = formData.get("description") as string;

    if (!name) {
      return { error: "Name is required." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          name,
          phone: phone || null,
        },
      });

      await tx.teacherProfile.update({
        where: { userId: id },
        data: {
          qualification: qualification || null,
          bio: bio || null,
          description: description || null,
        },
      });
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating teacher:", error);
    return { error: "Failed to update teacher." };
  }
}
