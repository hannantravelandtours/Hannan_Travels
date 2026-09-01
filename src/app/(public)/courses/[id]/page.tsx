"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { getCourseDetails } from "@/app/actions/courses";
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

interface CourseDetails {
  title: string;
  category: string;
  tagline: string;
  desc: string;
  duration: string;
  level: string;
  rating: number;
  students: number;
  price: string;
  teacher: {
    name: string;
    title: string;
    bio: string;
    languages: string[];
    experience: string;
  };
  whatYouWillLearn: string[];
  requirements: string[];
  curriculum: {
    week: string;
    title: string;
    details: string[];
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
  image?: string;
}

const mockCourseData: Record<string, CourseDetails> = {
  "noorani-qaida": {
    title: "Noorani Qaida Phonics",
    category: "Quran Basics",
    image: "https://i.pinimg.com/736x/90/75/cd/9075cd02ce929d3c69182bf683653ff0.jpg",
    tagline: "Build a strong foundation for fluent, beautiful Arabic recitation from day one.",
    desc: "This course is the vital first step for children and adult beginners. It focuses on the letters of the Arabic alphabet, correct pronunciation points (Makharij), phonetic joints, and vowel markings. Under the 1-on-1 guidance of our patient tutors, you will master the rules of joining letters to confidently read full Arabic words and verses.",
    duration: "3-4 Months (36 Sessions)",
    level: "Beginner",
    rating: 4.9,
    students: 840,
    price: "$35/mo",
    teacher: {
      name: "Mufti Muhammad Ibrahim",
      title: "Senior Quran Educator",
      bio: "Graduated from Al-Azhar, Cairo with an Ijazah in Quran recitation. Over 10 years of teaching Quran basics to Western kids.",
      languages: ["English", "Arabic", "Urdu"],
      experience: "12 Years"
    },
    whatYouWillLearn: [
      "Pronunciation of all 29 Arabic letters from their proper articulation points (Makharij).",
      "Understanding vowel markings (Fathah, Kasrah, Dammah) and tanween markings.",
      "Rules of joint letters, stretching sounds (Madd), and silent letters.",
      "Practical drills reading compound words directly from the Holy Quran.",
      "Basic etiquettes of handling and reciting the Holy Quran."
    ],
    requirements: [
      "No prior knowledge of Arabic or Quran is required.",
      "A working computer or tablet with a stable internet connection.",
      "Dedication to practice 15-20 minutes daily outside class."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Arabic Alphabets & Articulation (Makharij)",
        details: ["Recognition of individual letters", "Heavy and light sounding letters", "Proper articulation points from throat and mouth"]
      },
      {
        week: "Module 2",
        title: "Vowel Movements (Harakat)",
        details: ["Fathah, Kasrah, and Dammah movements", "Double vowels (Tanween)", "Drills of 3-letter simple words"]
      },
      {
        week: "Module 3",
        title: "Joining Letters & Madd Rules",
        details: ["Recognition of initial, medial, and final letter shapes", "Haroof-e-Madd (stretching rules)", "Sukoon (resting sign) and Jazm basics"]
      },
      {
        week: "Module 4",
        title: "Advanced Phonics (Shaddah & Leen)",
        details: ["Shaddah (doubling rule) articulation", "Haroof-e-Leen rules", "Rules of stopping (Waqf) at verse ends"]
      }
    ],
    faqs: [
      {
        q: "What is the recommended age for this course?",
        a: "We recommend Noorani Qaida for kids aged 4.5 and older, as well as adult reverts or beginners starting their Quranic journey."
      },
      {
        q: "How many sessions are held per week?",
        a: "Typically 2 to 3 sessions per week. Each session is 30 minutes of intensive 1-on-1 focus with the teacher."
      }
    ]
  },
  "quran-tajweed": {
    title: "Quran Recitation with Tajweed",
    category: "Tajweed Mastery",
    image: "https://i.pinimg.com/736x/35/30/6c/35306c28e77781a4409b17847336fd75.jpg",
    tagline: "Beautify your recitation by applying authentic rules (Makharij & Sifat).",
    desc: "Tajweed is the art of reciting the Quran with correct pronunciation of Arabic letters, understanding where to pause, how long to stretch vowels, and how to control nasal sounds. This course bridges the gap between simple reading and professional recitation. You will study classical tajweed rules alongside direct practice of selected Surahs.",
    duration: "6-12 Months (72 Sessions)",
    level: "Intermediate",
    rating: 4.9,
    students: 680,
    price: "$45/mo",
    teacher: {
      name: "Qari Ahmad Raza",
      title: "Certified Reciter & Tajweed Specialist",
      bio: "Holds a golden chain of narration (Isnaad) to the Prophet (PBUH) in Hafs 'an 'Asim recitation. Known for his melodious recitation.",
      languages: ["English", "Urdu", "Arabic"],
      experience: "8 Years"
    },
    whatYouWillLearn: [
      "All major Tajweed rules including Noon Sakinah, Meem Sakinah, and Tanween.",
      "Rules of Madd (prolongation) and Gunnah (nasalization).",
      "Attributes of letters (Sifaat-al-Haroof) to refine accent and tone.",
      "Proper rules of stopping (Waqf) and starting recitation.",
      "Melodic recitation techniques (Tarteel)."
    ],
    requirements: [
      "Ability to read simple Quranic Arabic (Noorani Qaida graduate).",
      "Basic understanding of Quranic layout."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Noon Sakinah & Tanween Rules",
        details: ["Izhar (Manifestation)", "Idgham (Assimilation with/without Gunnah)", "Iqlab (Conversion to Meem)", "Ikhfa (Hiding sound)"]
      },
      {
        week: "Module 2",
        title: "Meem Sakinah & Qalqalah Rules",
        details: ["Ikhfa-e-Shafawi", "Idgham-e-Shafawi", "Izhar-e-Shafawi", "Qalqalah (bouncing sound) points and levels"]
      },
      {
        week: "Module 3",
        title: "Madd (Prolongation) Categories",
        details: ["Natural Madd (Madd Asli)", "Derived Madd (Madd Far'ee)", "Compulsory Madd (Madd Laazim) rules in recitation"]
      },
      {
        week: "Module 4",
        title: "Tarteel Drills & Evaluation",
        details: ["Makharij checks on last Juz (Juz Amma)", "Breathing and pause control drills", "Final Tajweed certificate presentation"]
      }
    ],
    faqs: [
      {
        q: "Will I get a certificate after completing this course?",
        a: "Yes, after a successful evaluation by our board of supervisors, you will receive a Tajweed Recitation Certificate containing a digital verification QR code."
      },
      {
        q: "Can I choose a female teacher?",
        a: "Absolutely, we have highly qualified female scholars certified with Ijazahs available for sisters and children."
      }
    ]
  },
  "quran-reading": {
    title: "Quran Reading Flow",
    category: "Quran Basics",
    image: "https://i.pinimg.com/736x/19/f9/2f/19f92f5f41a98fa9516c29d646f6c76d.jpg",
    tagline: "Build confidence and fluency in reading the full Holy Quran.",
    desc: "Designed for students who can recognize Arabic letters but struggle with flowing word joints or breathing pauses. We focus on daily reading practice directly from the Mus'haf, fixing pronunciation mistakes on the go and establishing natural, confident recitation habits.",
    duration: "6-8 Months (72 Sessions)",
    level: "Beginner",
    rating: 4.8,
    students: 1100,
    price: "$40/mo",
    teacher: {
      name: "Sheikh Mahmoud",
      title: "Recitation Instructor",
      bio: "Ijazah holder from Al-Azhar with over 8 years of teaching beginners how to read the Quran with ease.",
      languages: ["English", "Arabic"],
      experience: "8 Years"
    },
    whatYouWillLearn: [
      "Fluency and speed in reading compound Arabic words and full verses.",
      "Practical application of basic vowel rules during reading.",
      "Familiarity with the script style of the Quran (Uthmani or Indo-Pak).",
      "Core Tajweed habits like heavy/light letters applied practically."
    ],
    requirements: [
      "Must have completed Noorani Qaida or equivalent foundation book."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Fluency of Compound Words",
        details: ["Drills of multi-letter joints", "Speed correction for vowel shifts", "Short Surahs recitation checks"]
      },
      {
        week: "Module 2",
        title: "Flow and Pause Control",
        details: ["Stop and pause rules (Waqf)", "Breathing techniques for longer verses", "Recital of Juz 30 (Juz Amma)"]
      }
    ],
    faqs: [
      {
        q: "What script is used in class?",
        a: "We support both Uthmani (Arabic script) and Indo-Pak scripts based on student preference."
      }
    ]
  },
  "arabic-language": {
    title: "Arabic Language Grammar",
    category: "Arabic Studies",
    image: "https://i.pinimg.com/736x/b0/16/2c/b0162cb91c7f791ab5e4a0d29728ed19.jpg",
    tagline: "Decode the grammar and vocabulary of the Holy Quran.",
    desc: "A structural grammar and vocabulary course designed to translate and understand the Holy Quran directly. Covers core noun and verb structures (Sarf and Nahw) alongside everyday conversation.",
    duration: "12 Months (144 Sessions)",
    level: "Intermediate",
    rating: 4.7,
    students: 190,
    price: "$50/mo",
    teacher: {
      name: "Ustadha Fatima Noor",
      title: "Arabic & Grammar Specialist",
      bio: "Masters in Arabic Language and Islamic Literature. Specializes in simplified Quranic grammar structures for non-native speakers.",
      languages: ["English", "Urdu", "Arabic"],
      experience: "9 Years"
    },
    whatYouWillLearn: [
      "Classical Quranic Arabic grammar syntax (Nahw).",
      "Morphology and verb conjugation charts (Sarf).",
      "Direct translation habits of common Quranic root words.",
      "Basic conversation skills in Modern Standard Arabic."
    ],
    requirements: [
      "Ability to read the Quran (recitation fluency is not required)."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Noun Structures & Pronouns",
        details: ["Definite and indefinite nouns", "Subject and object cases", "Attached and detached pronouns"]
      },
      {
        week: "Module 2",
        title: "Verb Conjugation (Sarf)",
        details: ["Past tense verbs conjugation", "Present and future tense structures", "Derived verb forms (Abwab)"]
      }
    ],
    faqs: [
      {
        q: "Do I need to speak Arabic to join?",
        a: "No, this is designed for beginners wanting to build comprehension from the ground up."
      }
    ]
  },
  "islamic-studies": {
    title: "Islamic Studies & Fiqh",
    category: "Fiqh & History",
    image: "https://i.pinimg.com/1200x/54/af/9f/54af9fa9dcc900404a6f0a1f68894634.jpg",
    tagline: "Build a comprehensive understanding of core Islamic beliefs and practices.",
    desc: "Covers the fundamental principles of Islam, Aqeedah (creed), Seerah (prophetic biography), Islamic history, and daily jurisprudence (rules of prayer, fasting, and purity). Suitable for children and adults.",
    duration: "6 Months (48 Sessions)",
    level: "Beginner",
    rating: 4.9,
    students: 340,
    price: "$35/mo",
    teacher: {
      name: "Dr. Sajid Rehman",
      title: "Academic Scholar",
      bio: "PhD in Islamic Jurisprudence. Passionate about clarifying daily act rules (Fiqh) for Western Muslims.",
      languages: ["English", "Urdu"],
      experience: "15 Years"
    },
    whatYouWillLearn: [
      "The pillars of Islamic belief (Aqeedah) and worship.",
      "Practical Fiqh of purification (Wudu, Ghusl) and prayer (Salah).",
      "Key events in the Seerah of Prophet Muhammad (PBUH).",
      "Islamic morals, etiquettes, and character development."
    ],
    requirements: [
      "No prerequisites. Open to all students."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Islamic Creed & Worship Fiqh",
        details: ["Pillars of Faith (Iman)", "Rules of purification and hygiene", "Step-by-step practical guide to daily prayers"]
      },
      {
        week: "Module 2",
        title: "Prophetic History & Morals",
        details: ["Meccan and Madinan periods of Seerah", "Etiquettes towards parents and community", "Duas for daily routines"]
      }
    ],
    faqs: [
      {
        q: "Is this class taught under a specific school of Fiqh?",
        a: "We teach standard accepted Fiqh rules across mainstream Sunni jurisprudence, focusing on common acts of worship."
      }
    ]
  },
  "tafseer-quran": {
    title: "Tafseer (Quran Explanation)",
    category: "Quranic Sciences",
    image: "https://i.pinimg.com/1200x/a0/9a/25/a09a253d6d1643fe4822989e4098f977.jpg",
    tagline: "Understand the context, stories, and guidance of Quranic verses.",
    desc: "A deep dive into the historical background, causes of revelation (Asbab al-Nuzul), and practical directives of Quranic verses. Helps students implement the Quranic message in their lives.",
    duration: "12 Months (96 Sessions)",
    level: "Advanced",
    rating: 4.8,
    students: 150,
    price: "$55/mo",
    teacher: {
      name: "Mufti Muhammad Ibrahim",
      title: "Senior Jurist & Tafseer Educator",
      bio: "Graduated with Iftaa degree. Spent over 12 years translating and explaining Quranic texts to international classes.",
      languages: ["English", "Arabic", "Urdu"],
      experience: "12 Years"
    },
    whatYouWillLearn: [
      "Background context and reasons for revelations (Asbab al-Nuzul).",
      "Analysis of key concepts and vocabulary in chosen Surahs.",
      "Theological and practical lessons from the stories of the Prophets.",
      "Methods of classical Tafseer scholars (Ibn Kathir, Al-Qurtubi)."
    ],
    requirements: [
      "Good reading ability of the Quran; basic Arabic comprehension is helpful."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Introduction to Tafseer Sciences",
        details: ["History of Tafseer compilation", "Tafseer of Surah Al-Fatihah", "Tafseer of short Surahs of Juz 30"]
      },
      {
        week: "Module 2",
        title: "Stories of the Prophets in the Quran",
        details: ["Tafseer of Surah Yusuf overview", "Tafseer of Surah Al-Kahf lessons", "Moral and theological summaries"]
      }
    ],
    faqs: [
      {
        q: "Can I choose which Surahs to study?",
        a: "Yes! In our 1-on-1 model, you can customize the syllabus to study specific Surahs or parts of the Quran."
      }
    ]
  },
  "hadith-studies": {
    title: "Hadith Studies",
    category: "Prophetic Traditions",
    image: "https://i.pinimg.com/736x/02/a4/94/02a4940006f340e709d363c74106054d.jpg",
    tagline: "Learn the sayings and model character of the Prophet (PBUH).",
    desc: "Studies Riyadhus Saliheen, the classic compilation of authentic traditions. Focuses on character, purification of the heart, etiquettes, and community interactions.",
    duration: "6 Months (48 Sessions)",
    level: "Intermediate",
    rating: 4.9,
    students: 120,
    price: "$45/mo",
    teacher: {
      name: "Dr. Sajid Rehman",
      title: "Hadith Lecturer",
      bio: "PhD in Hadith Studies. Teaches authentic prophetic traditions with simple, practical modern applications.",
      languages: ["English", "Urdu"],
      experience: "15 Years"
    },
    whatYouWillLearn: [
      "The grading structure of Hadith (Sahih, Hasan, Da'eef).",
      "Prophetic advice on patience, truthfulness, and character.",
      "Etiquettes of eating, sleeping, greetings, and assembly.",
      "Purification of the heart from envy, pride, and hypocrisy."
    ],
    requirements: [
      "Open to all students desiring to emulate prophetic character."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Foundations of Hadith & Character",
        details: ["Hadith terminology overview", "The role of intentions (Niyyah)", "Hadiths on truthfulness and sincerity"]
      },
      {
        week: "Module 2",
        title: "Etiquettes & Heart Purification",
        details: ["Sunnah routines for daily life", "Prophetic character in trials", "Social guidelines and community values"]
      }
    ],
    faqs: [
      {
        q: "What translation is used?",
        a: "We use standard accepted English translations of Riyadhus Saliheen (e.g. Darussalam or similar)."
      }
    ]
  },
  "hajj-information": {
    title: "Hajj & Umrah Guide",
    category: "Islamic Practices",
    image: "https://i.pinimg.com/1200x/68/57/44/685744aede2497799f1622e158e48ec1.jpg",
    tagline: "Prepare practically and spiritually for the journey of a lifetime.",
    desc: "A comprehensive practical guide explaining the rules, supplications, and steps to perform Hajj and Umrah. Perfect for prospective pilgrims wanting to perform their rituals correctly according to the Sunnah.",
    duration: "1 Month (12 Sessions)",
    level: "Beginner",
    rating: 4.9,
    students: 95,
    price: "$25/mo",
    teacher: {
      name: "Mufti Muhammad Ibrahim",
      title: "Senior Fiqh Educator",
      bio: "Graduated with honors. Spent a decade running orientation programs for Hajj groups.",
      languages: ["English", "Arabic", "Urdu"],
      experience: "12 Years"
    },
    whatYouWillLearn: [
      "The step-by-step procedures of Umrah and the three types of Hajj.",
      "Ihram regulations, boundaries (Meeqat), and prohibited actions.",
      "Details of Tawaf, Sa'ee, Halq, and daily actions in Mina, Arafah, and Muzdalifah.",
      "Prophetic supplications (Duas) for pilgrimage stages.",
      "Corrective actions and penalties (Dam) for mistakes."
    ],
    requirements: [
      "No prerequisites. Ideal for students traveling soon."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Umrah Step-by-Step",
        details: ["Ihram rules and Talbiyah pronunciation", "Masjid al-Haram entry and Tawaf procedure", "Sa'ee steps and shaving/trimming hair"]
      },
      {
        week: "Module 2",
        title: "The Days of Hajj",
        details: ["8th-9th Dhul Hijjah (Mina, Arafah, Muzdalifah stay)", "10th Dhul Hijjah (Jamarat, sacrifice, Ifadah Tawaf)", "Tawaf al-Wida (Farewell Tawaf) and Madinah Ziyarah tips"]
      }
    ],
    faqs: [
      {
        q: "Is this suitable for Umrah travelers?",
        a: "Yes, Umrah is taught as the foundation block of this course."
      }
    ]
  }
};

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number | null>(0);
  const [dbCourse, setDbCourse] = useState<any>(null);
  const [trialVideo, setTrialVideo] = useState<string | null>(null);

  useEffect(() => {
    getCourseDetails(id).then(setDbCourse);
  }, [id]);

  // Fallback to mock data for static content like curriculum/faqs
  const mockCourse = mockCourseData[id] || mockCourseData["quran-tajweed"];

  if (!dbCourse) {
    return <div className="py-32 text-center text-gray-500 font-bold">Loading Course...</div>;
  }

  const courseTitle = dbCourse.name || mockCourse.title;
  const courseDesc = dbCourse.description || mockCourse.desc;

  return (
    <div className="space-y-16 pb-20">
      {/* Course Hero Banner */}
      <section 
        className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-28 bg-cover bg-center text-white min-h-[400px] flex items-center"
        style={{ backgroundImage: `url('${dbCourse.bannerImage || mockCourse.image || "/HeroSection.png"}')` }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'screen', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        {/* Subtle gradient overlay to darken background behind left-aligned text, keeping right side fully visible and sharp */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10 rtl:bg-gradient-to-l rtl:from-black/90 rtl:via-black/60 rtl:to-black/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-left rtl:text-right flex flex-col items-start rtl:items-end space-y-8">
          <div className="grid grid-cols-1 gap-12 items-center w-full">
            
            {/* Text Content */}
            <div className="space-y-6 max-w-2xl">
              <Link href="/courses" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
                <span className="mr-2 rtl:hidden">←</span>
                <span className="mr-2 hidden rtl:inline">→</span>
                Back to Services
              </Link>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white">
                {dbCourse.name || courseTitle}
              </h1>
              
              {dbCourse.subtitle && (
                <p className="text-lg sm:text-xl text-gray-200 font-medium leading-relaxed">
                  {dbCourse.subtitle}
                </p>
              )}

              {!dbCourse.subtitle && courseDesc && (
                <p className="text-lg text-gray-300 font-medium max-w-lg leading-relaxed">
                  {courseDesc.substring(0, 150)}...
                </p>
              )}

              <div className="pt-4 flex flex-wrap items-center justify-start rtl:justify-end gap-4">
                <Link
                  href="/register"
                  className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-emerald-custom hover:bg-emerald-900 transition-all shadow-lg hover-lift flex items-center space-x-2 rtl:space-x-reverse"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Main details grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Details column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Course Stats Banner */}
            <div className="flex flex-wrap gap-4 sm:gap-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-sm font-semibold text-navy-custom">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-gold-custom text-gold-custom" />
                <span className="text-gray-700">{mockCourse.rating} Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-custom" />
                <span className="text-gray-700">{dbCourse.batches?.length || 0} Batches</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-emerald-custom" />
                <span className="text-gray-700">Level: {mockCourse.level}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Course Overview</h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed whitespace-pre-line">
                {courseDesc}
              </p>
            </div>

            {/* What you'll learn */}
            <div className="bg-emerald-custom/5 p-6 sm:p-8 rounded-2xl space-y-4 border border-emerald-custom/10">
              <h2 className="text-xl font-bold text-navy-custom">What You Will Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {mockCourse.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-emerald-custom shrink-0 mt-0.5" />
                    <span className="text-xs text-navy-custom/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Course Curriculum</h2>
              <div className="space-y-3">
                {mockCourse.curriculum.map((module, idx) => {
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
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-185" : ""}`} />
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

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-custom">Prerequisites & Requirements</h2>
              <ul className="space-y-3">
                {mockCourse.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-gray-500 font-semibold">
                    <AlertCircle className="h-4 w-4 text-emerald-custom shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-bold text-navy-custom mb-6 border-b border-gray-100 pb-4">Available Batches</h2>
            
            {dbCourse.batches && dbCourse.batches.length > 0 ? (
              dbCourse.batches.map((batch: any) => (
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
                {mockCourse.faqs.map((faq, idx) => (
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
