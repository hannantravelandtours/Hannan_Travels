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
      <section className="bg-emerald-custom/5 py-16 text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 relative z-10">
          <span className="text-xs font-bold text-emerald-custom uppercase tracking-widest bg-emerald-custom/10 px-3.5 py-1 rounded-full">
            Transparent Tuition Hadya
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-custom leading-tight">
            Hadya & Fee Structures
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl mx-auto">
            Affordable monthly packages for 1-on-1 live classes. Start with our 3-Class Free Trial. No contracts, cancel anytime.
          </p>
        </div>
      </section>

      {/* Main pricing structure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Currency Switcher */}
        <div className="flex justify-center items-center space-x-3 rtl:space-x-reverse">
          <span className="text-xs font-bold text-navy-custom uppercase tracking-wide">Select Currency:</span>
          <div className="bg-gray-100 p-1 rounded-full inline-flex border border-gray-200">
            {(["USD", "GBP", "PKR"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currency === curr
                    ? "bg-emerald-custom text-white shadow-md"
                    : "text-navy-custom/70 hover:text-navy-custom"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

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
