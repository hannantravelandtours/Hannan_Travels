"use client";

import React from "react";
import { BookOpen, ShieldCheck, Target, Heart, Award, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    { title: "Academic Integrity", desc: "Teaching Quranic recitation strictly in accordance with authentic Tajweed rules transmitted through sound chains of narration (Isnaad).", icon: ShieldCheck },
    { title: "Student Safety First", desc: "Ensuring an completely secure online workspace for children with verified tutors, parent portal logs, and recorded lectures.", icon: Heart },
    { title: "Teaching Excellence", desc: "Employing only certified teachers who hold Ijazahs (certifications) in Quran Recitation and Hifz from world-class Islamic seminaries.", icon: Award },
    { title: "Global Accessibility", desc: "Providing flexible schedules and multilingual support to make Quranic education easy and accessible for Muslims in Western countries.", icon: GraduationCap },
  ];

  const methodologySteps = [
    { step: "01", title: "Diagnostic Assessment", desc: "Every student begins with a 1-on-1 assessment by a senior supervisor to evaluate their current Arabic level and recommend the right course entry point." },
    { step: "02", title: "Personalized Study Plan", desc: "We design a customized learning syllabus matching the student's pace, weekly availability, and short-term or long-term goals." },
    { step: "03", title: "Interactive 1-on-1 Live Sessions", desc: "Lectures are delivered live on our browser portal with real-time feedback, whiteboard draw controls, and audio recitation reviews." },
    { step: "04", title: "Structured Progress Tracking", desc: "Monthly report cards, homework logs, and recorded lecture playbacks ensure parents are always aligned on their child's progress." },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Page Hero */}
      <section 
        className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-28 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/aboutpagebanner.webp')" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/hero.png')", opacity: 0.4, mixBlendMode: 'screen', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10 rtl:bg-gradient-to-l rtl:from-black/90 rtl:via-black/60 rtl:to-black/10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left rtl:text-right flex flex-col items-start rtl:items-end space-y-8">
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans text-gold-custom-light font-bold tracking-wide drop-shadow-md">
                Who We Are
              </h1>
              <span className="block text-xl sm:text-2xl font-bold tracking-widest text-white uppercase">
                Nurturing Quranic Literacy
              </span>
            </div>
            
            <p className="text-base sm:text-lg text-gray-200 font-serif leading-relaxed italic max-w-lg">
              Hannan Consultants is an international online Quran academy dedicated to providing structured Tajweed, Arabic, and Islamic education to families worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Intro & Founder Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Frame */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gold-custom rounded-2xl rotate-2 opacity-10 -z-10" />
              <div className="bg-white rounded-2xl border border-gray-150 p-8 shadow-xl space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-custom/10 text-emerald-custom flex items-center justify-center font-bold text-2xl">
                  HC
                </div>
                <blockquote className="text-sm font-medium text-navy-custom/95 leading-relaxed italic">
                  "Our academy is built on the foundation of trust, excellence, and safety. We strive to make Quranic education a premium, engaging, and deeply rewarding experience for the next generation of Muslims."
                </blockquote>
                <div>
                  <h4 className="text-base font-bold text-navy-custom">Engineer Hannan Ahmad</h4>
                  <p className="text-xs text-emerald-custom font-bold">Founder & CEO, Hannan Consultants</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-custom">
              Our Mission and Vision
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3 bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
                <div className="p-2.5 bg-emerald-custom/10 text-emerald-custom w-fit rounded-lg">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-navy-custom">Our Mission</h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  To provide premium, personalized online Quran education utilizing modern pedagogical tools, ensuring students of all ages recite correctly, understand the message, and practice the Sunnah.
                </p>
              </div>

              <div className="space-y-3 bg-white p-6 rounded-xl border border-gray-50 shadow-sm">
                <div className="p-2.5 bg-emerald-custom/10 text-emerald-custom w-fit rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-navy-custom">Our Vision</h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  To become the leading globally recognized Quranic academy, bridging traditional scholarship with advanced learning technologies to nurture a deep-rooted connection to the Holy Quran.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-dot-pattern py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-custom">
              Our Core Educational Values
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wider">
              The principles that guide our faculty and admin staff daily
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const ValIcon = v.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                  <div className="p-3 bg-emerald-custom/5 text-emerald-custom w-fit rounded-lg">
                    <ValIcon className="h-6 w-6 text-emerald-custom" />
                  </div>
                  <h3 className="text-base font-bold text-navy-custom">{v.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-custom">
            Our Teaching Methodology
          </h2>
          <p className="text-sm text-gray-500 font-semibold">
            How we deliver a premium, structured Quranic curriculum from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {methodologySteps.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <span className="absolute top-2 right-4 text-4xl font-extrabold text-emerald-custom/5">
                {m.step}
              </span>
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-bold text-navy-custom">{m.title}</h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-custom text-center p-8 sm:p-12 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-xl sm:text-3xl font-bold text-white">
            Ready to experience our teaching methodology?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">
            Book a free trial and get evaluated by a senior Quran supervisor within 24 hours.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 rounded-full bg-emerald-custom hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors"
            >
              <span>Book My Evaluation Call</span>
              <ArrowRight className="h-4 w-4 text-gold-custom" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
