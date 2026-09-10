"use client";

import React, { useState } from "react";
import { UserCheck, Search, Filter, Clock, Calendar, CheckCircle2, AlertCircle, BookOpen, User, RefreshCw } from "lucide-react";
import { confirmOneOnOneRegistration, getOneOnOneAdminTimetable } from "@/app/actions/oneOnOne";

interface RegistrationItem {
  id: string;
  status: string;
  isOneOnOne: boolean;
  registeredAt: Date;
  preferredTeacherName: string;
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
  teacherSlot: {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    teacher: {
      user: {
        name: string;
      };
    };
  } | null;
}

export function OneOnOneAdminClient({ initialRegistrations }: { initialRegistrations: RegistrationItem[] }) {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>(initialRegistrations);
  const [search, setSearch] = useState("");
  const [filterDay, setFilterDay] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    const res = await getOneOnOneAdminTimetable();
    if (res.success && res.registrations) {
      setRegistrations(res.registrations as any);
    }
    setRefreshing(false);
  };

  const handleConfirm = async (id: string) => {
    if (!confirm("Are you sure you want to confirm this 1-on-1 registration?")) return;
    setLoadingId(id);
    const res = await confirmOneOnOneRegistration(id);
    if (res.success) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "ACTIVE" } : r))
      );
    } else {
      alert(res.error || "Failed to confirm registration");
    }
    setLoadingId(null);
  };

  // Filter registrations
  const filtered = registrations.filter((r) => {
    const studentName = r.student?.user?.name?.toLowerCase() || "";
    const studentEmail = r.student?.user?.email?.toLowerCase() || "";
    const teacherName = (r.teacherSlot?.teacher?.user?.name || r.preferredTeacherName || "").toLowerCase();
    const courseName = r.course?.name?.toLowerCase() || "";
    const query = search.toLowerCase();

    const matchesQuery =
      studentName.includes(query) ||
      studentEmail.includes(query) ||
      teacherName.includes(query) ||
      courseName.includes(query);

    const matchesDay =
      filterDay === "ALL" ||
      (r.teacherSlot && r.teacherSlot.dayOfWeek === filterDay);

    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "PENDING" && r.status !== "ACTIVE") ||
      (filterStatus === "ACTIVE" && r.status === "ACTIVE");

    return matchesQuery && matchesDay && matchesStatus;
  });

  const pendingCount = registrations.filter((r) => r.status !== "ACTIVE").length;
  const activeCount = registrations.filter((r) => r.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-custom/10 text-emerald-custom flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-custom">1-on-1 Classes Timetable</h1>
            <p className="text-xs text-gray-500">
              Manage student 1-on-1 private class registrations ordered chronologically by schedule.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-1">
            <span>Total 1-on-1 Students</span>
            <User className="w-4 h-4 text-emerald-custom" />
          </div>
          <span className="text-2xl font-black text-navy-custom">{registrations.length}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-amber-700 mb-1">
            <span>Pending Confirmations</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-900">{pendingCount}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-700 mb-1">
            <span>Active / Confirmed Classes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-900">{activeCount}</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search student, teacher, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-emerald-custom"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">All Days</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Confirmation</option>
            <option value="ACTIVE">Confirmed / Active</option>
          </select>
        </div>
      </div>

      {/* Timetable Student Table */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 border-b border-gray-150">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Teacher</th>
                <th className="py-3.5 px-4">Timetable Slot (Sorted)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const isConfirmed = item.status === "ACTIVE";
                const teacherName = item.teacherSlot?.teacher?.user?.name || item.preferredTeacherName || "Unassigned";

                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-custom">{item.student?.user?.name}</div>
                      <div className="text-[11px] text-gray-400">{item.student?.user?.email}</div>
                      {item.student?.user?.phone && (
                        <div className="text-[10px] text-gray-400">{item.student.user.phone}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      <div className="flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-custom" />
                        <span>{item.course?.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase">{item.course?.category}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {teacherName}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.teacherSlot ? (
                        <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {item.teacherSlot.dayOfWeek}: {item.teacherSlot.startTime} - {item.teacherSlot.endTime}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>No Slot Picked (Admin Assign)</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isConfirmed ? (
                        <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Confirmed / Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          <AlertCircle className="w-3 h-3" />
                          <span>Pending Confirmation</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!isConfirmed && (
                        <button
                          onClick={() => handleConfirm(item.id)}
                          disabled={loadingId === item.id}
                          className="bg-emerald-custom hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg transition-all text-xs cursor-pointer shadow-sm"
                        >
                          {loadingId === item.id ? "Confirming..." : "Confirm Registration"}
                        </button>
                      )}
                      {isConfirmed && (
                        <span className="text-[11px] text-gray-400 font-semibold">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No 1-on-1 registrations found matching your criteria.
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
