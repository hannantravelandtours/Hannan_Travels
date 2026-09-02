export interface CourseDetails {
  id: string;
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
  bannerImage: string;
  thumbnailImage: string;
}

export const staticCoursesData: Record<string, CourseDetails> = {
  "qaida": {
    id: "qaida",
    title: "Noorani Qaida",
    category: "QAIDA",
    bannerImage: "/Qaidabanner.webp",
    thumbnailImage: "/qaida_banner_ai.png",
    tagline: "Build a strong foundation for fluent, beautiful Arabic recitation from day one.",
    desc: "This course is the vital first step for children and adult beginners. It focuses on the letters of the Arabic alphabet, correct pronunciation points (Makharij), phonetic joints, and vowel markings. Under the 1-on-1 guidance of our patient tutors, you will master the rules of joining letters to confidently read full Arabic words and verses.",
    duration: "3-4 Months (36 Sessions)",
    level: "Beginner",
    rating: 4.9,
    students: 840,
    price: "$35/mo",
    teacher: {
      name: "Qualified Faculty",
      title: "Senior Quran Educator",
      bio: "Graduated with Ijazah in Quran recitation. Experienced in teaching Quran basics to beginners.",
      languages: ["English", "Arabic", "Urdu"],
      experience: "10+ Years"
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
        title: "Arabic Alphabets & Articulation",
        details: ["Recognition of individual letters", "Proper articulation points from throat and mouth"]
      },
      {
        week: "Module 2",
        title: "Vowel Movements",
        details: ["Fathah, Kasrah, and Dammah movements", "Double vowels (Tanween)"]
      }
    ],
    faqs: [
      {
        q: "Do I need any prior knowledge?",
        a: "No, this course is designed for absolute beginners."
      }
    ]
  },
  "nazra": {
    id: "nazra",
    title: "Nazra Quran",
    category: "NAZRA",
    bannerImage: "/Nazra_Hifzbanner.webp",
    thumbnailImage: "/nazra_banner_ai.png",
    tagline: "Read the Holy Quran fluently with correct pronunciation.",
    desc: "Designed for students who can recognize Arabic letters but struggle with flowing word joints or breathing pauses. We focus on daily reading practice directly from the Mus'haf, fixing pronunciation mistakes on the go and establishing natural, confident recitation habits.",
    duration: "6-8 Months (72 Sessions)",
    level: "Intermediate",
    rating: 4.8,
    students: 1100,
    price: "$40/mo",
    teacher: {
      name: "Qualified Faculty",
      title: "Recitation Instructor",
      bio: "Ijazah holder with extensive experience in teaching Quran recitation.",
      languages: ["English", "Arabic", "Urdu"],
      experience: "8+ Years"
    },
    whatYouWillLearn: [
      "Fluency and speed in reading compound Arabic words and full verses.",
      "Practical application of basic vowel rules during reading.",
      "Familiarity with the script style of the Quran.",
      "Core Tajweed habits like heavy/light letters applied practically."
    ],
    requirements: [
      "Must have completed Noorani Qaida or equivalent foundation book."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Fluency of Compound Words",
        details: ["Drills of multi-letter joints", "Speed correction for vowel shifts"]
      },
      {
        week: "Module 2",
        title: "Flow and Pause Control",
        details: ["Stop and pause rules (Waqf)", "Breathing techniques for longer verses"]
      }
    ],
    faqs: [
      {
        q: "What script is used in class?",
        a: "We support both Uthmani (Arabic script) and Indo-Pak scripts based on student preference."
      }
    ]
  },
  "hifz": {
    id: "hifz",
    title: "Hifz Quran",
    category: "HIFZ",
    bannerImage: "/Nazra_Hifzbanner.webp",
    thumbnailImage: "/hifz_banner_ai.png",
    tagline: "Memorize the Holy Quran with a structured and proven methodology.",
    desc: "A dedicated memorization program combining new daily lessons (Sabaq), recent revision (Sabaqi), and old revision (Manzil). Our expert instructors ensure your memorization is solid and your Tajweed is uncompromised.",
    duration: "2-3 Years",
    level: "Advanced",
    rating: 5.0,
    students: 450,
    price: "$50/mo",
    teacher: {
      name: "Qualified Faculty",
      title: "Hifz Director",
      bio: "Hafiz-ul-Quran with specialized Ijazah in memorization techniques.",
      languages: ["English", "Arabic", "Urdu"],
      experience: "15+ Years"
    },
    whatYouWillLearn: [
      "Complete memorization of the Holy Quran.",
      "Strong retention techniques for long-term memory.",
      "Flawless Tajweed integration during fast recitation."
    ],
    requirements: [
      "Must be able to read the Quran fluently with Tajweed."
    ],
    curriculum: [
      {
        week: "Phase 1",
        title: "Juz 30 & Foundation",
        details: ["Memorization of short Surahs", "Establishing the daily 3-part routine"]
      },
      {
        week: "Phase 2",
        title: "Intensive Memorization",
        details: ["Increasing daily Sabaq portion", "Strict Manzil revision schedules"]
      }
    ],
    faqs: [
      {
        q: "How much time is required daily?",
        a: "Students should commit at least 1-2 hours daily for memorization and revision."
      }
    ]
  },
  "hajj-umrah": {
    id: "hajj-umrah",
    title: "Hajj & Umrah Guide",
    category: "ISLAMIC_STUDIES",
    bannerImage: "/hajj_umrahGuide.webp",
    thumbnailImage: "/hajj_umrahGuide.webp",
    tagline: "Comprehensive spiritual and practical guidance for the sacred journey.",
    desc: "Prepare for your pilgrimage with our expert scholars. This course covers the Fiqh, rituals, duas, and historical significance of Hajj and Umrah, ensuring you perform your obligations with confidence and spiritual presence.",
    duration: "1 Month (12 Sessions)",
    level: "All Levels",
    rating: 4.9,
    students: 320,
    price: "$30/mo",
    teacher: {
      name: "Qualified Faculty",
      title: "Islamic Studies Scholar",
      bio: "Specialist in Islamic Jurisprudence (Fiqh) and Pilgrimage rituals.",
      languages: ["English", "Urdu"],
      experience: "12+ Years"
    },
    whatYouWillLearn: [
      "Step-by-step rituals of Umrah and Hajj.",
      "Important Duas to recite at specific locations.",
      "Fiqh rules regarding Ihram, Tawaf, and Sa'i.",
      "Practical travel advice and spiritual preparation."
    ],
    requirements: [
      "Open to all adults planning to perform Hajj or Umrah."
    ],
    curriculum: [
      {
        week: "Module 1",
        title: "Preparation & Ihram",
        details: ["Spiritual readiness", "Rules and restrictions of Ihram"]
      },
      {
        week: "Module 2",
        title: "Tawaf & Sa'i",
        details: ["How to perform Tawaf", "Sa'i between Safa and Marwa"]
      }
    ],
    faqs: [
      {
        q: "Is this course live or pre-recorded?",
        a: "All our sessions are live, 1-on-1 with an expert scholar."
      }
    ]
  }
};

export const getStaticCoursesArray = () => Object.values(staticCoursesData);
