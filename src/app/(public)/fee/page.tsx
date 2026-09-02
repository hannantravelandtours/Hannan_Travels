"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Info, PhoneCall, Gift, ShieldCheck, BookOpen, Clock } from "lucide-react";
import { getCoursesWithBatchPrices } from "@/app/actions/feeData";

export default function FeePage() {
  const [currency, setCurrency] = useState<"USD" | "GBP" | "PKR">("USD");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    getCoursesWithBatchPrices().then(setCourses);
  }, []);

  const exchangeRates = {
    USD: { symbol: "$", scale: 1 },
    GBP: { symbol: "£", scale: 0.8 },
    PKR: { symbol: "Rs.", scale: 280 }
  };

  const getPrice = (basePrice: number) => {
    const { symbol, scale } = exchangeRates[currency];
    const computedPrice = Math.round(Number(basePrice) * scale);
    if (currency === "PKR") {
      return `${symbol} ${computedPrice.toLocaleString()}`;
    }
    return `${symbol}${computedPrice}`;
  };

  const coursesWithBatches = courses.filter(c => c.batches && c.batches.length > 0);

  return (
    <div className="space-y-16 pb-20">
      {/* Header banner */}
      <section 
        className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-28 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/HeroSection.png')" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'screen', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10 rtl:bg-gradient-to-l rtl:from-black/90 rtl:via-black/60 rtl:to-black/10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left rtl:text-right flex flex-col items-start rtl:items-end space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full bg-emerald-custom/20 text-white font-semibold text-xs border border-emerald-custom/30">
            <Gift className="h-4 w-4 text-gold-custom-light" />
            <span>Transparent & Affordable Education</span>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans text-gold-custom-light font-bold tracking-wide drop-shadow-md">
                Hadya / Tuition Fees
              </h1>
              <span className="block text-xl sm:text-2xl font-bold tracking-widest text-white uppercase">
                Simple, affordable, and flexible monthly plans
              </span>
            </div>
            
            <div className="py-6 border-y border-white/10 my-6 space-y-4 text-left rtl:text-right">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gold-custom leading-normal font-medium drop-shadow-sm text-left rtl:text-right" dir="rtl">
                إِنَّ أَحَقَّ مَا أَخَذْتُمْ عَلَيْهِ أَجْرًا كِتَابُ اللَّهِ
              </p>
              <p className="text-base sm:text-lg text-gray-200 font-serif leading-relaxed italic">
                "The most deserving of things for which you take a wage is the Book of Allah."
              </p>
              <p className="text-xs text-gold-custom-light font-bold uppercase tracking-widest">
                Sahih al-Bukhari (5737)
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-start rtl:justify-end gap-6 text-sm font-semibold text-gray-200">
              <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse">
                <ShieldCheck className="h-4 w-4 text-gold-custom-light" />
                <span>No Registration Fee</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse">
                <ShieldCheck className="h-4 w-4 text-gold-custom-light" />
                <span>Cancel Anytime</span>
              </span>
            </div>

            {/* Currency Switcher */}
            <div className="pt-4 flex flex-wrap items-center justify-start rtl:justify-end gap-4">
              <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                {(["USD", "GBP", "PKR"] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                      currency === curr 
                        ? "bg-emerald-custom text-white shadow-lg" 
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main pricing structure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Dynamic Courses with Batches */}
        {coursesWithBatches.length > 0 ? (
          <div className="space-y-12">
            {coursesWithBatches.map((course) => (
              <div key={course.id} className="space-y-6">
                {/* Course Header */}
                <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
                  <div className="p-2.5 bg-emerald-custom/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-emerald-custom" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-navy-custom">{course.name}</h2>
                    {course.subtitle && <p className="text-xs text-gray-500 font-medium">{course.subtitle}</p>}
                  </div>
                </div>

                {/* Batch Cards for this course */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course.batches.map((batch: any) => (
                    <div
                      key={batch.id}
                      className="relative rounded-2xl p-6 bg-white border border-gray-200 hover:border-emerald-custom/30 hover:shadow-lg flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-navy-custom">{batch.name}</h3>
                          <p className="text-xs text-gray-400 font-semibold mt-1">
                            Teacher: {batch.teacher?.user?.name || "TBD"}
                          </p>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-black text-emerald-custom">{getPrice(batch.price)}</span>
                            <span className="text-xs text-gray-500 font-semibold">/ month</span>
                          </div>
                          <span className="text-[10px] text-gray-400 block mt-1">
                            {batch.classesPerWeek} Classes per week
                          </span>
                        </div>

                        {/* Batch Details */}
                        <ul className="space-y-2.5 border-t border-gray-100 pt-4">
                          <li className="flex items-center space-x-2.5 text-xs text-navy-custom/90 font-medium">
                            <Clock className="h-4 w-4 text-emerald-custom shrink-0" />
                            <span>Schedule: {batch.daysOfWeek?.join(", ")}</span>
                          </li>
                          <li className="flex items-center space-x-2.5 text-xs text-navy-custom/90 font-medium">
                            <Clock className="h-4 w-4 text-emerald-custom shrink-0" />
                            <span>Time: {batch.time}</span>
                          </li>
                          <li className="flex items-center space-x-2.5 text-xs text-navy-custom/90 font-medium">
                            <CheckCircle className="h-4 w-4 text-gold-custom shrink-0" />
                            <span>1-on-1 Personalized Classes</span>
                          </li>
                          <li className="flex items-center space-x-2.5 text-xs text-navy-custom/90 font-medium">
                            <CheckCircle className="h-4 w-4 text-gold-custom shrink-0" />
                            <span>Male & Female Certified Scholars</span>
                          </li>
                          <li className="flex items-center space-x-2.5 text-xs text-navy-custom/90 font-medium">
                            <CheckCircle className="h-4 w-4 text-gold-custom shrink-0" />
                            <span>Cancel Anytime</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-6 mt-4 border-t border-gray-100">
                        <Link
                          href="/register"
                          className="block w-full text-center py-3 rounded-full bg-navy-custom text-white text-xs font-bold hover:bg-navy-900 transition-all"
                        >
                          Start Free Trial
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-navy-custom">No Fee Plans Available</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Course batches with fee information will appear here once created by admin.
            </p>
          </div>
        )}
      </section>

      {/* Sibling & Family Discounts Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-custom/10 to-teal-custom/5 rounded-3xl p-8 sm:p-10 border border-emerald-custom/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-emerald-custom bg-emerald-custom/10 px-3 py-1 rounded-full text-xs font-bold">
              <Gift className="h-4.5 w-4.5" />
              <span>Family Hadya Discount Packages</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-custom">
              Enrolling multiple family members? Save 10% to 15%!
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
              We encourage homes that learn together. We apply a **10% sibling discount** for the 2nd student and a **15% family discount** for the 3rd or more concurrent students.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-navy-custom text-white font-bold text-xs hover:bg-navy-950 shadow-md transition-all shrink-0"
          >
            Request Family Quote
          </Link>
        </div>
      </section>

      {/* Safety & Guarantee items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-custom shrink-0">
            <ShieldCheck className="h-5 w-5 text-gold-custom" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-navy-custom">100% Satisfaction Guarantee</h4>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              If you are not satisfied with your assigned Quran teacher, we change the tutor immediately or refund any remaining fee.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-150/80 flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-custom shrink-0">
            <Info className="h-5 w-5 text-gold-custom" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-navy-custom">No Hidden Charges</h4>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Your billing fee covers all course textbooks, virtual materials, final evaluation tests, and digital certificates.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-150/80 flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-custom shrink-0">
            <PhoneCall className="h-5 w-5 text-gold-custom" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-navy-custom">Custom Study Hours</h4>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Need custom days (e.g. weekend-only) or longer sessions? Contact our admissions board for a bespoke billing quotation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
