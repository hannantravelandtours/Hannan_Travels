"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-custom text-gray-300 pt-16 pb-8 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Academy Info & Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="p-2 bg-emerald-custom rounded-lg flex items-center justify-center text-white">
                <BookOpen className="h-6 w-6 text-gold-custom-light" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  Hannan Consultants
                </span>
                <span className="block text-xs font-semibold text-emerald-custom-light tracking-wider uppercase">
                  Quran Academy
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed pt-2">
              Empowering students worldwide to master Quranic reading, Tajweed recitation, and Arabic language rules with certified native scholars through personalized online education.
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse pt-2">
              <a href="#" className="p-2 rounded-full bg-navy-light text-gray-400 hover:text-gold-custom transition-colors" title="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-navy-light text-gray-400 hover:text-gold-custom transition-colors" title="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-navy-light text-gray-400 hover:text-gold-custom transition-colors" title="Instagram">
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-navy-light text-gray-400 hover:text-gold-custom transition-colors" title="Youtube">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.186-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-l-2 border-gold-custom pl-3 rtl:border-l-0 rtl:border-r-2 rtl:pr-3">
              Academy Portal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-custom-light transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-emerald-custom-light transition-colors">
                  {t("nav.courses")}
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="hover:text-emerald-custom-light transition-colors">
                  {t("nav.teachers")}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-custom-light transition-colors font-semibold text-gold-custom">
                  {t("nav.bookTrial")}
                </Link>
              </li>
              <li>
                <Link href="/classroom" className="hover:text-emerald-custom-light transition-colors">
                  Virtual Class Interface
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-l-2 border-gold-custom pl-3 rtl:border-l-0 rtl:border-r-2 rtl:pr-3">
              Islamic Curriculums
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/courses?cat=Quran" className="hover:text-emerald-custom-light transition-colors">
                  Quran Reading (Noorani Qaida)
                </Link>
              </li>
              <li>
                <Link href="/courses?cat=Tajweed" className="hover:text-emerald-custom-light transition-colors">
                  Recitation with Tajweed Rules
                </Link>
              </li>
              <li>
                <Link href="/courses?cat=Hifz" className="hover:text-emerald-custom-light transition-colors">
                  Hifz (Quran Memorization)
                </Link>
              </li>
              <li>
                <Link href="/courses?cat=Arabic" className="hover:text-emerald-custom-light transition-colors">
                  Arabic Grammatical Language
                </Link>
              </li>
              <li>
                <Link href="/courses?cat=Islamic" className="hover:text-emerald-custom-light transition-colors">
                  Islamic Supplications & Fiqh
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base mb-6 border-l-2 border-gold-custom pl-3 rtl:border-l-0 rtl:border-r-2 rtl:pr-3">
              Contact Details
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3 rtl:space-x-reverse">
                <Mail className="h-5 w-5 text-gold-custom shrink-0" />
                <span className="text-gray-400">info@hannan-consultants.edu</span>
              </li>
              <li className="flex items-start space-x-3 rtl:space-x-reverse">
                <Phone className="h-5 w-5 text-gold-custom shrink-0" />
                <span className="text-gray-400" dir="ltr">+92 (300) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3 rtl:space-x-reverse">
                <MapPin className="h-5 w-5 text-gold-custom shrink-0" />
                <span className="text-gray-400">
                  Suite 104, Faisal Plaza, Heights, Islamabad, Pakistan
                </span>
              </li>
            </ul>
            <div className="pt-2 text-xs text-gray-500">
              <p>Mon - Sat: 24 Hours Availability</p>
              <p>Sunday Classes: On Special Demand</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-sm flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 flex items-center gap-1">
            <span>© {currentYear} Hannan Consultants. All Rights Reserved.</span>
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse mt-4 md:mt-0 text-gray-500 text-xs">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms & Conditions
            </Link>
            <span className="flex items-center gap-1 text-gray-600">
              Made with <Heart className="h-3 w-3 text-emerald-custom-light fill-emerald-custom-light" /> for Quranic Literacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
