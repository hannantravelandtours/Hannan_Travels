import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Users, BookOpen, Clock, Calendar, Video, Bell } from "lucide-react";
import Link from "next/link";
import { getAnnouncementsForTeacher } from "@/app/actions/announcements";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div>Please log in</div>;
  }

  // Fetch teacher profile and their batches
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      batches: {
        include: {
          course: true,
          _count: {
            select: { registrations: true }
          }
        }
      }
    }
  });

  if (!teacher) {
    return <div className="p-8 text-center text-gray-500">Teacher profile not found. Please contact administration.</div>;
  }

  const totalStudents = teacher.batches.reduce((acc, batch) => acc + batch._count.registrations, 0);

  const announcements = await getAnnouncementsForTeacher(teacher.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-custom">Teacher Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back, {session.user.name}</p>
      </div>

      {announcements.length > 0 && (
        <div className="space-y-4 mb-8">
          {announcements.map((a: any) => (
            <div key={a.id} className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5 flex items-start space-x-4">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-custom">{a.title}</h4>
                <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{a.message}</p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">{new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Batches</p>
            <h3 className="text-2xl font-bold text-navy-custom">{teacher.batches.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Students</p>
            <h3 className="text-2xl font-bold text-navy-custom">{totalStudents}</h3>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-navy-custom mb-4">My Batches</h3>
      
      {teacher.batches.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
           <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
           <h3 className="text-lg font-bold text-navy-custom">No Batches Assigned</h3>
           <p className="text-gray-500 text-sm mt-2">You haven't been assigned to any batches yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacher.batches.map(batch => (
            <div key={batch.id} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-2 h-full bg-emerald-custom"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-emerald-custom-light uppercase tracking-widest">{batch.course.category}</span>
                  <h4 className="text-lg font-bold text-navy-custom mt-1">{batch.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">{batch.course.name}</p>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-center">
                  <span className="block text-lg font-bold text-navy-custom">{batch._count.registrations}</span>
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Students</span>
                </div>
              </div>
              
              <div className="mt-5 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-semibold text-navy-custom">{batch.daysOfWeek.join(", ")}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-semibold text-navy-custom">{batch.time}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                 <Link href={`/teacher/classes/${batch.id}`} className="text-xs font-bold text-emerald-custom hover:text-emerald-700 transition-colors">
                    Mark Attendance →
                 </Link>
                 
                 <div className="flex space-x-2">
                    <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors" title="Manage Recordings">
                      <Video className="w-4 h-4" />
                    </button>
                    {batch.liveClassLink ? (
                      <a href={batch.liveClassLink} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-emerald-custom text-white hover:bg-emerald-600 rounded-lg text-xs font-bold transition-colors">
                        Start Class
                      </a>
                    ) : (
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold cursor-not-allowed" title="Update link in settings">
                        No Link Set
                      </button>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
