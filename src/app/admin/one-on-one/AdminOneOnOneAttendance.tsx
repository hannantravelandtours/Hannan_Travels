"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAllOneOnOneAttendance } from "@/app/actions/oneOnOneAttendance";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from "lucide-react";

export function AdminOneOnOneAttendance() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  async function loadAttendance() {
    setLoading(true);
    setError(null);
    try {
      const records = await getAllOneOnOneAttendance(selectedDate);
      setAttendanceRecords(records);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">1-on-1 Attendance Record</h2>
          <p className="text-gray-500 text-sm mt-1">View attendance history for all 1-on-1 students</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-none bg-transparent outline-none text-gray-700 font-medium text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Loading attendance records...</div>
      ) : attendanceRecords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500 text-sm">
          No attendance records found for {format(new Date(selectedDate), "MMMM d, yyyy")}.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Teacher</th>
                <th className="py-3 px-6">Course</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceRecords.map((record) => {
                const reg = record.registration;
                const studentName = reg?.student?.user?.name || "Unknown Student";
                // Get teacher from teacher slots
                const teacherName = reg?.teacherSlots?.[0]?.teacher?.user?.name || "Unknown Teacher";
                const courseName = reg?.course?.name || "Unknown Course";

                return (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{studentName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{teacherName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{courseName}</div>
                    </td>
                    <td className="py-4 px-6">
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

