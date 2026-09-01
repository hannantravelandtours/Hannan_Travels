"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Admissions Info",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Admissions Info",
        message: ""
      });
    }
  };

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
            Get In Touch
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-semibold uppercase tracking-wide">
            Our support team is available 24/7 to assist you with enrollment and queries.
          </p>
        </div>
      </section>

      {/* Main grids */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Panels (Col-5) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-navy-custom">Get In Touch</h2>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Have questions about pricing, curriculum formats, or specific teacher hours? Send us a message or chat directly via WhatsApp. Our admissions support team is available 24/7.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="p-3 bg-emerald-custom/5 text-emerald-custom rounded-lg">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Email Support</h4>
                  <span className="text-sm font-bold text-navy-custom">admissions@hannan-consultants.edu</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-3 bg-emerald-custom/5 text-emerald-custom rounded-lg">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Call/WhatsApp Support</h4>
                  <span className="text-sm font-bold text-navy-custom" dir="ltr">+92 300 1234567</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-3 bg-emerald-custom/5 text-emerald-custom rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Academy Headquarters</h4>
                  <span className="text-sm font-bold text-navy-custom">
                    Suite 104, Faisal Plaza, Heights, Islamabad, Pakistan
                  </span>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp CTA Button */}
            <div className="pt-4 border-t border-gray-100">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-colors w-full sm:w-auto justify-center"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Form Panel (Col-7) */}
          <div className="lg:col-span-7 bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-custom/10 text-emerald-custom flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-emerald-custom" />
                </div>
                <h3 className="text-xl font-bold text-navy-custom">Message Sent Successfully!</h3>
                <p className="text-xs text-gray-500 font-semibold max-w-sm mx-auto">
                  Jazakallah! We have received your inquiry. A coordinator will email or call you within the next 2-3 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-emerald-custom hover:bg-emerald-900 text-white text-xs font-bold rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-bold text-navy-custom">Admissions Inquiry Form</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Hammad Ahmad"
                      className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-custom ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-bold">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-custom ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-bold">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92 300 1234567"
                      className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-custom ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 font-bold">{errors.phone}</span>}
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy-custom">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-custom bg-white cursor-pointer"
                    >
                      <option value="Admissions Info">Admissions Info</option>
                      <option value="Tuition Packages">Tuition Packages</option>
                      <option value="Careers / Apply as Teacher">Careers / Apply as Teacher</option>
                      <option value="Feedback / Complaint">Feedback / Complaint</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy-custom">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your inquiry details..."
                    className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-custom ${
                      errors.message ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.message && <span className="text-[10px] text-red-500 font-bold">{errors.message}</span>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-custom hover:bg-emerald-900 text-white font-bold text-sm rounded-lg shadow-md hover-lift transition-colors"
                >
                  Send Inquiry Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Google Maps Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-64 bg-gray-100 border border-gray-150 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-2">
          <MapPin className="h-8 w-8 text-gold-custom animate-bounce" />
          <h3 className="text-sm font-bold text-navy-custom">Admissions Head Office Coordinates</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Faisal Plaza, Jinnah Avenue, Sector F-7, Islamabad, Pakistan. Map visual is currently offline (mock representation).
          </p>
        </div>
      </section>
    </div>
  );
}
