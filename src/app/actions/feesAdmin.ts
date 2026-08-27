"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function recordFeePayment(formData: FormData) {
  try {
    const registrationId = formData.get("registrationId") as string;
    const month = formData.get("month") as string;
    const amountPaid = parseFloat(formData.get("amountPaid") as string) || 0;

    if (!registrationId || !month || !amountPaid) {
      return { error: "Missing fields" };
    }

    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { course: true, batch: true }
    });

    if (!reg) return { error: "Registration not found" };
    if (!reg.batch) return { error: "Cannot generate fee because the student is not assigned to a batch." };

    const amountDue = reg.batch.price;

    await prisma.feeRecord.create({
      data: {
        registrationId,
        month,
        amountDue,
        amountPaid,
        status: amountPaid >= Number(amountDue) ? "PAID" : "PARTIAL",
        paidAt: new Date(),
        updatedBy: "Admin", // replace with session user in real app
      }
    });

    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Failed to record fee payment" };
  }
}

export async function payTeacherSalary(formData: FormData) {
  try {
    const teacherId = formData.get("teacherId") as string;
    const month = formData.get("month") as string;
    const amount = parseFloat(formData.get("amount") as string) || 0;

    if (!teacherId || !month || !amount) {
      return { error: "Missing fields" };
    }

    await prisma.salaryPayment.create({
      data: {
        teacherId,
        month,
        amount,
        paidBy: "Admin",
      }
    });

    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Failed to pay salary" };
  }
}
