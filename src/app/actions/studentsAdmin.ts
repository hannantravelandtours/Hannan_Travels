"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function deleteStudent(id: string) {
  try {
    // Delete user will cascade to StudentProfile due to Cascade delete rules
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete student." };
  }
}

export async function updateStudent(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const fatherName = formData.get("fatherName") as string;
    const country = formData.get("country") as string;
    const address = formData.get("address") as string;
    const age = parseInt(formData.get("age") as string) || null;

    if (!name) return { error: "Name is required." };

    // Check if email is being changed and if it's unique
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== id) {
        return { error: "Another user with this email already exists." };
      }
    }

    await prisma.$transaction(async (tx) => {
      const updateData: any = {
        name,
        phone: phone || null,
      };

      if (email) {
        updateData.email = email;
      }

      if (password && password.trim().length >= 6) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await tx.user.update({
        where: { id },
        data: updateData,
      });

      await tx.studentProfile.update({
        where: { userId: id },
        data: {
          fatherName: fatherName || null,
          country: country || null,
          address: address || null,
          age: age,
        },
      });
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating student:", error);
    return { error: "Failed to update student." };
  }
}

export async function toggleStudentAccess(registrationId: string, accessEnabled: boolean) {
  try {
    await prisma.registration.update({
      where: { id: registrationId },
      data: { accessEnabled },
    });
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    return { error: "Failed to toggle access." };
  }
}
