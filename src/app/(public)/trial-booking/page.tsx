"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, Calendar, User, BookOpen, Clock, AlertCircle } from "lucide-react";

function TrialBookingForm() {
  const searchParams = useSearchParams();
  const initialTeacher = searchParams.get("teacher") || "";

  const [step, setStep] = useState(1);
  
  // Step 1 State: Student / Parent Info
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Pakistan",
    studentAge: "",
    course: "quran-tajweed",
    teacherPref: initialTeacher ? "specific" : "any-gender",
    specificTeacher: initialTeacher,
    preferredTime: "Evening",
    preferredDays: "Weekdays"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const courses = [
    { id: "noorani-qaida", name: "Noorani Qaida Basics" },
    { id: "quran-reading", name: "Quran Reading" },
    { id: "quran-tajweed", name: "Quran Recitation with Tajweed" },
    { id: "hifz-quran", name: "Hifz-ul-Quran Memorization" },
    { id: "arabic-language", name: "Arabic Language Grammar" },
    { id: "islamic-studies", name: "Islamic Studies & Fiqh" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.studentAge.trim()) newErrors.studentAge = "Student age is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const getCourseName = (id: string) => {
    return courses.find(c => c.id === id)?.name || id;
  };

  const stepsList = [
    { num: 1, label: "Your Profile" },
    { num: 2, label: "Choose Course" },
    { num: 3, label: "Preferred Tutor" },
    { num: 4, label: "Schedule Time" },
    { num: 5, label: "Confirmation" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Step Form panel */}
        <div className="lg:col-span-8 bg-white border border-gray-150 rounded-2xl shadow-xl p-6 sm:p-8 space-y-8 min-h-[480px] flex flex-col justify-between">
          <div>
            {/* Steps Progress bar */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              {stepsList.map((s, idx) => (
                <div key={s.num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= s.num
                        ? "bg-emerald-custom text-white"
                        : "bg-gray-100 text-navy-custom/60"
                    }`}>
                      {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 mt-2 hidden sm:block">
                      {s.label}
                    </span>
                  </div>
                  {idx < stepsList.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                      step > s.num ? "bg-emerald-custom" : "bg-gray-100"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* STEP 1: Student Information */}
            {step === 1 && (
              <div className="space-y-6 pt-6 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-navy-custom">Student / Parent Information</h2>
                  <p className="text-xs text-gray-400 font-semibold">Please tell us who will be attending the classes.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Hammad Ahmad"
                      className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-custom ${
                        errors.fullName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.fullName && <span className="text-[10px] text-red-500 font-bold">{errors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-custom ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-bold">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">WhatsApp / Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92 300 1234567"
                      className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-custom ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 font-bold">{errors.phone}</span>}
                  </div>

                  {/* Student Age */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">Student Age</label>
                    <input
                      type="number"
                      name="studentAge"
                      value={formData.studentAge}
                      onChange={handleInputChange}
                      placeholder="e.g. 10"
                      className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-custom ${
                        errors.studentAge ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.studentAge && <span className="text-[10px] text-red-500 font-bold">{errors.studentAge}</span>}
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-custom bg-white cursor-pointer"
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Course Selection */}
            {step === 2 && (
              <div className="space-y-6 pt-6 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-navy-custom">Select Your Course</h2>
                  <p className="text-xs text-gray-400 font-semibold">Choose the curriculum program you want to learn.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFormData({ ...formData, course: c.id })}
                      className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                        formData.course === c.id
                          ? "border-emerald-custom bg-emerald-custom/5 text-emerald-custom font-bold"
                          : "border-gray-150 hover:bg-gray-50 text-navy-custom"
                      }`}
                    >
                      <span className="text-sm">{c.name}</span>
                      {formData.course === c.id && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Teacher Preference */}
            {step === 3 && (
              <div className="space-y-6 pt-6 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-navy-custom">Select Preferred Scholar</h2>
                  <p className="text-xs text-gray-400 font-semibold">Specify if you require a female scholar or a particular teacher.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, teacherPref: "any-gender" })}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.teacherPref === "any-gender"
                          ? "border-emerald-custom bg-emerald-custom/5 text-emerald-custom font-bold"
                          : "border-gray-150 hover:bg-gray-50 text-navy-custom"
                      }`}
                    >
                      No Preference (Any)
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, teacherPref: "female-only" })}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.teacherPref === "female-only"
                          ? "border-emerald-custom bg-emerald-custom/5 text-emerald-custom font-bold"
                          : "border-gray-150 hover:bg-gray-50 text-navy-custom"
                      }`}
                    >
                      Female Tutors Only
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, teacherPref: "specific" })}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.teacherPref === "specific"
                          ? "border-emerald-custom bg-emerald-custom/5 text-emerald-custom font-bold"
                          : "border-gray-150 hover:bg-gray-50 text-navy-custom"
                      }`}
                    >
                      Select Specific Tutor
                    </button>
                  </div>

                  {formData.teacherPref === "specific" && (
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-navy-custom">Select Tutor</label>
                      <select
                        name="specificTeacher"
                        value={formData.specificTeacher}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-custom bg-white cursor-pointer"
                      >
                        <option value="">-- Choose Tutors --</option>
                        <option value="Qari Ahmad Raza">Qari Ahmad Raza (Tajweed)</option>
                        <option value="Ustadha Fatima Noor">Ustadha Fatima Noor (Arabic)</option>
                        <option value="Hafiz Muhammad Abdullah">Hafiz Muhammad Abdullah (Hifz)</option>
                        <option value="Ustadha Ayesha Siddiqua">Ustadha Ayesha Siddiqua (Kids)</option>
                        <option value="Mufti Muhammad Ibrahim">Mufti Muhammad Ibrahim (Fiqh)</option>
                        <option value="Dr. Sajid Rehman">Dr. Sajid Rehman (Hadith)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Preferred Schedule */}
            {step === 4 && (
              <div className="space-y-6 pt-6 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-navy-custom">Select Preferred Schedule</h2>
                  <p className="text-xs text-gray-400 font-semibold">Choose typical times of day you would like to attend classes.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Time of Day */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-custom block">Time of Day (Your Local Time)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Morning", "Afternoon", "Evening", "Night"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setFormData({ ...formData, preferredTime: t })}
                          className={`p-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                            formData.preferredTime === t
                              ? "border-emerald-custom bg-emerald-custom/5 text-emerald-custom"
                              : "border-gray-150 hover:bg-gray-50 text-navy-custom"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Day Preference */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-custom block">Days Preference</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Weekdays", "Weekends", "Flexible"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setFormData({ ...formData, preferredDays: d })}
                          className={`p-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                            formData.preferredDays === d
                              ? "border-emerald-custom bg-emerald-custom/5 text-emerald-custom"
                              : "border-gray-150 hover:bg-gray-50 text-navy-custom"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Confirmation screen */}
            {step === 5 && (
              <div className="space-y-6 pt-6 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-custom/10 text-emerald-custom flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-emerald-custom" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-navy-custom">Your Free Trial Has Been Booked!</h2>
                  <p className="text-sm text-gray-500 font-semibold max-w-sm mx-auto">
                    Jazakallah Khair! We have registered your trial request. A senior supervisor will contact you via WhatsApp / Email shortly.
                  </p>
                </div>

                <div className="bg-emerald-custom/5 border border-emerald-custom/10 p-5 rounded-2xl max-w-md mx-auto text-left space-y-3 text-xs font-semibold text-gray-600">
                  <h4 className="font-bold text-navy-custom text-sm pb-2 border-b border-emerald-custom/15">Booking Receipt Summary</h4>
                  <div>Student Name: <span className="text-navy-custom font-bold">{formData.fullName}</span></div>
                  <div>Selected Course: <span className="text-emerald-custom font-bold">{getCourseName(formData.course)}</span></div>
                  <div>Tutor Option: <span className="text-navy-custom font-bold">{
                    formData.teacherPref === "specific" ? formData.specificTeacher : formData.teacherPref === "female-only" ? "Female Scholar" : "Any Available Scholar"
                  }</span></div>
                  <div>Timings: <span className="text-navy-custom font-bold">{formData.preferredDays} ({formData.preferredTime})</span></div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/student"
                    className="inline-block px-8 py-3 bg-emerald-custom hover:bg-emerald-900 text-white font-bold text-sm rounded-full shadow-md"
                  >
                    Go To Student Portal Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Form control buttons */}
          {step < 5 && (
            <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center space-x-1 text-xs font-bold text-navy-custom/60 hover:text-navy-custom disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                className="flex items-center space-x-1 px-6 py-2.5 rounded-lg bg-emerald-custom hover:bg-emerald-900 text-white text-xs font-bold shadow-md hover-lift cursor-pointer"
              >
                <span>{step === 4 ? "Complete Booking" : "Next Step"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Summary billing panel */}
        <div className="lg:col-span-4 bg-gray-50 border border-gray-150 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-navy-custom border-b border-gray-200 pb-3 uppercase tracking-wider">
            Enrollment Summary
          </h3>

          <div className="space-y-4 text-xs font-semibold text-gray-600">
            {/* Steps icons list */}
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-emerald-custom shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400">Student Profile</span>
                <span className="text-navy-custom font-bold">{formData.fullName || "Not provided"}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <BookOpen className="h-4 w-4 text-emerald-custom shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400">Selected Course</span>
                <span className="text-navy-custom font-bold">{getCourseName(formData.course)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-emerald-custom shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400">Preferred Timings</span>
                <span className="text-navy-custom font-bold">{formData.preferredDays} - {formData.preferredTime}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Trial Period</span>
              <span className="text-emerald-custom">3 Classes (Free)</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Registration Fee</span>
              <span className="text-emerald-custom">$0.00 (Waived)</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-sm font-black text-navy-custom">
              <span>Total Due Now</span>
              <span className="text-emerald-custom">$0.00</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-[10px] text-gray-400 leading-normal">
            <AlertCircle className="h-4 w-4 text-gold-custom shrink-0 mt-0.5" />
            <p>Your trial sessions are 100% free of charge. No banking credentials or commitments required.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrialBookingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm font-bold text-gray-400">Loading trial scheduler...</div>}>
      <TrialBookingForm />
    </Suspense>
  );
}
