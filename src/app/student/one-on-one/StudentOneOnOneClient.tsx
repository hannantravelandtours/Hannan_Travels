"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, Clock, Calendar, CheckCircle2, AlertCircle, BookOpen, User, Plus } from "lucide-react";

interface RegistrationItem {
  id: string;
  status: string;
  registeredAt: Date;
  course: {
    name: string;
    category: string;
    description: string | null;
  };
  teacherSlot: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    teacher: {
      user: {
        name: string;
        email: string;
      };
    };
  } | null;
}

export function StudentOneOnOneClient({ registrations }: { registrations: RegistrationItem[] }) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-custom/10 text-emerald-custom flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-custom">My 1-on-1 Private Classes</h1>
            <p className="text-xs text-gray-500">
              View your registered 1-on-1 Quran classes, assigned teacher, and weekly timetable slot.
            </p>
          </div>
        </div>

        <Link
          href="/register/student"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New 1-on-1 Class</span>
        </Link>
      </div>

      {/* Class Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registrations.map((item) => {
          const isConfirmed = item.status === "ACTIVE";
          const teacherName = item.teacherSlot?.teacher?.user?.name || "Teacher to be confirmed";

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border relative overflow-hidden flex flex-col justify-between ${
                isConfirmed ? "border-emerald-200" : "border-amber-200 bg-amber-50/10"
              }`}
            >
              <div className={`absolute top-0 right-0 w-2 h-full ${isConfirmed ? "bg-emerald-custom" : "bg-amber-400"}`} />

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-custom-light uppercase tracking-widest">
                      {item.course?.category}
                    </span>
                    <h3 className="text-lg font-bold text-navy-custom mt-0.5">{item.course?.name}</h3>
                  </div>

                  {isConfirmed ? (
                    <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Confirmed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                      <AlertCircle className="w-3 h-3" />
                      <span>Pending Confirmation</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-emerald-custom shrink-0" />
                    <span className="font-semibold text-navy-custom">Assigned Teacher:</span>
                    <span className="ml-1 text-gray-800 font-bold">{teacherName}</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-emerald-custom shrink-0" />
                    <span className="font-semibold text-navy-custom">Day & Time:</span>
                    <span className="ml-1 text-gray-800 font-bold">
                      {item.teacherSlot
                        ? `${item.teacherSlot.dayOfWeek} (${item.teacherSlot.startTime} - ${item.teacherSlot.endTime})`
                        : "Slot pending confirmation by Admin"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 font-medium">
                  Registered: {new Date(item.registeredAt).toLocaleDateString()}
                </span>
                {isConfirmed ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                    Class Ready
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-lg">
                    Admin Approval Pending
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {registrations.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-150 space-y-4">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-custom">No 1-on-1 Classes Registered</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven't enrolled in any 1-on-1 private classes yet. Register now to choose your course, teacher, and free time slot!
            </p>
            <Link
              href="/register/student"
              className="inline-block px-5 py-2.5 bg-emerald-custom text-white rounded-xl font-bold text-xs hover:bg-emerald-600 transition-colors shadow-sm"
            >
              Enroll in 1-on-1 Class
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
