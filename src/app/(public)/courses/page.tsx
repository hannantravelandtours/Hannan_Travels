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
                        <span className="block font-bold text-navy-custom">{course.batches?.[0]?.teacher?.user?.name || "Various Scholars"}</span>
                      </div>
                      <div className="text-right">
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
