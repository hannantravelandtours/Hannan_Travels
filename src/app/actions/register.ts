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
  batchId: z.string().min(1, "Please select a batch"),
  preferredTeacherId: z.string().optional(),
});

export async function registerStudent(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = studentRegisterSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] as string;
      return { 
        error: firstError || "Validation failed", 
        details: fieldErrors 
      };
    }

    const { 
      name, email, phone, password, 
      fatherName, country, address, age, 
      courseId, batchId, preferredTeacherId 
    } = result.data;

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
          batchId,
          preferredTeacherId: preferredTeacherId || null,
          status: "PENDING_EMAIL_VERIFICATION",
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
