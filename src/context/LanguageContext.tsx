"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar" | "ur";
export type Direction = "ltr" | "rtl";

interface TranslationDictionary {
  [key: string]: {
    en: string;
    ar: string;
    ur: string;
  };
}

const translations: TranslationDictionary = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية", ur: "ہوم" },
  "nav.about": { en: "About Us", ar: "من نحن", ur: "ہمارے بارے میں" },
  "nav.courses": { en: "Courses", ar: "الدورات", ur: "کورسز" },
  "nav.howItWorks": { en: "How It Works", ar: "كيف نعمل", ur: "کیسے کام کرتا ہے" },
  "nav.teachers": { en: "Teachers", ar: "المعلمون", ur: "اساتذہ" },
  "nav.blog": { en: "Blog", ar: "المدونة", ur: "بلاگ" },
  "nav.faq": { en: "FAQ", ar: "الأسئلة الشائعة", ur: "سوالات" },
  "nav.contact": { en: "Contact", ar: "اتصل بنا", ur: "رابطہ کریں" },
  "nav.login": { en: "Login", ar: "تسجيل الدخول", ur: "لاگ ان" },
  "nav.bookTrial": { en: "Book Free Trial", ar: "احجز تجربة مجانية", ur: "مفت ٹرائل بک کریں" },
  "nav.studentDashboard": { en: "Student Portal", ar: "بوابة الطالب", ur: "اسٹوڈنٹ پورٹل" },
  "nav.teacherDashboard": { en: "Teacher Portal", ar: "بوابة المعلم", ur: "ٹیچر پورٹل" },
  "nav.adminDashboard": { en: "Admin Panel", ar: "لوحة التحكم", ur: "ایڈمن پینل" },

  // Hero Section
  "hero.badge": { 
    en: "Trusted Online Quran Education for Students Worldwide", 
    ar: "تعليم القرآن الكريم عبر الإنترنت الموثوق به للطلاب في جميع أنحاء العالم", 
    ur: "دنیا بھر کے طلباء کے لیے قابل اعتماد آن لائن قرآنی تعلیم" 
  },
  "hero.title1": { en: "Learn Quran Online", ar: "تعلم القرآن الكريم عبر الإنترنت", ur: "آن لائن قرآن مجید سیکھیں" },
  "hero.title2": { en: "With Qualified Tutors", ar: "مع معلمین مؤهلین", ur: "قابل اساتذہ کے ساتھ" },
  "hero.subtitle": { 
    en: "Learn Quran, Tajweed, Arabic and Islamic Studies from experienced teachers through personalized online classes tailored for children, females and adults.", 
    ar: "تعلم القرآن والتجويد واللغة العربية والدراسات الإسلامية من معلمين ذوي خبرة من خلال دروس مخصصة عبر الإنترنت للأطفال والنساء والكبار.", 
    ur: "تجربہ کار اساتذہ سے اپنی سہولت کے مطابق آن لائن کلاسز کے ذریعے قرآن، تجوید، عربی اور اسلامی علوم سیکھیں جو بچوں، خواتین اور بڑوں کے لیے موزوں ہیں۔" 
  },
  "hero.cta.trial": { en: "Start Your Journey", ar: "ابدأ رحلتك", ur: "اپنے سفر کا آغاز کریں" },
  "hero.cta.courses": { en: "Explore Courses", ar: "استكشف الدورات", ur: "کورسز دیکھیں" },

  // Stats Section
  "stats.students": { en: "1,000+ Students", ar: "+١٠٠٠ طالب وطالبة", ur: "+1,000 طلباء" },
  "stats.teachers": { en: "50+ Qualified Teachers", ar: "+٥٠ معلم مؤهل", ur: "+50 قابل اساتذہ" },
  "stats.countries": { en: "20+ Countries Served", ar: "+٢٠ دولة حول العالم", ur: "+20 ممالک" },
  "stats.satisfaction": { en: "95% Parent Satisfaction", ar: "٩٥٪ رضا أولياء الأمور", ur: "95% والدین کا اطمینان" },

  // CTA Section Global
  "cta.banner.title": { en: "Embark on Your Quranic Learning Journey Today", ar: "ابدأ رحلة تعلم القرآن الكريم اليوم", ur: "آج ہی اپنے قرآنی تعلیمی سفر کا آغاز کریں" },
  "cta.banner.subtitle": { 
    en: "Get 3 free trial classes. No credit card required. Choose your flexible timing.", 
    ar: "احصل على ٣ حصص تجريبية مجانية. لا يلزم بطاقة ائتمان. اختر وقتك المفضل.", 
    ur: "3 مفت ٹرائل کلاسز حاصل کریں۔ کسی کریڈٹ کارڈ کی ضرورت نہیں۔ اپنے وقت کا انتخاب کریں۔" 
  },

  // Dashboards / Generic UI
  "dash.dashboard": { en: "Dashboard", ar: "لوحة التحكم", ur: "ڈیش بورڈ" },
  "dash.myCourses": { en: "My Courses", ar: "دوراتي", ur: "میرے کورسز" },
  "dash.schedule": { en: "Schedule", ar: "الجدول الدراسي", ur: "شیڈول" },
  "dash.classroom": { en: "Classroom", ar: "الفصل الدراسي", ur: "کلاسروم" },
  "dash.progress": { en: "Progress Tracking", ar: "متابعة التقدم", ur: "کارکردگی کی رپورٹ" },
  "dash.certificates": { en: "Certificates", ar: "الشهادات", ur: "سرٹیفکیٹس" },
  "dash.homework": { en: "Homework", ar: "الواجبات", ur: "ہوم ورک" },
  "dash.attendance": { en: "Attendance", ar: "الحضور والغياب", ur: "حاضری" },
  "dash.notifications": { en: "Notifications", ar: "الإشعارات", ur: "نوٹیفیکیشنز" },
  "dash.settings": { en: "Settings", ar: "الإعدادات", ur: "سیٹنگز" },
  "dash.logout": { en: "Logout", ar: "تسجيل الخروج", ur: "لاگ آؤٹ" },
};

interface LanguageContextProps {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [direction, setDirection] = useState<Direction>("ltr");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang && ["en", "ar", "ur"].includes(savedLang)) {
      setLanguageState(savedLang);
      setDirection(savedLang === "en" ? "ltr" : "rtl");
      document.documentElement.dir = savedLang === "en" ? "ltr" : "rtl";
      document.documentElement.lang = savedLang;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const dir = lang === "en" ? "ltr" : "rtl";
    setDirection(dir);
    localStorage.setItem("lang", lang);
    
    // Update HTML dir and lang attributes
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key]["en"];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
