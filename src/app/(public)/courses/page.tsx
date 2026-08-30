"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Search, Clock, Award, Star, Users } from "lucide-react";

import { getActiveCourses } from "@/app/actions/courses";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allCourses, setAllCourses] = useState<any[]>([]);

  useEffect(() => {
    getActiveCourses().then(setAllCourses);
  }, []);

  const categories = [
    "All",
    "Quran",
    "Tajweed",
    "Hifz",
    "Arabic",
    "Islamic Studies",
    "Kids",
    "Female Only"
  ];

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      course.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(course.category?.toLowerCase() || "");

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Header banner */}
      <section className="bg-emerald-custom/5 py-12 text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-navy-custom">
            Explore Quranic Curriculums
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide">
            Select a specialized course matching your goals. Start with a 3-class free trial.
          </p>
        </div>
      </section>

      {/* Filters and Search toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between pb-6 border-b border-gray-100">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-custom text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-navy-custom"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search course or teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-emerald-custom bg-white"
            />
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredCourses.map((course) => (
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
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-lg font-extrabold text-white">
                          {course.name}
                        </h3>
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
                      {course.description || "Learn the Quran with our expert scholars."}
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
            <h3 className="text-lg font-bold text-navy-custom">No Courses Found</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              We couldn't find any courses matching your search criteria. Try removing filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-5 py-2 text-xs font-bold rounded-full bg-emerald-custom text-white"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
