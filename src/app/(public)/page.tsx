"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { 
  BookOpen, 
  CheckCircle, 
  Users, 
  Globe, 
  Award, 
  ArrowRight, 
  Star, 
  Clock, 
  UserCheck, 
  MapPin, 
  ShieldCheck, 
  TrendingUp,
  Bookmark,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

import { getActiveCourses } from "@/app/actions/courses";

export default function HomePage() {
  const { t, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const [activeTab, setActiveTab] = useState("All");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    getActiveCourses().then(setCourses);
  }, []);

  const stats = [
    { value: "100+", label: "Active Students", icon: Users },
    { value: "20+", label: "Expert Teachers", icon: UserCheck },
    { value: t("stats.countries"), label: "Global Reach", icon: Globe },
    { value: "99%", label: "Parent Satisfaction", icon: Award },
  ];

  const whyChooseUs = [
    {
      title: "Qualified Quran Teachers",
      desc: "Our tutors are certified graduates from prestigious Islamic Universities (like Al-Azhar) with years of experience teaching online.",
      icon: UserCheck,
    },
    {
      title: "One-to-One Sessions",
      desc: "Get 100% focused attention. The teacher adjusts their pace and curriculum strictly to match the student's personal learning style.",
      icon: Users,
    },
    {
      title: "Flexible Timings",
      desc: "Learn from the comfort of your home. We schedule classes 24/7 to accommodate international timezones and busy academic schedules.",
      icon: Clock,
    },
    {
      title: "Personalized Learning",
      desc: "Customized lesson plans for kids, females, and adult beginners. Track your individual progress milestone-by-milestone.",
      icon: Bookmark,
    },
    {
      title: "Progress Tracking",
      desc: "Access portal dashboards providing real-time session logs, syllabus progression percentages, and monthly teacher evaluations.",
      icon: TrendingUp,
    },
    {
      title: "International Students",
      desc: "Connecting thousands of families across Pakistan, United Kingdom, USA, Canada, UAE, and Australia in one global classroom.",
      icon: Globe,
    },
    {
      title: "Safe Learning Environment",
      desc: "Fully secure online portal tailored to children's safety guidelines with options for female teachers for female students.",
      icon: ShieldCheck,
    },
    {
      title: "Certified Courses",
      desc: "Receive recognized certificates and digital badges verified via QR codes upon completion of core tajweed and hifz modules.",
      icon: Award,
    },
  ];



  const testimonials = [
    {
      name: "Dr. Bilal Mahmood",
      role: "Parent of 2 students",
      country: "United Kingdom",
      review: "Finding reliable Quran teachers in London was a struggle until we joined Hannan Consultants. The one-to-one classes are excellent, and the student portal lets us check exactly what Surahs our kids memorized each week. The female teacher is fantastic and incredibly patient.",
      rating: 5,
    },
    {
      name: "Sarah Jenkins (Zainab)",
      role: "Revert / Adult Learner",
      country: "Canada",
      review: "As an adult beginner, I was hesitant to start reading Arabic. My teacher, Sheikh Ahmad, makes the Tajweed rules so easy to grasp. The scheduling flexibility means I can take my class after work hours. Truly a premium experience.",
      rating: 5,
    },
    {
      name: "Tariq Al-Mansoor",
      role: "Father of Hifz Student",
      country: "United Arab Emirates",
      review: "My son completed memorization of 5 Juz in just 8 months here. The systematic revision schedule is superb. The Admin dashboard for tracking invoices and progress report updates is seamless. Jazakallah Khair to the faculty!",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const filteredCourses = activeTab === "All"
    ? courses
    : courses.filter(c => c.category.toLowerCase().includes(activeTab.toLowerCase()) || activeTab.toLowerCase().includes(c.category.toLowerCase()));

  const courseCategories = ["All", "Quran", "Tajweed", "Hifz", "Arabic", "Islamic Studies", "Kids"];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section 
        className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-28 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/HeroSection.png')" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'screen', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        {/* Subtle gradient overlay to darken background behind left-aligned text, keeping right side fully visible and sharp */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10 rtl:bg-gradient-to-l rtl:from-black/90 rtl:via-black/60 rtl:to-black/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left rtl:text-right flex flex-col items-start rtl:items-end space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full bg-emerald-custom/20 text-white font-semibold text-xs border border-emerald-custom/30">
            <BookOpen className="h-4 w-4 text-gold-custom-light" />
            <span>{t("hero.badge")}</span>
          </div>

          {/* Title & Hadith Header (Contained on left half) */}
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans text-gold-custom-light font-bold tracking-wide drop-shadow-md">
                Al-Hannan
              </h1>
              <span className="block text-xl sm:text-2xl font-bold tracking-widest text-gold-custom uppercase">
                Quran Institute
              </span>
            </div>
            
            <div className="py-6 border-y border-white/10 my-6 space-y-4 text-left rtl:text-right">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gold-custom leading-normal font-medium drop-shadow-sm text-left rtl:text-right" dir="rtl">
                خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
              </p>
              <p className="text-base sm:text-lg text-gray-200 font-serif leading-relaxed italic">
                "The best among you are those who learn the Qur'an and teach it."
              </p>
              <p className="text-xs text-gold-custom-light font-bold uppercase tracking-widest">
                Sahih al-Bukhari (5027)
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-start rtl:justify-end gap-4 pt-2">
              <Link
                href="/courses"
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-emerald-custom hover:bg-emerald-900 transition-all shadow-lg hover-lift flex items-center space-x-2 rtl:space-x-reverse"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/courses"
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-transparent border border-white/30 hover:border-white hover:bg-white/10 transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse"
              >
                <span>Explore Courses</span>
              </Link>
            </div>

            {/* Quick visual checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-8 text-xs sm:text-sm text-gray-200">
              <div className="flex items-center space-x-3 rtl:space-x-reverse font-semibold">
                <svg className="h-5 w-5 text-gold-custom shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" className="stroke-gold-custom" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                <span>24/7 Schedule Flexibility</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse font-semibold">
                <svg className="h-5 w-5 text-gold-custom shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" className="stroke-gold-custom" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                <span>Certified Female Scholars</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse font-semibold">
                <svg className="h-5 w-5 text-gold-custom shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" className="stroke-gold-custom" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                <span>Interactive Virtual Portal</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse font-semibold">
                <svg className="h-5 w-5 text-gold-custom shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" className="stroke-gold-custom" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                <span>3-Class Free Trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM MARQUEE TICKER */}
      <section className="bg-stone-50/50 py-8 border-b border-gray-150 relative overflow-hidden !mt-0">
        {/* Left and Right Fade-out Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-stone-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-stone-50/80 to-transparent z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="block text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase text-center mb-6">
            BUILT ON RELIABILITY, TRANSPARENCY & SPIRITUAL RESULTS
          </span>
        </div>

        {/* Ticker Flex container (Moving Left) */}
        <div className="w-full overflow-hidden flex relative select-none">
          <div className="animate-marquee flex whitespace-nowrap">
            {[
              "Noorani Qaida",
              "Quran Reading",
              "Tajweed",
              "Arabic Language Grammar",
              "Islamic Studies & Fiqh",
              "Tafseer",
              "Hajj & Umrah Information"
            ].map((topic, i) => (
              <div
                key={i}
                className="mx-6 text-sm sm:text-base font-extrabold tracking-wider uppercase text-navy-custom shrink-0 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-custom mr-6 opacity-40"></span>
                {topic}
              </div>
            ))}
          </div>
          {/* Duplicate of the identical items list to build seamless infinite loop */}
          <div className="animate-marquee flex whitespace-nowrap" aria-hidden="true">
            {[
              "Noorani Qaida",
              "Quran Reading",
              "Tajweed",
              "Arabic Language Grammar",
              "Islamic Studies & Fiqh",
              "Tafseer",
              "Hajj & Umrah Information"
            ].map((topic, i) => (
              <div
                key={`dup-${i}`}
                className="mx-6 text-sm sm:text-base font-extrabold tracking-wider uppercase text-navy-custom shrink-0 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-custom mr-6 opacity-40"></span>
                {topic}
              </div>
            ))}
          </div>
        </div>

        {/* Ticker Flex container 2 (Moving Right) */}
        <div className="w-full overflow-hidden flex relative select-none mt-4">
          <div className="animate-marquee-reverse flex whitespace-nowrap">
            {[
              "Advanced Memorization",
              "Dua & Supplications",
              "Seerah of Prophet (PBUH)",
              "Hadith Studies",
              "Qira'at & Maqamat",
              "Online Ijaza Program",
              "Daily Sunnah"
            ].map((topic, i) => (
              <div
                key={i}
                className="mx-6 text-sm sm:text-base font-extrabold tracking-wider uppercase text-navy-custom shrink-0 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold-custom mr-6 opacity-60"></span>
                {topic}
              </div>
            ))}
          </div>
          {/* Duplicate of the identical items list to build seamless infinite loop */}
          <div className="animate-marquee-reverse flex whitespace-nowrap" aria-hidden="true">
            {[
              "Advanced Memorization",
              "Dua & Supplications",
              "Seerah of Prophet (PBUH)",
              "Hadith Studies",
              "Qira'at & Maqamat",
              "Online Ijaza Program",
              "Daily Sunnah"
            ].map((topic, i) => (
              <div
                key={`dup2-${i}`}
                className="mx-6 text-sm sm:text-base font-extrabold tracking-wider uppercase text-navy-custom shrink-0 flex items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold-custom mr-6 opacity-60"></span>
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-white py-12 border-y border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-xl bg-emerald-custom/5 text-emerald-custom mb-1">
                    <StatIcon className="h-5 w-5 text-gold-custom" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-navy-custom">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-custom uppercase tracking-widest bg-emerald-custom/5 px-3 py-1 rounded-full">
            Premium Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-custom tracking-tight">
            Why Choose Our Quran Academy?
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
            We provide a complete interactive ecosystem customized to solve common online learning challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((card, idx) => {
            const CardIcon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-emerald-custom/25 shadow-sm hover-lift flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-custom/5 rounded-xl text-emerald-custom w-fit">
                    <CardIcon className="h-6 w-6 text-emerald-custom" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-custom">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COURSES MARKETPLACE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-gray-100">
          <div className="space-y-2 text-center md:text-left rtl:md:text-right">
            <h2 className="text-3xl font-extrabold text-navy-custom">
              Our Featured Quranic Syllabuses
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Enroll in specialized, structured courses tailored for all age groups.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-sm font-bold text-emerald-custom hover:text-emerald-900 flex items-center space-x-1 rtl:space-x-reverse"
          >
            <span>Explore All 10+ Courses</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {courseCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === cat
                  ? "bg-emerald-custom text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-navy-custom"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover-lift"
            >
              <div>
                {/* Visual Header */}
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
                  <div className={`p-8 relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                    course.category.toLowerCase().includes('arabic') ? 'bg-blue-50 text-blue-600' :
                    course.category.toLowerCase().includes('islamic') ? 'bg-amber-50 text-amber-600' :
                    course.category.toLowerCase().includes('tajweed') ? 'bg-purple-50 text-purple-600' :
                    'bg-emerald-50 text-emerald-custom'
                  }`}>
                    <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-5">
                      <BookOpen className="h-32 w-32" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/70 text-[10px] font-extrabold uppercase w-fit tracking-wide shadow-sm text-navy-custom">
                      {course.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-navy-custom mt-4">
                      {course.name}
                    </h3>
                  </div>
                )}

                {/* Details list */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-500 font-semibold line-clamp-2 leading-relaxed">
                    {course.description || "Learn the Quran with our expert scholars."}
                  </p>

                  <div className="flex justify-between items-center text-xs font-bold text-gray-600 border-y border-gray-50 py-3">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Clock className="h-4 w-4 text-emerald-custom-light" />
                      <span>{course.batches?.length || 0} Batches Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-6 pt-0 flex gap-3">
                <Link
                  href={`/courses/${course.id}`}
                  className="flex-1 text-center py-2.5 rounded-lg border border-gray-200 hover:border-emerald-custom hover:text-emerald-custom text-xs font-bold text-navy-custom transition-all"
                >
                  View Curriculum
                </Link>
                <Link
                  href="/courses"
                  className="flex-1 text-center py-2.5 rounded-lg bg-emerald-custom hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-emerald-custom/5 py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-custom uppercase tracking-wider">
              Student Stories
            </span>
            <h2 className="text-3xl font-extrabold text-navy-custom">
              Trusted by Hundreds of Muslim Families Globally
            </h2>
          </div>

          {/* Testimonial Box */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-custom/10 relative">
            <span className="absolute top-6 left-8 rtl:left-auto rtl:right-8 text-7xl font-serif text-emerald-custom/10 pointer-events-none">
              “
            </span>

            <div className="space-y-6">
              <div className="flex justify-center space-x-1 rtl:space-x-reverse">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold-custom text-gold-custom" />
                ))}
              </div>
              <p className="text-base sm:text-lg text-navy-custom/90 leading-relaxed font-medium italic">
                "{testimonials[activeTestimonial].review}"
              </p>
              <div>
                <h4 className="text-base font-bold text-navy-custom">
                  {testimonials[activeTestimonial].name}
                </h4>
                <p className="text-xs text-gray-500 font-semibold">
                  {testimonials[activeTestimonial].role} — {testimonials[activeTestimonial].country}
                </p>
              </div>
            </div>

            {/* Slider Navigation */}
            <div className="flex justify-center space-x-3 rtl:space-x-reverse pt-6">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-gray-200 hover:border-emerald-custom hover:bg-emerald-50 text-navy-custom transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-gray-200 hover:border-emerald-custom hover:bg-emerald-50 text-navy-custom transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA REGISTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="emerald-gradient rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6 relative overflow-hidden">
          {/* Subtle Islamic pattern bg */}
          <div className="absolute inset-0 bg-islamic-pattern opacity-5" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {t("cta.banner.title")}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 font-semibold">
              {t("cta.banner.subtitle")}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold-custom hover:bg-gold-custom-dark text-navy-custom text-sm font-bold shadow-md hover-lift transition-colors"
              >
                Book My Free Trial Now
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 hover:border-white text-white text-sm font-bold transition-all hover:bg-white/10"
              >
                Contact Admissions Office
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
