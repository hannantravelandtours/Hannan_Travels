"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, GraduationCap, Globe, Clock, Search, Award } from "lucide-react";

export default function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");

  const specialties = [
    "All",
    "Quran",
    "Tajweed",
    "Hifz",
    "Arabic",
    "Islamic Studies",
    "Kids"
  ];

  const teachers = [
    {
      id: "qari-ahmad",
      name: "Qari Ahmad Raza",
      title: "Senior Tajweed Reciter",
      gender: "Male",
      specialties: ["Quran", "Tajweed", "Hifz"],
      qualifications: "Ijazah in Hafs 'an 'Asim, Al-Azhar graduate",
      experience: "8 Years",
      languages: ["English", "Arabic", "Urdu"],
      rating: 4.9,
      students: 120,
      avatarColor: "bg-emerald-700",
    },
    {
      id: "ustadha-fatima",
      name: "Ustadha Fatima Noor",
      title: "Arabic Grammar Scholar",
      gender: "Female",
      specialties: ["Arabic", "Quran", "Islamic Studies"],
      qualifications: "MA in Arabic Literature, Damascus University",
      experience: "12 Years",
      languages: ["English", "Arabic"],
      rating: 5.0,
      students: 95,
      avatarColor: "bg-teal-700",
    },
    {
      id: "hafiz-abdullah",
      name: "Hafiz Muhammad Abdullah",
      title: "Hifz Quran Specialist",
      gender: "Male",
      specialties: ["Quran", "Hifz"],
      qualifications: "Memorized Quran at age 9, Ijazah in Quran Memorization",
      experience: "6 Years",
      languages: ["English", "Urdu"],
      rating: 4.8,
      students: 74,
      avatarColor: "bg-amber-600",
    },
    {
      id: "ustadha-ayesha",
      name: "Ustadha Ayesha Siddiqua",
      title: "Kids Quran Educator",
      gender: "Female",
      specialties: ["Quran", "Kids", "Islamic Studies"],
      qualifications: "Degree in Child Psychology & Islamic Pedagogy",
      experience: "7 Years",
      languages: ["English", "Urdu"],
      rating: 4.9,
      students: 150,
      avatarColor: "bg-rose-600",
    },
    {
      id: "mufti-ibrahim",
      name: "Mufti Muhammad Ibrahim",
      title: "Islamic Jurisprudence (Fiqh) Mufti",
      gender: "Male",
      specialties: ["Islamic Studies", "Quran", "Tafseer"],
      qualifications: "Shahadat-ul-Almiyah (Equivalent to MA in Islamic Studies)",
      experience: "15 Years",
      languages: ["English", "Arabic", "Urdu"],
      rating: 4.9,
      students: 85,
      avatarColor: "bg-indigo-700",
    },
    {
      id: "dr-sajid",
      name: "Dr. Sajid Rehman",
      title: "Hadith Studies Professor",
      gender: "Male",
      specialties: ["Islamic Studies", "Hadith", "Arabic"],
      qualifications: "PhD in Hadith Sciences, Islamic University of Madinah",
      experience: "18 Years",
      languages: ["Arabic", "English"],
      rating: 5.0,
      students: 60,
      avatarColor: "bg-blue-700",
    },
    {
      id: "ustadha-zainab",
      name: "Ustadha Zainab Al-Mansoor",
      title: "Female Tajweed Scholar",
      gender: "Female",
      specialties: ["Quran", "Tajweed", "Kids"],
      qualifications: "Ijazah in Qira'at (Ten Recitations) with Sanad",
      experience: "10 Years",
      languages: ["Arabic", "English"],
      rating: 4.9,
      students: 110,
      avatarColor: "bg-purple-700",
    },
  ];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.qualifications.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "All" ||
      teacher.specialties.some(
        (s) => s.toLowerCase() === selectedSpecialty.toLowerCase()
      );

    const matchesGender =
      genderFilter === "All" ||
      (genderFilter === "Female Only" && teacher.gender === "Female") ||
      (genderFilter === "Male Only" && teacher.gender === "Male");

    return matchesSearch && matchesSpecialty && matchesGender;
  });

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
            Our Certified Scholars
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-semibold uppercase tracking-wide">
            Learn directly from Ijazah-holding male and female educators from top Islamic institutions.
          </p>
        </div>
      </section>

      {/* Toolbar filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-4 justify-between pb-6 border-b border-gray-100">
          {/* Specialty Filters */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedSpecialty === spec
                    ? "bg-emerald-custom text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-navy-custom"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Gender and Search selectors */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Gender Select */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-navy-custom focus:outline-none focus:border-emerald-custom bg-white cursor-pointer w-full sm:w-auto"
            >
              <option value="All">All Tutors</option>
              <option value="Male Only">Male Scholars</option>
              <option value="Female Only">Female Scholars</option>
            </select>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search teacher, university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-emerald-custom bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Teachers directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeachers.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover-lift p-6"
              >
                <div className="space-y-4">
                  {/* Top Profile Summary */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full ${t.avatarColor} text-white flex items-center justify-center font-black text-2xl shadow-inner`}>
                      {t.name.split(" ").slice(-1)[0].charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-navy-custom">{t.name}</h2>
                      <p className="text-xs text-emerald-custom font-bold">{t.title}</p>
                      <div className="flex items-center space-x-1 text-gold-custom text-xs font-bold pt-1">
                        <Star className="h-3 w-3 fill-gold-custom text-gold-custom" />
                        <span>{t.rating} rating ({t.students} students)</span>
                      </div>
                    </div>
                  </div>

                  {/* Core details list */}
                  <div className="border-t border-gray-50 pt-4 space-y-2 text-xs text-gray-500 font-semibold">
                    <div className="flex items-start space-x-2">
                      <GraduationCap className="h-4 w-4 text-emerald-custom shrink-0 mt-0.5" />
                      <span>{t.qualifications}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-emerald-custom shrink-0" />
                      <span>Experience: {t.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-emerald-custom shrink-0" />
                      <span>Languages: {t.languages.join(", ")}</span>
                    </div>
                  </div>

                  {/* Specialties tag labels */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {t.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded bg-gray-50 text-[10px] text-gray-500 font-bold border border-gray-100 uppercase"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <Link
                    href={`/teachers/${t.id}`}
                    className="flex-1 text-center py-2 text-xs font-bold text-navy-custom hover:text-emerald-custom border border-gray-200 hover:border-emerald-custom rounded-lg transition-all"
                  >
                    View Biography
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center py-2 text-xs font-bold bg-emerald-custom hover:bg-emerald-900 text-white rounded-lg transition-all shadow"
                  >
                    Book Free Trial
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <Award className="h-16 w-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-navy-custom">No Teachers Found</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              No scholars found matching your search. Try broadening your specialty or gender filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("All");
                setGenderFilter("All");
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
