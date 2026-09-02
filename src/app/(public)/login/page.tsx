"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Check, AlertCircle } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { Suspense } from "react";
import { resendVerificationEmail } from "@/app/actions/register";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setResendMessage("");
    const res = await resendVerificationEmail(email);
    if (res?.error) {
      setResendMessage(res.error);
    } else {
      setResendMessage("Verification email sent! Please check your inbox.");
    }
    setIsResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError("");
    setResendMessage("");
    setIsSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (res?.error) {
      setError(res.error);
    } else {
      const session = await getSession();
      const role = session?.user?.role?.toLowerCase();
      if (role) {
         router.push(`/${role}`);
      } else {
         router.push(callbackUrl);
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col md:flex-row">
      {/* Left side Form Column */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-24 z-10 overflow-y-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <span>← Back</span>
        </Link>

        {/* Core Form Container */}
        <div className="space-y-8 max-w-md w-full my-auto pt-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-custom-light uppercase tracking-widest">
              Al-Hannan Account
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              Welcome back! Please enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg flex flex-col space-y-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
                {error.includes("verify your email") && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="self-start text-xs font-bold text-emerald-custom-light hover:underline bg-transparent border-none p-0 cursor-pointer pl-6"
                  >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </button>
                )}
              </div>
            )}
            
            {resendMessage && (
              <div className={`text-xs p-3 rounded-lg flex items-center space-x-2 border ${
                resendMessage.includes("sent") 
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                  : "bg-red-500/10 border-red-500/50 text-red-500"
              }`}>
                <Check className="w-4 h-4 shrink-0" />
                <span>{resendMessage}</span>
              </div>
            )}
            
            {/* Email Address or Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="name@example.com or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-850 hover:border-stone-800 focus:border-emerald-custom-light focus:ring-1 focus:ring-emerald-custom-light rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-650 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-850 hover:border-stone-800 focus:border-emerald-custom-light focus:ring-1 focus:ring-emerald-custom-light rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-gray-650 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <label className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4.5 h-4.5 rounded border transition-all flex items-center justify-center ${
                    rememberMe
                      ? "bg-emerald-custom border-emerald-custom text-white"
                      : "border-stone-800 group-hover:border-stone-700 bg-stone-900"
                  }`}>
                    {rememberMe && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
              </label>

              <Link
                href="/contact"
                className="text-emerald-custom-light hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-gray-100 text-stone-950 font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 pt-4 cursor-pointer"
            >
              <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>

          {/* Don't have an account switch */}
          <p className="text-xs text-gray-400 font-semibold pt-4">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-custom-light hover:underline font-bold"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-gray-500 mt-8">
          © 2026 Al-Hannan Quran Institute. All rights reserved.
        </p>
      </div>

      {/* Right side Visual Column */}
      <div className="hidden md:flex flex-1 relative overflow-hidden border-l border-stone-900">
        <img
          src="https://i.pinimg.com/736x/14/a8/18/14a8186d52718a0047c11769ded22fd6.jpg"
          alt="Al-Quran Al-Kareem Calligraphy"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
        <div className="absolute inset-0 bg-stone-950/20 mix-blend-multiply z-10" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
