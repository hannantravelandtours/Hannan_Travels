import React from "react";
import { BookOpen, Loader2 } from "lucide-react";

export default function CoursesLoading() {
  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      {/* Floating loading notification banner */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-navy-custom/90 text-white border border-emerald-500/30 shadow-2xl backdrop-blur-md text-xs font-semibold">
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>Loading Courses...</span>
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-28 bg-[#0b0908] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-custom/20 border border-emerald-custom/30">
            <BookOpen className="h-4 w-4 text-emerald-400 animate-pulse" />
            <div className="h-3 w-48 bg-white/20 rounded-md animate-pulse" />
          </div>

          <div className="space-y-3 max-w-2xl">
            <div className="h-12 sm:h-16 w-3/4 bg-white/15 rounded-xl animate-pulse" />
            <div className="h-5 w-1/2 bg-white/10 rounded-md animate-pulse" />
          </div>
        </div>
      </section>

      {/* Grid of Course Cards Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-40 bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3.5 w-1/2 bg-gray-150 rounded animate-pulse" />
                  <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="p-5 pt-0 flex gap-2">
                <div className="h-9 flex-1 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-9 flex-1 bg-emerald-100 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}