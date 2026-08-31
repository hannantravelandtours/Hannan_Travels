"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Mail, Phone, MapPin, Calendar, BookOpen, AlertCircle, Check } from "lucide-react";
import { getActiveCourses, getTeachersForCourse } from "@/app/actions/courses";
import { registerStudent } from "@/app/actions/register";
import { CourseCategory } from "@prisma/client";
import { Suspense } from "react";

function StudentRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CourseCategory | null;

  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch courses on load, optionally filtered by category from URL
    getActiveCourses(initialCategory || undefined).then(setCourses);
  }, [initialCategory]);

  useEffect(() => {
    if (selectedCourse) {
      getTeachersForCourse(selectedCourse).then(setTeachers);
      // Filter batches for the selected course
      const course = courses.find(c => c.id === selectedCourse);
      setBatches(course?.batches || []);
    } else {
      setTeachers([]);
      setBatches([]);
    }
    setSelectedTeacher("");
    setSelectedBatch("");
  }, [selectedCourse, courses]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerStudent(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 text-center text-white">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 bg-emerald-custom/20 text-emerald-custom-light rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Registration Successful!</h1>
          <p className="text-gray-400">
            Your account has been created. We've sent a verification email to your inbox.
            Please verify your email before logging in.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-10 overflow-y-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors mb-8">
          <span>← Back to Home</span>
        </Link>

        <div className="max-w-xl w-full mx-auto">
          <div className="space-y-2 mb-8">
            <span className="text-xs font-bold text-emerald-custom-light uppercase tracking-widest">
              Student Portal
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Register as a Student
            </h1>
            <p className="text-sm text-gray-400">
              Join Al-Hannan to start your Quran learning journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Student Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input name="name" required placeholder="Full Name" className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all" />
                </div>
              </div>

              {/* Father Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Father Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input name="fatherName" required placeholder="Father's Name" className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input type="email" name="email" required placeholder="Email Address" className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input type="tel" name="phone" required placeholder="+1 234 567 890" className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all" />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input type="number" name="age" required min="4" placeholder="Student Age" className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all" />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Country / City</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input name="country" required placeholder="e.g. UK, London" className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input type="password" name="password" required minLength={6} placeholder="Create a strong password" className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all" />
              </div>
            </div>

            <hr className="border-stone-800" />

            {/* Course Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select Course</label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <select 
                  name="courseId" 
                  required 
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-10 text-sm text-white outline-none transition-all appearance-none"
                >
                  <option value="" disabled>Choose a course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Batch Selection (Required) */}
            {selectedCourse && batches.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select Batch <span className="text-red-400">*</span></label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <select 
                    name="batchId" 
                    required 
                    value={selectedBatch} 
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-10 text-sm text-white outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Choose a batch</option>
                    {batches.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.daysOfWeek?.join(", ")} {b.time} — {b.price} {b.currency}/mo — Teacher: {b.teacher?.user?.name || "TBD"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedCourse && batches.length === 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm p-4 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>No batches are available for this course yet. Please select a different course or contact us.</span>
              </div>
            )}

            {/* Teacher Selection (Optional) */}
            {selectedCourse && teachers.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Preferred Teacher (Optional)</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <select 
                    name="preferredTeacherId"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-850 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-10 text-sm text-white outline-none transition-all appearance-none"
                  >
                    <option value="">Any Available Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} {t.qualification ? `- ${t.qualification}` : ''} {t.bio ? `(${t.bio})` : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-custom/25 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isSubmitting ? "Registering..." : "Complete Registration"}</span>
            </button>
          </form>
        </div>
      </div>
      
      {/* Right side Visual Column */}
      <div className="hidden md:flex flex-1 relative overflow-hidden border-l border-stone-900">
         <img
          src="https://i.pinimg.com/736x/d6/0b/64/d60b64962c79859c6b3a02eade1dc714.jpg"
          alt="Al-Quran"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
        <div className="absolute inset-0 bg-stone-950/20 mix-blend-multiply z-10" />
      </div>
    </div>
  );
}

export default function StudentRegistrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">Loading...</div>}>
      <StudentRegistrationForm />
    </Suspense>
  );
}
