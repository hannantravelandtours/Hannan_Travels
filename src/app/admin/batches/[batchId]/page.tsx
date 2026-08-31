export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, CheckCircle, XCircle, Clock, ArrowLeft, Users } from "lucide-react";

export default async function AdminBatchAttendancePage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      course: true,
      teacher: { include: { user: true } },
      attendance: {
        orderBy: { date: "desc" },
        include: {
          batch: true,
        },
      },
      registrations: {
        where: { status: "ACTIVE" },
        include: {
          student: { include: { user: { select: { name: true } } } },
        },
      },
    },
  });

  if (!batch) {
    return <div className="p-8 text-center text-gray-500">Batch not found.</div>;
  }

  // Build a map of studentId -> student name
  const studentNames: Record<string, string> = {};
  batch.registrations.forEach((reg) => {
    studentNames[reg.student.id] = reg.student.user.name;
  });

  // Also check attendance records for student IDs not in current registrations
  batch.attendance.forEach((a) => {
    if (!studentNames[a.studentId]) {
      studentNames[a.studentId] = a.studentId; // fallback to ID
    }
  });

  // Group attendance by date
  const attendanceByDate: Record<string, any[]> = {};
  batch.attendance.forEach((a) => {
    const dateKey = new Date(a.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    if (!attendanceByDate[dateKey]) attendanceByDate[dateKey] = [];
    attendanceByDate[dateKey].push(a);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/batches" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-navy-custom">{batch.name} — Attendance</h2>
          <p className="text-sm text-gray-500">{batch.course.name} • Teacher: {batch.teacher.user.name}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Active Students</p>
            <h3 className="text-xl font-bold text-navy-custom">{batch.registrations.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Calendar className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Records</p>
            <h3 className="text-xl font-bold text-navy-custom">{batch.attendance.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Days Tracked</p>
            <h3 className="text-xl font-bold text-navy-custom">{Object.keys(attendanceByDate).length}</h3>
          </div>
        </div>
      </div>

      {/* Attendance by Date */}
      {Object.keys(attendanceByDate).length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-600">No attendance records yet.</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(attendanceByDate).map(([date, records]) => (
            <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100">
                <span className="text-sm font-bold text-navy-custom flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-emerald-custom" />
                  {date}
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {records.map((record: any) => (
                  <div key={record.id} className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        {(studentNames[record.studentId] || "?").charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-navy-custom">{studentNames[record.studentId] || record.studentId}</span>
                    </div>
                    <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-md ${
                      record.status === "PRESENT"
                        ? "bg-emerald-50 text-emerald-700"
                        : record.status === "ABSENT"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {record.status === "PRESENT" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {record.status === "ABSENT" && <XCircle className="w-3 h-3 mr-1" />}
                      {record.status === "LEAVE" && <Clock className="w-3 h-3 mr-1" />}
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
