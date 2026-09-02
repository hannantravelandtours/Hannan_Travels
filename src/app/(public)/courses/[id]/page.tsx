"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { getCourseDetails } from "@/app/actions/courses";
import { staticCoursesData, CourseDetails } from "@/data/staticCourses";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Star, 
  Users, 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  UserCheck, 
  Calendar,
  AlertCircle
} from "lucide-react";

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number | null>(0);
  const [course, setCourse] = useState<any>(null);
  const [trialVideo, setTrialVideo] = useState<string | null>(null);

  const courseStaticInfo = staticCoursesData[id];

  useEffect(() => {
    getCourseDetails(id).then(setCourse);
  }, [id]);

  if (!course) {
    return <div className="py-32 text-center text-gray-500 font-bold">Loading Course...</div>;
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Course Hero Banner */}
      <section 
        className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-28 bg-cover bg-center text-white"
        style={{ backgroundImage: `url('${course.bannerImage || courseStaticInfo?.bannerImage || "/HeroSection.png"}')` }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'screen', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10 rtl:bg-gradient-to-l rtl:from-black/90 rtl:via-black/60 rtl:to-black/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left rtl:text-right flex flex-col items-start rtl:items-end space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full bg-emerald-custom/20 text-white font-semibold text-xs border border-emerald-custom/30">
            <BookOpen className="h-4 w-4 text-gold-custom-light" />
            <span>Curated Islamic Education Pathways</span>
          </div>

          <div className="space-y-6 max-w-2xl">
            <Link href="/courses" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
              <span className="mr-2 rtl:hidden">←</span>
              <span className="mr-2 hidden rtl:inline">→</span>
              Back to Services
            </Link>
            
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans text-gold-custom-light font-bold tracking-wide drop-shadow-md">
                {course.name}
              </h1>
              <span className="block text-xl sm:text-2xl font-bold tracking-widest text-white uppercase">
                {course.subtitle || courseStaticInfo?.tagline || course.category}
              </span>
            </div>

            <div className="py-6 border-y border-white/10 my-6 space-y-4 text-left rtl:text-right">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gold-custom leading-normal font-medium drop-shadow-sm text-left rtl:text-right" dir="rtl">
                إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ
              </p>
              <p className="text-base sm:text-lg text-gray-200 font-serif leading-relaxed italic">
                "Indeed, this Qur'an guides to that which is most suitable and correct."
              </p>
              <p className="text-xs text-gold-custom-light font-bold uppercase tracking-widest">
                Surah Al-Isra (17:9)
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-start rtl:justify-end gap-4">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-emerald-custom hover:bg-emerald-900 transition-all shadow-lg hover-lift flex items-center space-x-2 rtl:space-x-reverse"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main details grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Details column */}
          <div className="lg:col-span-8 space-y-12">
            
            <div className="flex flex-wrap gap-4 sm:gap-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-sm font-semibold text-navy-custom">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-gold-custom text-gold-custom" />
                <span className="text-gray-700">{courseStaticInfo?.rating || 4.9} Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-custom" />
                <span className="text-gray-700">{course.batches?.length || 0} Batches</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-emerald-custom" />
                <span className="text-gray-700">Level: {courseStaticInfo?.level || "Beginner"}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Course Overview</h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed whitespace-pre-line">
                {course.description || courseStaticInfo?.desc}
              </p>
            </div>

            <div className="bg-emerald-custom/5 p-6 sm:p-8 rounded-2xl space-y-4 border border-emerald-custom/10">
              <h2 className="text-xl font-bold text-navy-custom">What You Will Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {courseStaticInfo?.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-emerald-custom shrink-0 mt-0.5" />
                    <span className="text-xs text-navy-custom/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Course Curriculum</h2>
              <div className="space-y-3">
                {courseStaticInfo?.curriculum.map((module, idx) => {
                  const isOpen = expandedCurriculum === idx;
                  return (
                    <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setExpandedCurriculum(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-navy-custom hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-custom/10 text-emerald-custom text-[10px] uppercase font-bold">
                            {module.week}
                          </span>
                          <span>{module.title}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="p-5 pt-0 border-t border-gray-50 bg-gray-50/50">
                          <ul className="space-y-2 text-xs text-gray-500 font-semibold pt-4">
                            {module.details.map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-custom shrink-0"></span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Prerequisites & Requirements</h2>
              <ul className="space-y-3">
                {courseStaticInfo?.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-gray-500 font-semibold">
                    <AlertCircle className="h-4 w-4 text-emerald-custom shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-bold text-navy-custom mb-6 border-b border-gray-100 pb-4">Available Batches</h2>
            
            {course.batches && course.batches.length > 0 ? (
              course.batches.map((batch: any) => (
                <div key={batch.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
                  <h3 className="text-lg font-bold text-navy-custom">{batch.name}</h3>
                  
                  <div className="space-y-2 text-xs font-semibold text-gray-600">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-emerald-custom" />
                      <span>{batch.teacher?.user?.name || "Expert Scholar"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-emerald-custom" />
                      <span>{batch.time} ({batch.daysOfWeek.join(", ")})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-custom" />
                      <span>{batch.classesPerWeek} Classes / Week</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xl font-black text-emerald-custom">{batch.price} {batch.currency}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Per Month</span>
                  </div>

                  <div className="pt-2 space-y-2">
                    {batch.trialVideoUrl && (
                      <button 
                        onClick={() => setTrialVideo(batch.trialVideoUrl)}
                        className="w-full block text-center py-2.5 rounded-lg border-2 border-emerald-custom text-emerald-custom hover:bg-emerald-50 text-xs font-bold transition-all"
                      >
                        Watch Free Trial
                      </button>
                    )}
                    <Link
                      href="/register/student"
                      className="w-full block text-center py-2.5 rounded-lg bg-emerald-custom hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow"
                    >
                      Enroll in Batch
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <p className="text-sm font-semibold text-gray-500">No batches are currently scheduled for this course.</p>
                <Link href="/contact" className="mt-4 inline-block text-xs font-bold text-emerald-custom">Contact us to request a batch</Link>
              </div>
            )}

            {/* Course FAQs */}
            <div className="space-y-4 pt-8">
              <h3 className="text-lg font-bold text-navy-custom">Course FAQs</h3>
              <div className="space-y-3 text-xs">
                {courseStaticInfo?.faqs?.map((faq, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                    <h4 className="font-bold text-navy-custom flex items-center gap-1">
                      <HelpCircle className="h-4 w-4 text-gold-custom shrink-0" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-gray-500 leading-relaxed font-semibold pl-5">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Video Modal */}
      {trialVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setTrialVideo(null)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 rounded-full p-2 z-10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="aspect-video w-full bg-black">
              {/* Note: This handles basic iframe embedding for YouTube/Vimeo. Adjust if necessary. */}
              <iframe 
                src={(() => {
                  if (!trialVideo) return "";
                  let videoId = "";
                  if (trialVideo.includes("youtu.be/")) videoId = trialVideo.split("youtu.be/")[1]?.split("?")[0];
                  else if (trialVideo.includes("watch?v=")) videoId = trialVideo.split("watch?v=")[1]?.split("&")[0];
                  else if (trialVideo.includes("shorts/")) videoId = trialVideo.split("shorts/")[1]?.split("?")[0];
                  else if (trialVideo.includes("embed/")) return trialVideo;
                  
                  return videoId ? `https://www.youtube.com/embed/${videoId}` : trialVideo;
                })()} 
                className="w-full h-full" 
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
            <div className="p-6 text-center space-y-4">
              <h3 className="text-xl font-bold text-navy-custom">Free Trial Recording</h3>
              <p className="text-sm text-gray-500 font-medium">Experience the teaching style and quality of our scholars.</p>
              <Link
                href="/register/student"
                className="inline-block px-8 py-3 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
