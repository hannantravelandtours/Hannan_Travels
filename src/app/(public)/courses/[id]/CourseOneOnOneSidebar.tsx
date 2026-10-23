"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  UserCheck, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  ChevronDown
} from "lucide-react";

interface PlanItem {
  id: string;
  title: string;
  classesPerWeek: number;
  defaultPrice: number;
  currency: string;
  teacherFees: {
    teacherId: string;
    monthlyFee: number;
    currency: string;
  }[];
}

interface SlotItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface TeacherItem {
  id: string;
  name: string;
  email?: string;
  bio: string;
  qualification: string;
  slots: SlotItem[];
  customFees: {
    planId: string;
    monthlyFee: number;
    currency: string;
  }[];
}

interface Props {
  courseId: string;
  courseName: string;
  plans: PlanItem[];
  teachers: TeacherItem[];
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const hour = parseInt(parts[0], 10);
  const min = parts[1];
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${min} ${ampm}`;
}

export function CourseOneOnOneSidebar({ courseId, courseName, plans, teachers }: Props) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.length > 0 ? (plans.find(p => p.classesPerWeek === 3)?.id || plans[0].id) : ""
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [expandedTeacherId, setExpandedTeacherId] = useState<string>(
    teachers.length > 0 ? teachers[0].id : ""
  );

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

  // Compute active price
  let activePrice = selectedPlan?.defaultPrice || 3500;
  let activeCurrency = selectedPlan?.currency || "PKR";

  if (selectedTeacher && selectedPlan) {
    const customFee = selectedTeacher.customFees.find(cf => cf.planId === selectedPlan.id);
    if (customFee) {
      activePrice = customFee.monthlyFee;
      activeCurrency = customFee.currency;
    }
  }

  // Count total free slots across all teachers
  const totalFreeSlots = teachers.reduce((sum, t) => sum + (t.slots?.length || 0), 0);

  // Build registration URL with pre-selected parameters
  const registerUrl = `/register/student?course=${encodeURIComponent(courseId)}${
    selectedPlan ? `&plan=${encodeURIComponent(selectedPlan.id)}` : ""
  }${selectedTeacherId ? `&teacher=${encodeURIComponent(selectedTeacherId)}` : ""}${
    selectedSlotId ? `&slot=${encodeURIComponent(selectedSlotId)}` : ""
  }`;

  return (
    <div className="space-y-6">
      {/* 1-on-1 Plan Selection Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-custom/10 text-emerald-custom uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-gold-custom" />
              <span>1-on-1 Private Tuition</span>
            </span>
            <h2 className="text-xl font-extrabold text-navy-custom mt-1">Available 1-on-1 Plans</h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-custom">
              {activePrice.toLocaleString()} {activeCurrency}
            </span>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Per Month
            </span>
          </div>
        </div>

        {/* Plans Chips */}
        {plans.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-navy-custom block">
              Choose Weekly Frequency:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {plans.map((plan) => {
                const isSelected = plan.id === selectedPlanId;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setSelectedSlotId("");
                    }}
                    className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-custom bg-emerald-custom/5 text-emerald-custom shadow-sm font-bold ring-1 ring-emerald-custom"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-medium"
                    }`}
                  >
                    <span className="block text-xs font-extrabold">{plan.title}</span>
                    <span className="block text-[11px] text-gray-500 mt-0.5">
                      {plan.defaultPrice} {plan.currency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 1-on-1 Highlights */}
        <div className="space-y-2.5 pt-2 text-xs font-semibold text-gray-600 border-t border-gray-50">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-custom shrink-0" />
            <span>Dedicated Personal Scholar (100% Focused)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-custom shrink-0" />
            <span>30 Minutes Per Session • Flexible Rescheduling</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-custom shrink-0" />
            <span>Free 3-Day Trial Class (No Risk)</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-2 space-y-2">
          <Link
            href={registerUrl}
            className="w-full block text-center py-3.5 rounded-xl bg-emerald-custom hover:bg-emerald-900 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg"
          >
            {selectedSlotId ? "Book Selected Slot & Register" : "Enroll in 1-on-1 Class"}
          </Link>
          <p className="text-[11px] text-center text-gray-400 font-medium">
            3-Class Free Trial • Direct Teacher Match
          </p>
        </div>
      </div>

      {/* Teachers & Free Slots Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-navy-custom">Scholars & Free Slots</h3>
            <p className="text-xs text-gray-500">
              Pick your preferred teacher and free timing slot:
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            {totalFreeSlots} Slots Available
          </span>
        </div>

        {teachers.length > 0 ? (
          <div className="space-y-4">
            {teachers.map((teacher) => {
              const isTeacherExpanded = expandedTeacherId === teacher.id;
              const isTeacherSelected = selectedTeacherId === teacher.id;
              const slotsCount = teacher.slots?.length || 0;

              // Group teacher's free slots by Day of Week
              const groupedSlots = (teacher.slots || []).reduce((acc, slot) => {
                if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = [];
                acc[slot.dayOfWeek].push(slot);
                return acc;
              }, {} as Record<string, SlotItem[]>);

              return (
                <div
                  key={teacher.id}
                  className={`border rounded-2xl p-4 transition-all ${
                    isTeacherSelected
                      ? "border-emerald-custom bg-emerald-custom/[0.02] shadow-sm"
                      : "border-gray-150 hover:border-gray-300 bg-white"
                  }`}
                >
                  {/* Teacher Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-custom/10 text-emerald-custom font-bold flex items-center justify-center shrink-0 border border-emerald-custom/20">
                        <UserCheck className="w-5 h-5 text-emerald-custom" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-navy-custom leading-tight">
                          {teacher.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                          {teacher.qualification}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-custom bg-emerald-50 px-2 py-0.5 rounded-full">
                          {slotsCount} Free Slots
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedTeacherId(isTeacherExpanded ? "" : teacher.id)}
                      className="text-xs font-semibold text-gray-500 hover:text-emerald-custom p-1"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isTeacherExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Teacher Bio */}
                  {teacher.bio && (
                    <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 italic">
                      "{teacher.bio}"
                    </p>
                  )}

                  {/* Slots list */}
                  {isTeacherExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Select an Available Free Slot:
                      </span>

                      {slotsCount > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(groupedSlots).map(([day, daySlots]) => (
                            <div key={day} className="space-y-1">
                              <span className="text-[11px] font-bold text-navy-custom flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-emerald-custom" />
                                {day}
                              </span>
                              <div className="flex flex-wrap gap-1.5 pl-4">
                                {daySlots.map((slot) => {
                                  const isSlotSelected = selectedSlotId === slot.id;
                                  return (
                                    <button
                                      key={slot.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedTeacherId(teacher.id);
                                        setSelectedSlotId(slot.id);
                                      }}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        isSlotSelected
                                          ? "bg-emerald-custom text-white shadow-sm ring-2 ring-emerald-custom"
                                          : "bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-custom border border-gray-200"
                                      }`}
                                    >
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No free slots remaining for this teacher this week.
                        </p>
                      )}

                      {/* Select Teacher button */}
                      <Link
                        href={`/register/student?course=${encodeURIComponent(courseId)}&teacher=${encodeURIComponent(teacher.id)}${
                          selectedSlotId ? `&slot=${encodeURIComponent(selectedSlotId)}` : ""
                        }`}
                        className="mt-2 w-full block text-center py-2 rounded-lg bg-stone-100 hover:bg-emerald-custom hover:text-white text-navy-custom text-xs font-bold transition-all border border-gray-200"
                      >
                        Book 1-on-1 with {teacher.name.split(" ")[0]}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-5 text-center text-xs text-gray-500 font-semibold border border-gray-100">
            Our administration is currently assigning certified scholars for this course. You can still register to get matched.
            <Link
              href={`/register/student?course=${encodeURIComponent(courseId)}`}
              className="mt-3 block text-emerald-custom font-bold"
            >
              Register & Get Scholar Matched →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
