"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Search, Clock, Award, Star, Users } from "lucide-react";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const allCourses = [
    {
      id: "noorani-qaida",
      title: "Noorani Qaida",
      category: "Quran",
      desc: "Learn basic Arabic alphabets, letter joints, correct pronunciation, and basic phonics. Essential foundation for reading the Quran.",
      duration: "3-4 Months",
      level: "Beginner",
      rating: 4.9,
      students: 840,
      price: "$35/mo",
      teacher: "Mufti Ibrahim",
      imageBg: "bg-emerald-50 text-emerald-custom",
    },
    {
      id: "quran-reading",
      title: "Quran Reading",
      category: "Quran",
      desc: "Practice reading the full Quran with flow, correct pronunciation, and breathing pauses. Suitable for those who completed Noorani Qaida.",
      duration: "6-8 Months",
      level: "Beginner",
      rating: 4.8,
      students: 1100,
      price: "$40/mo",
      teacher: "Sheikh Mahmoud",
      imageBg: "bg-emerald-50 text-emerald-custom",
    },
    {
      id: "quran-tajweed",
      title: "Quran with Tajweed",
      category: "Tajweed",
      desc: "Learn the formal rules of Tajweed (Makharij, Sifaat, Madd, Noon Sakinah) to recite beautifully with rules like a professional Qari.",
      duration: "6-12 Months",
      level: "Intermediate",
      rating: 4.9,
      students: 680,
      price: "$45/mo",
      teacher: "Qari Ahmad Raza",
      imageBg: "bg-teal-50 text-teal-700",
    },
    {
      id: "hifz-quran",
      title: "Hifz-ul-Quran Memorization",
      category: "Hifz",
      desc: "Structured, 1-on-1 memorization program designed for students wanting to memorize specific Juz or become a complete Hafiz/Hafiza.",
      duration: "2-3 Years",
      level: "Advanced",
      rating: 5.0,
      students: 230,
      price: "$60/mo",
      teacher: "Hafiz Abdullah",
      imageBg: "bg-amber-50 text-amber-700",
    },
    {
      id: "arabic-language",
      title: "Arabic Language Grammar",
      category: "Arabic",
      desc: "Build comprehensive skills in Classical and Modern Arabic. Focuses on vocabulary, verb conjugation, and direct translation of Quran verses.",
      duration: "12 Months",
      level: "Intermediate",
      rating: 4.7,
      students: 190,
      price: "$50/mo",
      teacher: "Ustadha Fatima Noor",
      imageBg: "bg-blue-50 text-blue-700",
    },
    {
      id: "islamic-studies",
      title: "Islamic Studies & Fiqh",
      category: "Islamic Studies",
      desc: "Study pillars of Islam, Hadith, Seerah, Islamic history, and jurisprudence (Fiqh) relative to daily acts of worship.",
      duration: "6 Months",
      level: "Beginner",
      rating: 4.9,
      students: 340,
      price: "$35/mo",
      teacher: "Dr. Sajid Rehman",
      imageBg: "bg-purple-50 text-purple-700",
    },
    {
      id: "tafseer-quran",
      title: "Tafseer (Quran Explanation)",
      category: "Islamic Studies",
      desc: "Understand the deep historical contexts, background reasons for revelation, and theological interpretations of Quranic verses.",
      duration: "12 Months",
      level: "Advanced",
      rating: 4.8,
      students: 150,
      price: "$55/mo",
      teacher: "Mufti Muhammad Ibrahim",
      imageBg: "bg-indigo-50 text-indigo-700",
    },
    {
      id: "hadith-studies",
      title: "Hadith Studies (Riyadhus Saliheen)",
      category: "Islamic Studies",
      desc: "Analysis of prophetic traditions (Hadith), learning their context, authenticity, and practical application in everyday life.",
      duration: "6 Months",
      level: "Intermediate",
      rating: 4.9,
      students: 120,
      price: "$45/mo",
      teacher: "Dr. Sajid Rehman",
      imageBg: "bg-rose-50 text-rose-700",
    },
    {
      id: "quran-for-kids",
      title: "Quran Classes for Kids",
      category: "Kids",
      desc: "Fun, engaging, and gamified Quran learning customized to capture children's focus. Combines reading, short Surah memorization, and Islamic manners.",
      duration: "Flexible",
      level: "Beginner",
      rating: 4.9,
      students: 790,
      price: "$35/mo",
      teacher: "Ustadha Ayesha Siddiqua",
      imageBg: "bg-rose-50 text-rose-700",
    },
    {
      id: "quran-for-females",
      title: "Quran Classes for Females",
      category: "Female Only",
      desc: "1-on-1 private lessons conducted exclusively by certified, native female scholars in a secure online setting. Covers Tajweed, Hifz, or Fiqh.",
      duration: "Flexible",
      level: "All Levels",
      rating: 5.0,
      students: 540,
      price: "$45/mo",
      teacher: "Ustadha Fatima Noor",
      imageBg: "bg-pink-50 text-pink-700",
    },
    {
      id: "hajj-information",
      title: "Hajj Information",
      category: "Islamic Studies",
      desc: "Complete guide on Hajj and Umrah performance. Includes step-by-step procedures, practical rules, supplications, and spiritual guidelines.",
      duration: "1 Month",
      level: "Beginner",
      rating: 4.9,
      students: 95,
      price: "$25/mo",
      teacher: "Mufti Muhammad Ibrahim",
      imageBg: "bg-amber-50 text-amber-700",
    },
  ];

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      course.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(course.category.toLowerCase());

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
                  <div className={`p-8 ${course.imageBg} relative overflow-hidden flex flex-col justify-between min-h-[140px]`}>
                    <span className="px-3 py-1 rounded-full bg-white/70 text-[10px] font-extrabold uppercase w-fit tracking-wide shadow-sm">
                      {course.category}
                    </span>
                    <h2 className="text-xl font-extrabold text-navy-custom mt-4">
                      {course.title}
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed line-clamp-3">
                      {course.desc}
                    </p>

                    <div className="flex justify-between items-center text-xs font-bold text-gray-600 border-y border-gray-50 py-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-emerald-custom-light" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gold-custom">
                        <Star className="h-4 w-4 fill-gold-custom text-gold-custom" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-emerald-custom" />
                        <span>{course.students} Students</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="block text-gray-400 font-semibold">Tutor:</span>
                        <span className="block font-bold text-navy-custom">{course.teacher}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-emerald-custom text-xs">Varies by Batch</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-grow text-center py-2.5 rounded-lg border border-gray-200 hover:border-emerald-custom hover:text-emerald-custom text-xs font-bold text-navy-custom transition-all"
                  >
                    Curriculum Details
                  </Link>
                  <Link
                    href="/register"
                    className="flex-grow text-center py-2.5 rounded-lg bg-emerald-custom hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow"
                  >
                    Start Free Trial
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
