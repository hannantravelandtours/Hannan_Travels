"use client";

import React, { useState } from "react";
import { Plus, Trash2, Clock, Calendar, CheckCircle2, AlertCircle, BookOpen, User, UserCheck } from "lucide-react";
import { createTeacherSlot, deleteTeacherSlot, setOneOnOneClassLink } from "@/app/actions/oneOnOne";

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
  classLink?: string | null;
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
  const [registrations, setRegistrations] = useState<RegistrationItem[]>(initialRegistrations);
  const [linkEditId, setLinkEditId] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [selectedTimeSlotIndex, setSelectedTimeSlotIndex] = useState(0);

  const handleSaveLink = async (registrationId: string) => {
    const res = await setOneOnOneClassLink(registrationId, linkInput);
    if (res.success) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === registrationId ? { ...r, classLink: linkInput } : r))
      );
      setLinkEditId(null);
    } else {
      alert(res.error || "Failed to set class link");
    }
  };

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

      {/* Section 1: 30-Min Time Slot Overview */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-custom" />
            <h2 className="text-base font-bold text-navy-custom">Your 30-Min Free Time Slots</h2>
          </div>
          <span className="text-xs font-semibold text-gray-400">Total Slots: {slots.length}</span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
          Note: Time slots can only be added or modified by the Admin.
        </div>

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
                <th className="py-3 px-4">Class Link</th>
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
                        <span className="text-gray-400 text-xs italic">No Slot Assigned</span>
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

                    <td className="py-3 px-4">
                      {linkEditId === item.id ? (
                        <div className="flex flex-col space-y-1">
                          <input
                            type="text"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            placeholder="e.g. Zoom link..."
                            className="w-full text-[10px] px-2 py-1 border rounded outline-none"
                          />
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleSaveLink(item.id)}
                              className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-emerald-700 w-1/2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setLinkEditId(null)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-gray-300 w-1/2"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {item.classLink ? (
                            <a href={item.classLink} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-[11px] font-bold truncate max-w-[100px] inline-block">
                              {item.classLink}
                            </a>
                          ) : (
                            <span className="text-gray-400 text-[10px] italic">No Link</span>
                          )}
                          <button
                            onClick={() => {
                              setLinkEditId(item.id);
                              setLinkInput(item.classLink || "");
                            }}
                            className="text-xs text-blue-500 hover:underline font-semibold"
                          >
                            {item.classLink ? "Edit" : "Set Link"}
                          </button>
                        </div>
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
