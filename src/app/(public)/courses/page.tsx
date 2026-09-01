"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Clock, Award, Star, Users } from "lucide-react";

import { getActiveCourses } from "@/app/actions/courses";
import { staticCoursesData } from "@/data/staticCourses";

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<any[]>([]);

  useEffect(() => {
    getActiveCourses().then(setAllCourses);
  }, []);



  return (
    <div className="space-y-16 pb-20">
      {/* Header banner */}
      <section 
        className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/HeroSection.png')" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'screen', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 rtl:bg-gradient-to-l rtl:from-black/90 rtl:via-black/70 rtl:to-black/30" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Explore Quranic Curriculums
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-semibold uppercase tracking-wide">
            Select a specialized course matching your goals. Start with a 3-class free trial.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {allCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 animate-fade-in">
            {allCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover-lift"
              >
                <div>
                  {course.bannerImage ? (
                    <div className="relative h-40 w-full overflow-hidden">
                      <img src={course.bannerImage} alt={course.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/90 text-navy-custom text-[10px] font-extrabold uppercase tracking-wide shadow-sm backdrop-blur-sm">
                          {course.category}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                        <h3 className="text-2xl font-sans text-gold-custom-light font-bold tracking-wide drop-shadow-md">
                          {course.name}
                        </h3>
                        <span className="block text-[10px] font-bold tracking-widest text-white uppercase mt-1">
                          {course.subtitle || staticCoursesData[course.id]?.tagline || course.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-emerald-50 text-emerald-custom relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                      <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-5">
                        <BookOpen className="h-32 w-32" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/70 text-[10px] font-extrabold uppercase w-fit tracking-wide shadow-sm">
                        {course.category}
                      </span>
                      <h3 className="text-xl font-extrabold text-navy-custom mt-4">
                        {course.name}
                      </h3>
                    </div>
                  )}

                  <div className="p-6 space-y-4 flex-grow flex flex-col">
                    <p className="text-xs text-gray-500 font-semibold line-clamp-2 leading-relaxed flex-grow">
                      {course.description || staticCoursesData[course.id]?.desc || "Learn the Quran with our expert scholars."}
                    </p>

                    <div className="flex justify-between items-center text-xs font-bold text-gray-600 border-y border-gray-50 py-3 mt-auto">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-emerald-custom-light" />
                        <span>{course.batches?.length || 0} Batches Available</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gold-custom">
                        <Star className="h-4 w-4 fill-gold-custom text-gold-custom" />
                        <span>{course.rating || 5.0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-emerald-custom" />
                        <span>{course.students || 0} Students</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2">
                      <div className="space-y-1">
                        <span className="block text-gray-400 font-medium">Lead Scholar:</span>
                        <span className="block font-bold text-navy-custom">{course.batches?.[0]?.teacher?.user?.name || "Various Scholars"}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-gray-400 font-medium">Schedule:</span>
                        <span className="block font-bold text-emerald-custom text-xs">Varies by Batch</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="p-6 pt-0 flex gap-3 mt-auto">
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 text-center py-2.5 rounded-lg border border-gray-200 hover:border-emerald-custom hover:text-emerald-custom text-xs font-bold text-navy-custom transition-all"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 text-center py-2.5 rounded-lg bg-emerald-custom hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow flex items-center justify-center space-x-1"
                  >
                    <span>View Batches & Trial</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-navy-custom">Loading Courses...</h3>
          </div>
        )}
      </section>
    </div>
  );
}
