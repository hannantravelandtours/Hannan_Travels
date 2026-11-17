import React from "react";
import { BookOpen, Loader2 } from "@/components/Icons";

export default function CourseDetailsLoading() {
  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      {/* Floating loading notification banner */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-navy-custom/90 text-white border border-emerald-500/30 shadow-2xl backdrop-blur-md text-xs font-semibold">
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>Loading 1-on-1 Course Details & Slots...</span>
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-28 bg-[#0b0908] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-36 bg-white/10 rounded-md animate-pulse" />

          {/* Badge skeleton */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-custom/20 border border-emerald-custom/30">
            <BookOpen className="h-4 w-4 text-emerald-400 animate-pulse" />
            <div className="h-3 w-44 bg-white/20 rounded-md animate-pulse" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-3 max-w-2xl">
            <div className="h-12 sm:h-16 w-3/4 bg-white/15 rounded-xl animate-pulse" />
            <div className="h-5 w-1/2 bg-white/10 rounded-md animate-pulse" />
          </div>

          {/* Highlights pills skeleton */}
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="h-8 w-28 bg-white/10 rounded-full animate-pulse" />
            <div className="h-8 w-32 bg-white/10 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column (Overview & Curriculum) */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you will learn card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-150 shadow-sm space-y-5">
              <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 shrink-0 animate-pulse" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-4/5 bg-gray-150 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Overview skeleton */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-150 shadow-sm space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-150 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-150 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-150 rounded animate-pulse" />
              </div>
            </div>

            {/* Curriculum Accordion skeleton */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-150 shadow-sm space-y-4">
              <div className="h-6 w-44 bg-gray-200 rounded-md animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 1-on-1 Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-emerald-100 shadow-md space-y-6">
              <div className="space-y-2 pb-4 border-b border-gray-100">
                <div className="h-5 w-40 bg-emerald-100 rounded animate-pulse" />
                <div className="h-3.5 w-52 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Package tabs skeleton */}
              <div className="space-y-2">
                <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                  <div className="h-10 bg-emerald-50 border border-emerald-200 rounded-xl animate-pulse" />
                  <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* Price card skeleton */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-2">
                <div className="h-7 w-32 bg-emerald-200 rounded animate-pulse" />
                <div className="h-3 w-40 bg-emerald-100 rounded animate-pulse" />
              </div>

              {/* Slots grid skeleton */}
              <div className="space-y-2">
                <div className="h-3.5 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-9 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>

              {/* CTA button skeleton */}
              <div className="h-12 bg-emerald-custom/40 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}