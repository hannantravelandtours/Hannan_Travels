"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export function CoursesClient({ courses }: { courses: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-custom">Manage Courses</h2>
          <p className="text-sm text-gray-500">View static course offerings. Batches can be created for these courses in the Batches tab.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className={`bg-white rounded-2xl shadow-sm border ${course.isActive ? 'border-gray-100' : 'border-gray-200 opacity-75'} p-6 relative flex flex-col`}>
             <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                  course.category === 'QAIDA' ? 'bg-blue-50 text-blue-600' :
                  course.category === 'NAZRA' || course.category === 'HIFZ' ? 'bg-amber-50 text-amber-600' :
                  course.category === 'QURAN' || course.category === 'TAJWEED' ? 'bg-purple-50 text-purple-600' :
                  'bg-emerald-50 text-emerald-custom'
                }`}>
                  {course.category}
                </span>
             </div>

             <div className="flex items-start space-x-4 mb-4">
                {course.bannerImage ? (
                  <img src={course.bannerImage} alt={course.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-custom border border-emerald-100">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-navy-custom text-lg">{course.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{course.batches?.length || 0} active batches</p>
                </div>
             </div>

             {course.description && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-grow">
                  {course.description}
                </p>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}
