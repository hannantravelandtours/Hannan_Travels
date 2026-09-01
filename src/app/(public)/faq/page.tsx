"use client";

import React, { useState } from "react";
import { Search, ChevronDown, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const categories = [
    "All",
    "Courses",
    "Fees",
    "Free Trial",
    "Teachers",
    "Classes",
    "Certificates"
  ];

  const faqs = [
    {
      q: "What is Noorani Qaida and who is it for?",
      a: "Noorani Qaida is the basic introductory booklet that teaches the Arabic alphabet, correct pronunciation points (Makharij), joint letters, and basic spelling rules. It is essential for absolute beginners, reverts, and young kids starting to read the Quran.",
      category: "Courses"
    },
    {
      q: "How does the 3-Class Free Trial work?",
      a: "You fill out our Trial Booking form and select your preferred times. We assign a qualified scholar for a 1-on-1 session. You get 3 full classes (30 minutes each) completely free. There are no fees or credit card signups required. If you like the teacher, you can choose a monthly plan to continue.",
      category: "Free Trial"
    },
    {
      q: "Can I request a female Quran teacher?",
      a: "Yes, absolutely. We have a dedicated staff of native, certified female Quran teachers who hold prestigious Ijazahs. Female students or young kids can choose to study exclusively with female instructors.",
      category: "Teachers"
    },
    {
      q: "What are the monthly tuition fee packages?",
      a: "Our packages depend on the number of classes you take per week. For example, 2 classes per week is $35/month, 3 classes per week is $45/month, and 5 classes per week is $60/month. We offer family discounts for multiple children.",
      category: "Fees"
    },
    {
      q: "How are the online classes conducted?",
      a: "Classes are held live on our custom virtual classroom portal (accessible directly via Chrome/Safari browsers). It features live high-quality video and audio, an interactive digital Quran board, text chat, and homework sharing drawers. You do not need to install Zoom or Skype.",
      category: "Classes"
    },
    {
      q: "Do you issue official certificates upon completion?",
      a: "Yes, once a student completes a full curriculum level (e.g. Tajweed Recitation, or memorization of specific Juz) and passes a verbal assessment by our supervisory board, we issue a verified digital certificate containing a unique QR verification code.",
      category: "Certificates"
    },
    {
      q: "What if I miss a scheduled class?",
      a: "If you notify us at least 4 hours before the class begins, we will cancel the session and reschedule a makeup class for you. Classes missed without prior notification cannot be refunded or rescheduled.",
      category: "Classes"
    },
    {
      q: "Is there any software I need to install?",
      a: "No software download is required. Our interactive classroom portal runs directly inside your web browser on laptops, PCs, iPads, or smartphones.",
      category: "Classes"
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCat === "All" ||
      faq.category.toLowerCase() === selectedCat.toLowerCase();

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section 
        className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/HeroSection.png')" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'screen', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 rtl:bg-gradient-to-l rtl:from-black/90 rtl:via-black/70 rtl:to-black/30" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-semibold uppercase tracking-wide">
            Find answers to common queries regarding courses, schedules, fees, and classrooms.
          </p>
        </div>
      </section>

      {/* Accordion List & filters */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pb-6 border-b border-gray-100">
          {/* Categories select tab */}
          <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-emerald-custom text-white shadow-sm"
                    : "bg-gray-100 hover:bg-gray-200 text-navy-custom"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-emerald-custom bg-white"
            />
          </div>
        </div>

        {/* FAQs list accordion */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-navy-custom hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="h-5 w-5 text-gold-custom shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-185" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-gray-50 bg-gray-50/50">
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed pt-4 pl-8">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-sm font-bold text-gray-400">
            No FAQs found matching "{searchQuery}".
          </div>
        )}
      </section>
    </div>
  );
}
