import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Users, BookOpen, Clock, Calendar, Video, Bell, UserCheck, ExternalLink, Link as LinkIcon } from "lucide-react";
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

  // Fetch 1-on-1 students assigned to this teacher
  const oneOnOneRegistrations = await prisma.registration.findMany({
    where: {
      isOneOnOne: true,
      status: "ACTIVE",
      OR: [
        { teacherSlots: { some: { teacherId: teacher.id } } },
        { preferredTeacherId: teacher.id }
      ]
    },
    include: {
      student: { include: { user: true } },
      course: true,
      oneOnOnePlan: true,
      teacherSlots: true,
    },
    orderBy: { registeredAt: "desc" }
  });

  // Count slots
  const [totalSlotsCount, bookedSlotsCount] = await Promise.all([
    prisma.teacherSlot.count({ where: { teacherId: teacher.id } }),
    prisma.teacherSlot.count({ where: { teacherId: teacher.id, isBooked: true } }),
  ]);

  const batchStudents = teacher.batches.reduce((acc, batch) => acc + batch._count.registrations, 0);
  const totalStudents = batchStudents + oneOnOneRegistrations.length;

  const announcements = await getAnnouncementsForTeacher(teacher.id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-navy-custom">Teacher Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back, {session.user.name}</p>
      </div>

      {announcements.length > 0 && (
        <div className="space-y-4">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">1-on-1 Students</p>
            <h3 className="text-2xl font-bold text-navy-custom">{oneOnOneRegistrations.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Students</p>
            <h3 className="text-2xl font-bold text-navy-custom">{totalStudents}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Booked Slots</p>
            <h3 className="text-2xl font-bold text-navy-custom">{bookedSlotsCount} <span className="text-xs text-gray-400 font-normal">/ {totalSlotsCount}</span></h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Batches</p>
            <h3 className="text-2xl font-bold text-navy-custom">{teacher.batches.length}</h3>
          </div>
        </div>
      </div>

      {/* 1-on-1 Students Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy-custom flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-emerald-custom" />
            My 1-on-1 Students ({oneOnOneRegistrations.length})
          </h3>
          <Link
            href="/teacher/one-on-one"
            className="text-xs font-bold text-emerald-custom hover:text-emerald-700 transition-colors flex items-center space-x-1"
          >
            <span>Manage Slots & Timetable</span>
            <span>→</span>
          </Link>
        </div>

        {oneOnOneRegistrations.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-navy-custom">No 1-on-1 Students Assigned Yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add your available 30-min slots in the 1-on-1 section so students can book you.
            </p>
            <Link
              href="/teacher/one-on-one"
              className="mt-3 inline-block px-4 py-2 bg-emerald-custom text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-all shadow-sm"
            >
              Set Available Slots
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {oneOnOneRegistrations.map((reg) => {
              const slotsText = reg.teacherSlots.length > 0
                ? reg.teacherSlots.map(s => `${s.dayOfWeek.slice(0, 3)} ${s.startTime}-${s.endTime}`).join(", ")
                : "Slots pending confirmation";

              return (
                <div key={reg.id} className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 w-2 h-full bg-emerald-custom" />
                  
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-custom uppercase tracking-wider">1-on-1 Private</span>
                        <h4 className="text-base font-bold text-navy-custom mt-0.5">{reg.student?.user?.name || "Student"}</h4>
                        <p className="text-xs text-gray-500 font-medium">{reg.course.name}</p>
                      </div>
                      {reg.oneOnOnePlan && (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                          {reg.oneOnOnePlan.title}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{slotsText}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href="/teacher/one-on-one-attendance"
                      className="text-xs font-bold text-emerald-custom hover:text-emerald-700"
                    >
                      Mark Attendance →
                    </Link>

                    <div className="flex items-center space-x-2">
                      {reg.classLink ? (
                        <a
                          href={reg.classLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-custom text-white hover:bg-emerald-600 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Enter Class</span>
                        </a>
                      ) : (
                        <Link
                          href="/teacher/send-link"
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Set Link</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Batches Section (if any) */}
      {teacher.batches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-navy-custom mb-4">My Batches ({teacher.batches.length})</h3>
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
        </div>
      )}
    </div>
  );
}
