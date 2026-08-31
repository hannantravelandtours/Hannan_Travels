"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/email";

export async function requestPasswordReset(email: string) {
  try {
    if (!email) return { error: "Email is required." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether user exists for security
      return { success: true };
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    await sendPasswordResetEmail(email, token);

    return { success: true };
  } catch (error) {
    console.error("Password reset request error:", error);
    return { error: "Failed to process reset request." };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    if (!token || !newPassword) return { error: "Token and password are required." };
    if (newPassword.length < 6) return { error: "Password must be at least 6 characters." };

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) return { error: "Invalid or expired reset link." };
    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return { error: "Reset link has expired. Please request a new one." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Clean up used token
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "Failed to reset password." };
  }
}
