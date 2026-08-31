"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/actions/passwordReset";
import { Lock, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const res = await resetPassword(token, password);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
    setIsSubmitting(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-custom mb-2">Invalid Reset Link</h2>
          <p className="text-sm text-gray-500 mb-6">This password reset link is invalid or has expired.</p>
          <Link href="/login" className="text-emerald-custom font-bold text-sm hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-custom mb-2">Password Reset Successful!</h2>
          <p className="text-sm text-gray-500 mb-6">Your password has been updated. You can now log in with your new password.</p>
          <Link href="/login" className="px-6 py-2.5 bg-emerald-custom text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-custom/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-emerald-custom" />
          </div>
          <h2 className="text-2xl font-bold text-navy-custom">Set New Password</h2>
          <p className="text-sm text-gray-500 mt-2">Enter your new password below</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center space-x-2 border border-red-100 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Repeat your password"
              className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-gray-500 hover:text-emerald-custom font-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
