"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

const studentRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  fatherName: z.string().min(2, "Father name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(2, "Country is required"),
  address: z.string().optional(),
  age: z.coerce.number().min(4, "Age must be at least 4"),
  courseId: z.string().min(1, "Please select a course"),
  batchId: z.string().optional(),
  preferredTeacherId: z.string().optional(),
  teacherSlotId: z.string().optional(),
  oneOnOnePlanId: z.string().optional(),
  teacherSlotIds: z.union([z.string(), z.array(z.string())]).optional(),
  isOneOnOne: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional(),
}).refine((data) => {
  if (data.isOneOnOne) {
    return true;
  }
  return !!data.batchId && data.batchId.length > 0;
}, {
  message: "Please select a batch for group classes",
  path: ["batchId"],
});

export async function registerStudent(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const rawSlotIds = formData.getAll("teacherSlotIds");
    
    const result = studentRegisterSchema.safeParse({
      ...data,
      teacherSlotIds: rawSlotIds.length > 0 ? rawSlotIds as string[] : data.teacherSlotIds,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] as string;
      return { 
        error: firstError || "Validation failed", 
        details: fieldErrors 
      };
    }

    const { 
      name, phone, password, 
      fatherName, country, address, age, 
      courseId, batchId, preferredTeacherId,
      teacherSlotId, oneOnOnePlanId, teacherSlotIds, isOneOnOne 
    } = result.data;
    const email = result.data.email.toLowerCase().trim();

    // Parse array of slot IDs
    let slotIdList: string[] = [];
    if (Array.isArray(teacherSlotIds)) {
      slotIdList = teacherSlotIds.filter(Boolean);
    } else if (typeof teacherSlotIds === "string" && teacherSlotIds.trim()) {
      slotIdList = teacherSlotIds.split(",").map(s => s.trim()).filter(Boolean);
    }
    if (teacherSlotId && !slotIdList.includes(teacherSlotId)) {
      slotIdList.push(teacherSlotId);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction to create User, StudentProfile, and Registration
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: Role.STUDENT,
          studentProfile: {
            create: {
              fatherName,
              country,
              address,
              age,
            }
          }
        }
      });

      const studentProfile = await tx.studentProfile.findUnique({
        where: { userId: user.id }
      });

      if (!studentProfile) throw new Error("Failed to create student profile");

      await tx.registration.create({
        data: {
          studentId: studentProfile.id,
          courseId,
          batchId: isOneOnOne ? null : (batchId || null),
          preferredTeacherId: preferredTeacherId || null,
          teacherSlotId: isOneOnOne ? (slotIdList[0] || teacherSlotId || null) : null,
          oneOnOnePlanId: isOneOnOne ? (oneOnOnePlanId || null) : null,
          isOneOnOne: !!isOneOnOne,
          status: "PENDING_EMAIL_VERIFICATION",
          ...(isOneOnOne && slotIdList.length > 0
            ? {
                teacherSlots: {
                  connect: slotIdList.map((id) => ({ id })),
                },
              }
            : {}),
        }
      });
    });

    // Generate Verification Token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      }
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration. Please try again." };
  }
}

export async function resendVerificationEmail(emailStr: string) {
  try {
    const email = emailStr.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "Account not found." };
    }

    if (user.emailVerified) {
      return { error: "Email is already verified." };
    }

    // Delete existing tokens for this email to prevent confusion
    await prisma.verificationToken.deleteMany({
      where: { email }
    });

    // Generate new Verification Token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      }
    });

    await sendVerificationEmail(email, token);
    return { success: true };
  } catch (error) {
    console.error("Failed to resend email:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
