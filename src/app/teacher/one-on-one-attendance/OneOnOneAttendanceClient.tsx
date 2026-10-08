"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { markOneOnOneAttendance, getTeacherOneOnOneAttendance } from "@/app/actions/oneOnOneAttendance";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from "lucide-react";

export function OneOnOneAttendanceClient({ students, teacherUserId }: { students: any[], teacherUserId: string }) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  async function loadAttendance() {
    setLoading(true);
    setError(null);
    try {
      const records = await getTeacherOneOnOneAttendance(teacherUserId, selectedDate);
      setAttendanceRecords(records);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }

  async function handleMark(registrationId: string, studentId: string, status: "PRESENT" | "ABSENT" | "LEAVE") {
    setSavingId(registrationId);
    setError(null);
    try {
      await markOneOnOneAttendance({
        registrationId,
        studentId,
        date: selectedDate,
        status,
      });
      await loadAttendance(); // Reload to get updated records
    } catch (err: any) {
      setError(err.message || "Failed to mark attendance");
    } finally {
      setSavingId(null);
    }
  }

  const getRecordForRegistration = (registrationId: string) => {
    return attendanceRecords.find(r => r.registrationId === registrationId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">1-on-1 Attendance</h2>
          <p className="text-slate-600 mt-1">Mark daily attendance for your 1-on-1 students</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <CalendarIcon className="w-5 h-5 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-none bg-transparent outline-none text-slate-700 font-medium"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading students and attendance...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
          You don't have any active 1-on-1 students.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Course</th>
                <th className="py-4 px-6">Current Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((reg) => {
                const record = getRecordForRegistration(reg.id);
                const isSaving = savingId === reg.id;

                return (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">
                        {reg.student.user.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600">
                        {reg.course.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {record ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                          ${record.status === "PRESENT" ? "bg-emerald-100 text-emerald-700" :
                            record.status === "ABSENT" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"}`}
                        >
                          {record.status === "PRESENT" && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {record.status === "ABSENT" && <XCircle className="w-3.5 h-3.5" />}
                          {record.status === "LEAVE" && <Clock className="w-3.5 h-3.5" />}
                          {record.status}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Not marked</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleMark(reg.id, reg.studentId, "PRESENT")}
                          disabled={isSaving}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                            ${record?.status === "PRESENT" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "hover:bg-emerald-50 text-emerald-600 border border-emerald-200"
                            } disabled:opacity-50`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMark(reg.id, reg.studentId, "ABSENT")}
                          disabled={isSaving}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                            ${record?.status === "ABSENT" 
                              ? "bg-red-100 text-red-700" 
                              : "hover:bg-red-50 text-red-600 border border-red-200"
                            } disabled:opacity-50`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleMark(reg.id, reg.studentId, "LEAVE")}
                          disabled={isSaving}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                            ${record?.status === "LEAVE" 
                              ? "bg-amber-100 text-amber-700" 
                              : "hover:bg-amber-50 text-amber-600 border border-amber-200"
                            } disabled:opacity-50`}
                        >
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
      )}
    </div>
  );
}

