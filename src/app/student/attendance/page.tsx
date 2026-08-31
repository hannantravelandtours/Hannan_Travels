export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, CheckCircle, XCircle, Clock, BarChart3 } from "lucide-react";

export default async function StudentAttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div>Please log in</div>;
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      registrations: {
        where: { status: "ACTIVE" },
        include: {
          course: true,
          batch: true,
        },
      },
    },
  });

  if (!student) {
    return <div className="p-8 text-center text-gray-500">Student profile not found.</div>;
  }

  // Fetch attendance records for this student
  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: { studentId: student.id },
    include: {
      batch: { include: { course: true } },
    },
    orderBy: { date: "desc" },
  });

  const totalClasses = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(a => a.status === "PRESENT").length;
  const absentCount = attendanceRecords.filter(a => a.status === "ABSENT").length;
  const leaveCount = attendanceRecords.filter(a => a.status === "LEAVE").length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-custom">My Attendance</h2>
        <p className="text-sm text-gray-500">View your attendance records across all courses.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-gray-400">Total Classes</p>
          <h3 className="text-2xl font-bold text-navy-custom">{totalClasses}</h3>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-gray-400">Present</p>
          <h3 className="text-2xl font-bold text-emerald-600">{presentCount}</h3>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-gray-400">Absent</p>
          <h3 className="text-2xl font-bold text-red-600">{absentCount}</h3>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className={`w-14 h-14 rounded-full mx-auto mb-1 flex items-center justify-center font-black text-lg ${
            attendancePercentage >= 80 ? "bg-emerald-50 text-emerald-600" : attendancePercentage >= 50 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
          }`}>
            {attendancePercentage}%
          </div>
          <p className="text-xs font-semibold text-gray-400">Attendance</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-navy-custom flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-emerald-custom" />
            Attendance History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceRecords.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No attendance records found.
                  </td>
                </tr>
              )}
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-navy-custom">
                    {new Date(record.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">{record.batch.course.name}</td>
                  <td className="px-6 py-4 text-xs">{record.batch.name}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-md w-fit ${
                      record.status === "PRESENT"
                        ? "bg-emerald-50 text-emerald-700"
                        : record.status === "ABSENT"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {record.status === "PRESENT" && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                      {record.status === "ABSENT" && <XCircle className="w-3.5 h-3.5 mr-1" />}
                      {record.status === "LEAVE" && <Clock className="w-3.5 h-3.5 mr-1" />}
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
