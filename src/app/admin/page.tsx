import React from "react";
import { prisma } from "@/lib/prisma";
import { Users, GraduationCap, BookOpen, Clock, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Fetch aggregate stats
  const [
    totalStudents,
    totalOneOnOneStudents,
    totalTeachers,
    totalCourses,
    totalBatches,
    recentRegistrations,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.registration.count({ where: { isOneOnOne: true, status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.course.count({ where: { isActive: true } }),
    prisma.batch.count(),
    prisma.registration.findMany({
      take: 6,
      orderBy: { registeredAt: "desc" },
      include: {
        student: { include: { user: true } },
        course: true,
        oneOnOnePlan: true,
      },
    }),
  ]);

  const stats = [
    { name: "Total Students", value: totalStudents, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "1-on-1 Students", value: totalOneOnOneStudents, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { name: "Total Teachers", value: totalTeachers, icon: GraduationCap, color: "text-teal-500", bg: "bg-teal-500/10" },
    { name: "Active Courses", value: totalCourses, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Total Batches", value: totalBatches, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-custom">Admin Overview</h2>
        <p className="text-sm text-gray-500">Welcome to the Al-Hannan administrative dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-3 sm:space-x-4">
              <div className={`p-3 sm:p-4 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400">{stat.name}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-navy-custom">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy-custom">Recent Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Mode / Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentRegistrations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No recent registrations found.
                  </td>
                </tr>
              )}
              {recentRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy-custom">
                    {reg.student.user.name}
                  </td>
                  <td className="px-6 py-4">
                    {reg.course.name} <span className="text-xs text-gray-400">({reg.course.category})</span>
                  </td>
                  <td className="px-6 py-4">
                    {reg.isOneOnOne ? (
                      <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200/60">
                        1-on-1 ({reg.oneOnOnePlan?.title || "Custom"})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200/60">
                        Batch Class
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                      reg.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                      reg.status === "PENDING_EMAIL_VERIFICATION" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {reg.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(reg.registeredAt).toLocaleDateString()}
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
