import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const token = searchParams?.token as string;

  if (!token) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Token</h1>
          <p className="text-gray-400 mb-6">No verification token was provided in the URL.</p>
          <Link href="/" className="px-6 py-3 bg-emerald-custom text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Find the token
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-gray-400 mb-6">This verification link is invalid or has already been used.</p>
          <Link href="/login" className="px-6 py-3 bg-emerald-custom text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (new Date() > verificationToken.expires) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Link Expired</h1>
          <p className="text-gray-400 mb-6">This verification link has expired. Please register again or contact support.</p>
          <Link href="/register" className="px-6 py-3 bg-emerald-custom text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md">
            Go to Registration
          </Link>
        </div>
      </div>
    );
  }

  // Valid Token: Verify Email
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { email: verificationToken.email },
        data: { emailVerified: new Date() },
        include: { studentProfile: true }
      });

      if (user.studentProfile) {
        // Update registration status to ACTIVE
        await tx.registration.updateMany({
          where: { 
            studentId: user.studentProfile.id,
            status: "PENDING_EMAIL_VERIFICATION"
          },
          data: { status: "ACTIVE" }
        });
      }

      // Delete the used token
      await tx.verificationToken.delete({
        where: { id: verificationToken.id }
      });
    });

    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
          <p className="text-gray-400 mb-6">Jazakallah Khair! Your email has been successfully verified. You can now log in to your student portal.</p>
          <Link href="/login" className="px-6 py-3 bg-emerald-custom text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md">
            Log In Now
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
          <p className="text-gray-400 mb-6">Something went wrong while verifying your email. Please try again later.</p>
          <Link href="/" className="px-6 py-3 bg-emerald-custom text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
}
