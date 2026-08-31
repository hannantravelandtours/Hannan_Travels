import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  // Use the main custom domain directly instead of relying on NEXTAUTH_URL
  const baseUrl = process.env.NODE_ENV === "development" 
    ? "http://localhost:3000" 
    : "https://alhannanquraninstitute.com";
  const confirmLink = `${baseUrl}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Online Quran Academy <noReply@alhannanquraninstitute.com>",
      to: email,
      subject: "Verify your email address - Online Quran Academy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #059669; text-align: center;">Welcome to Online Quran Academy!</h2>
          <p style="color: #334155; font-size: 16px;">Assalamu Alaikum,</p>
          <p style="color: #334155; font-size: 16px;">Jazakallah Khair for registering as a student. To complete your registration and access your student portal, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">If the button above does not work, you can copy and paste this link into your browser:</p>
          <p style="color: #64748b; font-size: 14px; word-break: break-all;">
            <a href="${confirmLink}" style="color: #059669;">${confirmLink}</a>
          </p>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">May Allah reward you for your dedication to learning the Quran.</p>
          <p style="color: #64748b; font-size: 14px;">Wassalam,<br>Online Quran Academy Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return { success: false, error: err };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NODE_ENV === "development" 
    ? "http://localhost:3000" 
    : "https://alhannanquraninstitute.com";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Online Quran Academy <noReply@alhannanquraninstitute.com>",
      to: email,
      subject: "Reset your password - Online Quran Academy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #059669; text-align: center;">Password Reset Request</h2>
          <p style="color: #334155; font-size: 16px;">Assalamu Alaikum,</p>
          <p style="color: #334155; font-size: 16px;">We received a request to reset your password. Click the button below to set a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
          <p style="color: #64748b; font-size: 14px;">If the button above does not work, copy and paste this link:</p>
          <p style="color: #64748b; font-size: 14px; word-break: break-all;">
            <a href="${resetLink}" style="color: #059669;">${resetLink}</a>
          </p>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Wassalam,<br>Online Quran Academy Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return { success: false, error: err };
  }
}
