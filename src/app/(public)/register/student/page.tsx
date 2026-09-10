"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  AlertCircle,
  Check,
  Clock,
  Users,
  UserCheck,
  Sparkles,
  DollarSign,
  Layers,
} from "lucide-react";
import { getActiveCourses, getTeachersForCourse } from "@/app/actions/courses";
import { getAllTeachers } from "@/app/actions/teachers";
import { registerStudent } from "@/app/actions/register";
import { getAvailableSlotsForTeacher, getOneOnOnePlans } from "@/app/actions/oneOnOne";
import { CourseCategory } from "@prisma/client";
import { Suspense } from "react";

function StudentRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CourseCategory | null;
  const initialMode = searchParams.get("mode") || searchParams.get("type");

  const [isOneOnOne, setIsOneOnOne] = useState(
    initialMode === "1-on-1" || initialMode === "one-on-one"
  );

  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [allTeachers, setAllTeachers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  // 1-on-1 Plans & Slots State
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch courses, all teachers, and 1-on-1 plans on load
    getActiveCourses(initialCategory || undefined).then(setCourses);
    getAllTeachers().then(setAllTeachers);
    getOneOnOnePlans().then((res) => {
      if (res.success && res.plans) {
        setPlans(res.plans);
        if (res.plans.length > 0) {
          setSelectedPlanId(res.plans[0].id);
        }
      }
    });
  }, [initialCategory]);

  useEffect(() => {
    if (selectedCourse) {
      getTeachersForCourse(selectedCourse).then(setTeachers);
      const course = courses.find((c) => c.id === selectedCourse);
      setBatches(course?.batches || []);
    } else {
      setTeachers([]);
      setBatches([]);
    }
    setSelectedTeacher("");
    setSelectedBatch("");
    setSelectedSlotIds([]);
    setSlots([]);
  }, [selectedCourse, courses]);

  // Fetch slots whenever teacher changes in 1-on-1 mode
  useEffect(() => {
    if (isOneOnOne && selectedTeacher) {
      setLoadingSlots(true);
      getAvailableSlotsForTeacher(selectedTeacher).then((res) => {
        if (res.success && res.slots) {
          setSlots(res.slots);
        } else {
          setSlots([]);
        }
        setLoadingSlots(false);
      });
    } else {
      setSlots([]);
      setSelectedSlotIds([]);
    }
  }, [isOneOnOne, selectedTeacher]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  // Dynamic pricing calculation (Teacher custom rate or package default price)
  const computePrice = () => {
    if (!selectedPlan) return { price: 0, isCustom: false };
    if (!selectedTeacher) return { price: selectedPlan.defaultPrice, isCustom: false };

    const customFeeObj = selectedPlan.teacherFees?.find(
      (tf: any) => tf.teacherId === selectedTeacher
    );

    if (customFeeObj) {
      return { price: customFeeObj.monthlyFee, isCustom: true };
    }
    return { price: selectedPlan.defaultPrice, isCustom: false };
  };

  const { price: currentPrice, isCustom: isCustomRate } = computePrice();

  const toggleSlotSelection = (slotId: string) => {
    const maxAllowed = selectedPlan ? selectedPlan.classesPerWeek : 3;

    setSelectedSlotIds((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      } else {
        if (prev.length >= maxAllowed) {
          alert(`You can select up to ${maxAllowed} slots for the "${selectedPlan?.title}" package.`);
          return prev;
        }
        return [...prev, slotId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isOneOnOne && selectedCourse && batches.length === 0) {
      alert("Is course mein koi batch abi start nhi hua. Kindly select a different course or switch to 1-on-1 private class mode.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("isOneOnOne", isOneOnOne ? "true" : "false");

    if (isOneOnOne) {
      formData.set("oneOnOnePlanId", selectedPlanId);
      selectedSlotIds.forEach((id) => formData.append("teacherSlotIds", id));
    }

    const result = await registerStudent(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      alert("Registration Successful! Kindly verify your email before logging in. A verification link has been sent to your inbox.");
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

  const availableTeachersList = isOneOnOne
    ? allTeachers.length > 0 ? allTeachers : teachers
    : teachers.length > 0 ? teachers : allTeachers;

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-10 overflow-y-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors mb-8">
          <span>← Back to Home</span>
        </Link>

        <div className="max-w-xl w-full mx-auto space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-custom-light uppercase tracking-widest">
              Student Portal
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Register as a Student
            </h1>
            <p className="text-sm text-gray-400">
              Join Al-Hannan Academy for Group Batches or 1-on-1 Private Classes.
            </p>
          </div>

          {/* Registration Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Select Registration Mode
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-900 border border-stone-800 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setIsOneOnOne(false);
                  setSelectedSlotIds([]);
                }}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isOneOnOne
                    ? "bg-emerald-custom text-white shadow-lg shadow-emerald-custom/20 border border-emerald-500"
                    : "text-gray-400 hover:text-white hover:bg-stone-850"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Group Batch Class</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOneOnOne(true);
                  setSelectedBatch("");
                }}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isOneOnOne
                    ? "bg-emerald-custom text-white shadow-lg shadow-emerald-custom/20 border border-emerald-500"
                    : "text-gray-400 hover:text-white hover:bg-stone-850"
                }`}
              >
                <UserCheck className="w-4 h-4 text-gold-custom-light" />
                <span>1-on-1 Private Class</span>
              </button>
            </div>
          </div>

          {/* Active 1-on-1 Banner */}
          {isOneOnOne && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs flex items-center space-x-3 shadow-inner">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block text-white text-sm">1-on-1 Private Class Mode Active</span>
                <span>Select your course, choose a package plan, pick your teacher, and select your 30-minute time slots!</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="isOneOnOne" value={isOneOnOne ? "true" : "false"} />

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
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Group Batch Selection (Only for Group mode) */}
            {!isOneOnOne && selectedCourse && batches.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select Batch <span className="text-red-400">*</span></label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <select
                    name="batchId"
                    required={!isOneOnOne}
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

            {/* 1-on-1 Frequency Package Plan Selection */}
            {isOneOnOne && plans.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-custom-light uppercase tracking-wider block flex items-center justify-between">
                  <span>Select 1-on-1 Class Frequency Package</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {plans.map((p) => {
                    const isSelected = selectedPlanId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlanId(p.id);
                          setSelectedSlotIds([]);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-950/80 border-emerald-500 text-white shadow-md"
                            : "bg-stone-900 border-stone-800 text-gray-400 hover:border-stone-700"
                        }`}
                      >
                        <div className="text-xs font-bold flex justify-between items-center">
                          <span>{p.title}</span>
                          <span className="text-emerald-400 font-extrabold">${p.defaultPrice}/mo</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {p.classesPerWeek} classes per week
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Teacher Selection */}
            {(isOneOnOne || selectedCourse) && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  {isOneOnOne ? "Select Personal Teacher (Required for 1-on-1)" : "Preferred Teacher (Optional)"}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                  <select
                    name="preferredTeacherId"
                    required={isOneOnOne}
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 focus:border-emerald-custom-light rounded-xl py-3 pl-10 pr-10 text-sm text-white outline-none transition-all appearance-none"
                  >
                    <option value="">{isOneOnOne ? "Choose a Teacher from Academy" : "Any Available Teacher"}</option>
                    {availableTeachersList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.qualification ? `- ${t.qualification}` : ''} {t.bio ? `(${t.bio})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Calculated Fee */}
                {isOneOnOne && selectedTeacher && selectedPlan && (
                  <div className="mt-2 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-semibold">
                      Monthly Fee Rate ({selectedPlan.title}):
                    </span>
                    <span className="text-emerald-300 font-extrabold text-sm flex items-center">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>${currentPrice} / month</span>
                      {isCustomRate && <span className="ml-1 text-[9px] bg-emerald-800 px-1.5 py-0.5 rounded text-white font-normal">Custom Teacher Rate</span>}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 1-on-1 Multi-Slot Selector (30-min intervals between 2:00 PM & 11:59 PM) */}
            {isOneOnOne && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-custom-light uppercase tracking-wider block flex items-center justify-between">
                  <span>
                    Select 30-Min Time Slots ({selectedSlotIds.length} / {selectedPlan ? selectedPlan.classesPerWeek : 3} Selected)
                  </span>
                  {loadingSlots && <span className="text-[10px] text-gray-400">Loading slots...</span>}
                </label>

                {!selectedTeacher ? (
                  <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl text-center text-xs text-gray-500">
                    ← Please select a teacher above first to view their 30-minute free time slots (2 PM - 11:59 PM).
                  </div>
                ) : (
                  <div className="space-y-3 bg-stone-900 border border-stone-800 p-4 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {slots.map((s) => {
                        const isSelected = selectedSlotIds.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleSlotSelection(s.id)}
                            className={`p-2.5 rounded-lg border text-left transition-all text-xs font-semibold flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-400 shadow-md"
                                : "bg-stone-850 text-gray-300 border-stone-750 hover:border-emerald-700"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              <span>{s.dayOfWeek}: {s.startTime} - {s.endTime}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                          </button>
                        );
                      })}

                      {slots.length === 0 && !loadingSlots && (
                        <p className="col-span-full text-xs text-amber-400/90 text-center py-2">
                          This teacher has no custom 30-minute time slots listed right now. You can still register and Admin will assign your timetable!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-custom/25 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isSubmitting ? "Registering..." : isOneOnOne ? `Register for 1-on-1 Class ($${currentPrice}/mo)` : "Complete Registration"}</span>
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
