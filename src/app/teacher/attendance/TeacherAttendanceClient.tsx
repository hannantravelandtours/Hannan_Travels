"use client";

import React, { useState } from "react";
import { markAttendance } from "@/app/actions/teacherActions";
import { Users, CheckCircle, XCircle, Clock, AlertCircle, Calendar } from "lucide-react";

export function TeacherAttendanceClient({ batches, teacherUserId }: { batches: any[], teacherUserId: string }) {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentBatch = batches.find(b => b.id === selectedBatch);
  const students = currentBatch?.registrations || [];
  const pastAttendance = currentBatch?.attendance || [];

  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId);
    setAttendanceState({});
    setSuccess(null);
    setError(null);
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (students.length === 0) return;
    
    const allMarked = students.every((s: any) => attendanceState[s.student.id]);
    if (!allMarked) {
      setError("Please mark attendance for all students.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const records = students.map((s: any) => ({
      studentId: s.student.id,
      status: attendanceState[s.student.id],
    }));

    const res = await markAttendance(selectedBatch, records);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Attendance marked successfully!");
      setAttendanceState({});
    }
    setIsSubmitting(false);
  };

  // Group past attendance by date
  const attendanceByDate: Record<string, any[]> = {};
  pastAttendance.forEach((a: any) => {
    const dateKey = new Date(a.date).toLocaleDateString();
    if (!attendanceByDate[dateKey]) attendanceByDate[dateKey] = [];
    attendanceByDate[dateKey].push(a);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-custom">Mark Attendance</h2>
        <p className="text-sm text-gray-500">Select a batch and mark today's attendance for all students.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm flex items-center space-x-2 border border-emerald-100">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center space-x-2 border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Batch Dropdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Select Batch</label>
        <select
          value={selectedBatch}
          onChange={(e) => handleBatchChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-3 px-4 text-sm outline-none transition-all appearance-none"
        >
          <option value="">Choose a batch...</option>
          {batches.map((b: any) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.course.name} ({b.registrations?.length || 0} students)
            </option>
          ))}
        </select>
      </div>

      {/* Today's Attendance */}
      {selectedBatch && students.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-navy-custom flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-custom" />
              Today's Attendance — {new Date().toLocaleDateString()}
            </h3>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-custom hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition-colors"
            >
              {isSubmitting ? "Saving..." : "Submit Attendance"}
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {students.map((reg: any) => (
              <div key={reg.student.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {reg.student.user.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-navy-custom text-sm">{reg.student.user.name}</span>
                </div>
                <div className="flex space-x-2">
                  {["PRESENT", "ABSENT", "LEAVE"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(reg.student.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        attendanceState[reg.student.id] === status
                          ? status === "PRESENT"
                            ? "bg-emerald-500 text-white"
                            : status === "ABSENT"
                            ? "bg-red-500 text-white"
                            : "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {status === "PRESENT" && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {status === "ABSENT" && <XCircle className="w-3 h-3 inline mr-1" />}
                      {status === "LEAVE" && <Clock className="w-3 h-3 inline mr-1" />}
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBatch && students.length === 0 && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No active students in this batch.</p>
        </div>
      )}

      {/* Previous Attendance History */}
      {selectedBatch && Object.keys(attendanceByDate).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-navy-custom flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              Previous Attendance Records
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {Object.entries(attendanceByDate).slice(0, 10).map(([date, records]) => (
              <div key={date} className="px-6 py-4">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">{date}</div>
                <div className="flex flex-wrap gap-2">
                  {records.map((r: any) => {
                    const studentReg = students.find((s: any) => s.student.id === r.studentId);
                    return (
                      <span
                        key={r.id}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          r.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700"
                            : r.status === "ABSENT"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {studentReg?.student?.user?.name || r.studentId}: {r.status}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
