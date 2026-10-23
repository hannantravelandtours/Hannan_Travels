"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  markOneOnOneAttendance,
  getTeacherAllOneOnOneAttendance,
} from "@/app/actions/oneOnOneAttendance";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Info,
} from "lucide-react";

interface OneOnOneAttendanceClientProps {
  students: any[];
  initialRecords?: any[];
  teacherUserId: string;
}

/**
 * Extracts a normalized YYYY-MM-DD date key from any Date, ISO string, or date string
 */
function extractDateKey(dateVal: Date | string): string {
  if (typeof dateVal === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
    return dateVal;
  }
  const d = new Date(dateVal);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Formats a YYYY-MM-DD string into user-friendly components
 */
function formatColumnHeader(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return {
    dayMonth: format(d, "dd MMM"),      // e.g. "23 Oct"
    weekday: format(d, "EEE"),          // e.g. "Fri"
    year: format(d, "yyyy"),            // e.g. "2026"
    fullDate: format(d, "dd MMM yyyy"), // e.g. "23 Oct 2026"
  };
}

export function OneOnOneAttendanceClient({
  students,
  initialRecords = [],
  teacherUserId,
}: OneOnOneAttendanceClientProps) {
  const todayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>(initialRecords);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derive unique past and current attendance dates in chronological order
  const allDateKeys = useMemo(() => {
    const recordedKeys = attendanceRecords.map((r) => extractDateKey(r.date));
    const unique = Array.from(new Set([...recordedKeys, selectedDate]));
    return unique.sort(); // Chronological: oldest to newest
  }, [attendanceRecords, selectedDate]);

  // Yesterday date key for quick jump
  const yesterdayKey = useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return format(y, "yyyy-MM-dd");
  }, []);

  // Helper to find a student's record for a specific date
  const getRecordForStudentAndDate = (registrationId: string, dateKey: string) => {
    return attendanceRecords.find((r) => {
      if (r.registrationId !== registrationId) return false;
      return extractDateKey(r.date) === dateKey;
    });
  };

  // Mark attendance for active selected date
  async function handleMark(
    registrationId: string,
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LEAVE"
  ) {
    const saveKey = `${registrationId}-${selectedDate}`;
    setSavingId(saveKey);
    setError(null);

    // Optimistic update
    const previousRecords = [...attendanceRecords];
    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => {
        if (r.registrationId !== registrationId) return true;
        return extractDateKey(r.date) !== selectedDate;
      });
      return [
        ...filtered,
        {
          id: `opt-${Date.now()}`,
          registrationId,
          studentId,
          date: selectedDate,
          status,
          markedBy: teacherUserId,
          isOneOnOne: true,
        },
      ];
    });

    try {
      await markOneOnOneAttendance({
        registrationId,
        studentId,
        date: selectedDate,
        status,
      });

      // Background sync to ensure DB consistency
      const latest = await getTeacherAllOneOnOneAttendance(teacherUserId);
      setAttendanceRecords(latest);
    } catch (err: any) {
      // Revert on error
      setAttendanceRecords(previousRecords);
      setError(err.message || "Failed to mark attendance");
    } finally {
      setSavingId(null);
    }
  }

  // Refresh all attendance data
  async function reloadAllAttendance() {
    setLoading(true);
    setError(null);
    try {
      const records = await getTeacherAllOneOnOneAttendance(teacherUserId);
      setAttendanceRecords(records);
    } catch (err: any) {
      setError(err.message || "Failed to reload attendance records");
    } finally {
      setLoading(false);
    }
  }

  const activeDateInfo = formatColumnHeader(selectedDate);

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-800">1-on-1 Attendance &amp; History</h2>
            {loading && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />}
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Review previous attendance columns by date and mark attendance for your 1-on-1 students.
          </p>
        </div>

        {/* Date Selector & Quick Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Date Buttons */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setSelectedDate(todayKey)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedDate === todayKey
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(yesterdayKey)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                selectedDate === yesterdayKey
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yesterday
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-inner">
            <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              className="border-none bg-transparent outline-none text-slate-800 text-sm font-semibold cursor-pointer"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xs font-bold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Info Banner: Explaining the History Columns */}
      <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-4 py-2.5 text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Active Marking Date:</strong> {activeDateInfo.fullDate} ({activeDateInfo.weekday}).
            Click any column header or cell below to quickly switch the active date.
          </span>
        </div>
        <div className="font-semibold text-emerald-800 shrink-0 ml-3">
          {allDateKeys.length} {allDateKeys.length === 1 ? "Date Column" : "Date Columns"}
        </div>
      </div>

      {/* Main Attendance Table */}
      {students.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 shadow-sm">
          <p className="text-base font-semibold text-slate-700">No Active 1-on-1 Students</p>
          <p className="text-xs text-slate-400 mt-1">Students assigned to your 1-on-1 classes will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {/* Sticky Student Name Column */}
                  <th className="py-4 px-6 min-w-[190px] sticky left-0 bg-slate-50 z-20 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                    Student Name
                  </th>

                  {/* Course Column */}
                  <th className="py-4 px-5 min-w-[150px]">
                    Course
                  </th>

                  {/* Date Columns: All Previous Attendance Dates + Selected Active Date */}
                  {allDateKeys.map((dateKey) => {
                    const isSelected = dateKey === selectedDate;
                    const isToday = dateKey === todayKey;
                    const colInfo = formatColumnHeader(dateKey);

                    return (
                      <th
                        key={dateKey}
                        onClick={() => setSelectedDate(dateKey)}
                        title={`Click to switch active marking date to ${colInfo.fullDate}`}
                        className={`py-3 px-4 min-w-[130px] text-center cursor-pointer select-none transition-all ${
                          isSelected
                            ? "bg-emerald-100/70 text-emerald-950 border-x-2 border-emerald-500 shadow-inner"
                            : "hover:bg-slate-100/80 text-slate-700"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold tracking-normal">
                              {colInfo.dayMonth}
                            </span>
                            {isSelected ? (
                              <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full normal-case">
                                Active
                              </span>
                            ) : isToday ? (
                              <span className="text-[9px] bg-slate-200 text-slate-700 font-semibold px-1 py-0.2 rounded normal-case">
                                Today
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium normal-case">
                            {colInfo.weekday} • {colInfo.year}
                          </span>
                        </div>
                      </th>
                    );
                  })}

                  {/* Sticky Actions Column */}
                  <th className="py-4 px-6 min-w-[230px] text-right sticky right-0 bg-slate-50 z-20 shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                    <div className="text-right">
                      <span className="block text-xs font-bold text-slate-800 normal-case">
                        Actions ({activeDateInfo.dayMonth})
                      </span>
                      <span className="block text-[10px] text-emerald-600 font-semibold normal-case">
                        Mark for active date
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {students.map((reg) => {
                  const activeRecord = getRecordForStudentAndDate(reg.id, selectedDate);
                  const isSaving = savingId === `${reg.id}-${selectedDate}`;

                  // Calculate student attendance stats
                  const studentRecords = attendanceRecords.filter((r) => r.registrationId === reg.id);
                  const presentCount = studentRecords.filter((r) => r.status === "PRESENT").length;
                  const totalRecorded = studentRecords.length;

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Sticky Student Column */}
                      <td className="py-4 px-6 sticky left-0 bg-white z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                        <div className="font-bold text-slate-900 text-sm">
                          {reg.student.user.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {totalRecorded > 0 ? (
                            <span className="text-emerald-700 font-medium">
                              {presentCount} / {totalRecorded} Present ({Math.round((presentCount / totalRecorded) * 100)}%)
                            </span>
                          ) : (
                            <span>No previous records</span>
                          )}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-4 px-5">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          {reg.course.name}
                        </span>
                      </td>

                      {/* Every Date Column (Past Attendance + Active Date) */}
                      {allDateKeys.map((dateKey) => {
                        const record = getRecordForStudentAndDate(reg.id, dateKey);
                        const isSelected = dateKey === selectedDate;

                        return (
                          <td
                            key={dateKey}
                            onClick={() => setSelectedDate(dateKey)}
                            title={`Click to set ${formatColumnHeader(dateKey).fullDate} as active marking date`}
                            className={`py-3 px-4 text-center cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-emerald-50/60 border-x-2 border-emerald-400"
                                : "hover:bg-slate-100/50"
                            }`}
                          >
                            {record ? (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105 ${
                                  record.status === "PRESENT"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-xs"
                                    : record.status === "ABSENT"
                                    ? "bg-red-100 text-red-800 border border-red-300/80 shadow-xs"
                                    : "bg-amber-100 text-amber-800 border border-amber-300/80 shadow-xs"
                                }`}
                              >
                                {record.status === "PRESENT" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                {record.status === "ABSENT" && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                                {record.status === "LEAVE" && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                                <span>{record.status}</span>
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300 font-mono italic select-none">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}

                      {/* Sticky Actions Column for Active Date */}
                      <td className="py-4 px-6 text-right sticky right-0 bg-white z-10 shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Present Button */}
                          <button
                            type="button"
                            onClick={() => handleMark(reg.id, reg.studentId, "PRESENT")}
                            disabled={isSaving}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeRecord?.status === "PRESENT"
                                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            } disabled:opacity-50`}
                          >
                            {isSaving && activeRecord?.status === "PRESENT" ? (
                              <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                            ) : null}
                            Present
                          </button>

                          {/* Absent Button */}
                          <button
                            type="button"
                            onClick={() => handleMark(reg.id, reg.studentId, "ABSENT")}
                            disabled={isSaving}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeRecord?.status === "ABSENT"
                                ? "bg-red-600 text-white shadow-sm ring-2 ring-red-500/40"
                                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            } disabled:opacity-50`}
                          >
                            {isSaving && activeRecord?.status === "ABSENT" ? (
                              <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                            ) : null}
                            Absent
                          </button>

                          {/* Leave Button */}
                          <button
                            type="button"
                            onClick={() => handleMark(reg.id, reg.studentId, "LEAVE")}
                            disabled={isSaving}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeRecord?.status === "LEAVE"
                                ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/40"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                            } disabled:opacity-50`}
                          >
                            {isSaving && activeRecord?.status === "LEAVE" ? (
                              <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                            ) : null}
                            Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
