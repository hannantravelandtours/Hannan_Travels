import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseDetails } from "@/app/actions/courses";
import { staticCoursesData } from "@/data/staticCourses";
import { CourseCurriculumAccordion } from "./CourseCurriculumAccordion";
import { CourseOneOnOneSidebar } from "./CourseOneOnOneSidebar";
import { 
  BookOpen, 
  Award, 
  Star, 
  UserCheck, 
  CheckCircle, 
  HelpCircle, 
  AlertCircle,
  CalendarCheck,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseDetails(id);

  if (!course) {
    notFound();
  }

  const courseStaticInfo = staticCoursesData[id] || {
    id,
    title: course.name,
    category: course.category,
    tagline: course.subtitle || "Learn Quran with Personalized 1-on-1 Instruction",
    desc: course.description || "Comprehensive Islamic and Quran curriculum with certified native scholars.",
    duration: "Flexible Scheduling",
    level: "All Levels",
    rating: 4.9,
    students: 1200,
    price: "From 2,500 PKR/mo",
    teacher: {
      name: "Certified Faculty",
      title: "Senior Quran Educator",
      bio: "Graduate Islamic scholars with years of online 1-on-1 teaching experience.",
      languages: ["Arabic", "English", "Urdu"],
      experience: "5+ Years",
    },
    whatYouWillLearn: [
      "Master correct pronunciation (Makharij) and phonetic rules.",
      "Personalized 1-on-1 pace suited to your schedule.",
      "Practical recitation drills and Tajweed applications.",
      "Spiritual guidelines and core Islamic manners.",
    ],
    requirements: [
      "Internet connection and PC/Tablet/Phone.",
      "Microphone and headphones for clear communication.",
      "Enthusiasm and dedication to learn the Book of Allah.",
    ],
    curriculum: [
      { week: "Module 1", title: "Foundations & Pronunciation", details: ["Articulation points (Makharij)", "Short and long vowels"] },
      { week: "Module 2", title: "Tajweed Principles", details: ["Noon and Meem Sakinah rules", "Rules of Madd (prolongation)"] },
      { week: "Module 3", title: "Fluency & Recitation", details: ["Stopping and pausing signs (Waqf)", "Direct Quranic verse practice"] },
    ],
    faqs: [
      { q: "How do 1-on-1 classes work?", a: "Each class is a dedicated private live session with your assigned scholar via our virtual portal. Only you and your teacher are in the session." },
      { q: "Can I choose my own schedule?", a: "Yes! You can choose the days and timing slots that best fit your routine from the teacher's available slots." },
      { q: "Is there a free trial?", a: "Yes, we provide 3 free trial sessions so you can experience our teaching quality firsthand before any fee commitment." }
    ],
    bannerImage: "/HeroSection.png",
    thumbnailImage: "/hero.png",
  };

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
            <span>1-on-1 Personalized Quran Pathway</span>
          </div>

          <div className="space-y-6 max-w-2xl">
            <Link href="/courses" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
              <span className="mr-2 rtl:hidden">←</span>
              <span className="mr-2 hidden rtl:inline">→</span>
              Back to All Courses
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
                href={`/register/student?course=${encodeURIComponent(course.id)}`}
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-emerald-custom hover:bg-emerald-900 transition-all shadow-lg hover-lift flex items-center space-x-2 rtl:space-x-reverse"
              >
                <span>Enroll in 1-on-1 Class</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold-custom" />
                3 Free Trial Sessions Included
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main details grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Details column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Top Stat Badges: 1-on-1 instead of Batches */}
            <div className="flex flex-wrap gap-4 sm:gap-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-sm font-semibold text-navy-custom">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-gold-custom text-gold-custom" />
                <span className="text-gray-700">{courseStaticInfo?.rating || 4.9} Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-emerald-custom" />
                <span className="text-gray-700 font-bold">1-on-1 Personalized Classes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-emerald-custom" />
                <span className="text-gray-700">Level: {courseStaticInfo?.level || "Beginner"}</span>
              </div>
            </div>

            {/* Course Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Course Overview</h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {course.description || courseStaticInfo?.desc}
              </p>
            </div>

            {/* What you will learn */}
            <div className="bg-emerald-custom/5 p-6 sm:p-8 rounded-2xl space-y-4 border border-emerald-custom/10">
              <h2 className="text-xl font-bold text-navy-custom">What You Will Learn (1-on-1 Curriculum)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {courseStaticInfo?.whatYouWillLearn?.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-emerald-custom shrink-0 mt-0.5" />
                    <span className="text-xs text-navy-custom/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Curriculum Accordion */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Course Curriculum Modules</h2>
              <CourseCurriculumAccordion curriculum={courseStaticInfo?.curriculum || []} />
            </div>

            {/* Prerequisites */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Prerequisites & Requirements</h2>
              <ul className="space-y-3">
                {courseStaticInfo?.requirements?.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-gray-500 font-semibold">
                    <AlertCircle className="h-4 w-4 text-emerald-custom shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: 1-on-1 Sidebar with Free Slots & Database Plans */}
          <div className="lg:col-span-4 space-y-6">
            <CourseOneOnOneSidebar
              courseId={course.id}
              courseName={course.name}
              plans={(course as any).plans || []}
              teachers={(course as any).teachers || []}
            />

            {/* Course FAQs */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-navy-custom">Frequently Asked Questions</h3>
              <div className="space-y-3 text-xs">
                {courseStaticInfo?.faqs?.map((faq: { q: string; a: string }, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                    <h4 className="font-bold text-navy-custom flex items-center gap-1.5">
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
    </div>
  );
}
