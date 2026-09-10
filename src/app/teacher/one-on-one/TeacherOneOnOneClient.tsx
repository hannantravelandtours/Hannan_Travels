"use client";

import React, { useState } from "react";
import { Plus, Trash2, Clock, Calendar, CheckCircle2, AlertCircle, BookOpen, User, UserCheck } from "lucide-react";
import { createTeacherSlot, deleteTeacherSlot } from "@/app/actions/oneOnOne";

interface SlotItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  registrations?: any[];
}

interface RegistrationItem {
  id: string;
  status: string;
  student: {
    user: {
      name: string;
      email: string;
      phone: string | null;
    };
  };
  course: {
    name: string;
    category: string;
  };
  oneOnOnePlan?: {
    title: string;
    classesPerWeek: number;
  } | null;
  teacherSlot?: SlotItem | null;
  allSlots?: SlotItem[];
}

// Generate 30-minute interval options between 14:00 (2:00 PM) and 23:30 (11:30 PM)
const THIRTY_MIN_SLOTS: { start: string; end: string; label: string }[] = [];
for (let hour = 14; hour <= 23; hour++) {
  const hStr = hour < 10 ? `0${hour}` : `${hour}`;

  // Slot 1: :00 to :30
  const endHour1 = hour;
  const endHStr1 = endHour1 < 10 ? `0${endHour1}` : `${endHour1}`;
  THIRTY_MIN_SLOTS.push({
    start: `${hStr}:00`,
    end: `${endHStr1}:30`,
    label: `${hStr}:00 - ${endHStr1}:30`,
  });

  // Slot 2: :30 to :00 (next hour)
  const nextHour = hour + 1;
  const nextHStr = nextHour < 10 ? `0${nextHour}` : `${nextHour}`;
  THIRTY_MIN_SLOTS.push({
    start: `${hStr}:30`,
    end: `${nextHStr}:00`,
    label: `${hStr}:30 - ${nextHStr}:00`,
  });
}

export function TeacherOneOnOneClient({
  userId,
  teacherProfileId,
  initialSlots,
  initialRegistrations,
}: {
  userId: string;
  teacherProfileId: string;
  initialSlots: SlotItem[];
  initialRegistrations: RegistrationItem[];
}) {
  const [slots, setSlots] = useState<SlotItem[]>(initialSlots);
  const [registrations] = useState<RegistrationItem[]>(initialRegistrations);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [selectedTimeSlotIndex, setSelectedTimeSlotIndex] = useState(0);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const slotInfo = THIRTY_MIN_SLOTS[selectedTimeSlotIndex];

    const formData = new FormData();
    formData.set("teacherId", teacherProfileId);
    formData.set("userId", userId);
    formData.set("dayOfWeek", dayOfWeek);
    formData.set("startTime", slotInfo.start);
    formData.set("endTime", slotInfo.end);

    const res = await createTeacherSlot(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      const newSlot: SlotItem = {
        id: Math.random().toString(),
        dayOfWeek,
        startTime: slotInfo.start,
        endTime: slotInfo.end,
        isBooked: false,
      };
      setSlots((prev) => [...prev, newSlot]);
    }
    setIsSubmitting(false);
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure you want to delete this time slot?")) return;
    setDeletingId(slotId);
    const res = await deleteTeacherSlot(slotId);
    if (res?.success) {
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } else {
      alert(res?.error || "Failed to delete slot");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center space-x-4 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-custom/10 text-emerald-custom flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy-custom">1-on-1 Time Slots & Schedule</h1>
          <p className="text-xs text-gray-500">
            Define your 30-minute free time slots between 2:00 PM and 11:59 PM for student 1-on-1 bookings.
          </p>
        </div>
      </div>

      {/* Section 1: 30-Min Time Slot Generator */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-custom" />
            <h2 className="text-base font-bold text-navy-custom">Add 30-Min Free Time Slot (2:00 PM - 11:59 PM)</h2>
          </div>
          <span className="text-xs font-semibold text-gray-400">Total Slots: {slots.length}</span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Slot Form */}
        <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-150">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Day of Week</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-navy-custom font-semibold outline-none focus:border-emerald-custom"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">30-Min Time Interval</label>
            <select
              value={selectedTimeSlotIndex}
              onChange={(e) => setSelectedTimeSlotIndex(parseInt(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-navy-custom font-semibold outline-none focus:border-emerald-custom"
            >
              {THIRTY_MIN_SLOTS.map((s, idx) => (
                <option key={idx} value={idx}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-custom hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? "Adding..." : "Add 30-Min Slot"}</span>
          </button>
        </form>

        {/* Existing Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                slot.isBooked
                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                  : "bg-gray-50/80 border-gray-200 text-gray-700"
              }`}
            >
              <div>
                <span className="block text-xs font-bold">{slot.dayOfWeek}</span>
                <span className="block text-[11px] text-gray-500 font-medium">
                  {slot.startTime} - {slot.endTime} (30 min)
                </span>
                {slot.isBooked ? (
                  <span className="inline-block mt-1 text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Booked
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-[9px] font-black uppercase text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                    Available Free Slot
                  </span>
                )}
              </div>

              {!slot.isBooked && (
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  disabled={deletingId === slot.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Slot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {slots.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-gray-400">
              No 30-minute time slots added yet. Choose a day and select a 30-minute slot above!
            </div>
          )}
        </div>
      </div>

      {/* Section 2: 1-on-1 Timetable */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-custom" />
            <h2 className="text-base font-bold text-navy-custom">My 1-on-1 Student Timetable</h2>
          </div>
          <span className="text-xs font-semibold text-gray-400">Students: {registrations.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 border-b border-gray-150">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course & Package</th>
                <th className="py-3 px-4">30-Min Slots (Schedule)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registrations.map((item) => {
                const slotsList = item.allSlots && item.allSlots.length > 0
                  ? item.allSlots
                  : item.teacherSlot ? [item.teacherSlot] : [];

                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-navy-custom">{item.student?.user?.name}</div>
                      <div className="text-[11px] text-gray-400">{item.student?.user?.email}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-gray-700">
                      <div>{item.course?.name}</div>
                      {item.oneOnOnePlan && (
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.oneOnOnePlan.title}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {slotsList.length > 0 ? (
                        <div className="space-y-1">
                          {slotsList.map((s) => (
                            <div key={s.id} className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold mr-1">
                              <Clock className="w-3 h-3 text-emerald-600" />
                              <span>{s.dayOfWeek}: {s.startTime} - {s.endTime}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No slots selected</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {item.status === "ACTIVE" ? (
                        <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Confirmed / Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          <AlertCircle className="w-3 h-3" />
                          <span>Pending Admin Confirmation</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {registrations.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    No 1-on-1 students registered yet for your schedule.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
