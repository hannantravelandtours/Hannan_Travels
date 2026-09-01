"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, BookOpen } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ];

  const [coursesList, setCoursesList] = useState<{name: string, path: string}[]>([]);

  useEffect(() => {
    // Dynamically fetch courses for the dropdown
    import("@/app/actions/courses").then((module) => {
      module.getActiveCourses().then((courses) => {
        if (courses && courses.length > 0) {
          setCoursesList(courses.map((c) => ({ name: c.name, path: `/courses/${c.id}` })));
        }
      });
    });
  }, []);

  const bottomLinks = [
    { name: "Hadya/Fee", path: "/fee" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact" },
    { name: "Register", path: "/register" },
  ];

  const isHome = true; // Apply transparent overlapping navbar to all public pages

  // Dynamic header styles depending on if it's homepage or secondary pages
  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isHome
      ? scrolled
        ? "bg-[#0b0908]/95 shadow-md py-2 text-white backdrop-blur-xl border-b border-white/5"
        : "bg-transparent py-3 text-white backdrop-blur-xl border-b border-white/10"
      : scrolled
        ? "bg-white shadow-md py-2 text-navy-custom border-b border-gray-100"
        : "bg-white py-3 text-navy-custom border-b border-gray-50"
  }`;

  const linkClass = (path: string) => {
    const isActive = pathname === path;
    if (isHome) {
      return `transition-colors duration-255 ${
        isActive 
          ? "text-gold-custom-light font-bold border-b-2 border-gold-custom-light pb-1" 
          : "text-white/80 hover:text-gold-custom-light"
      }`;
    } else {
      return `transition-colors duration-255 ${
        isActive 
          ? "text-emerald-custom font-bold border-b-2 border-emerald-custom pb-1" 
          : "text-navy-custom/80 hover:text-emerald-custom"
      }`;
    }
  };

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.webp" alt="Hannan Consultants Quran Academy" className="h-12 sm:h-14 w-auto object-contain drop-shadow-md rounded-lg" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse font-medium text-sm">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} className={linkClass(link.path)}>
                {link.name}
              </Link>
            ))}

            {/* Courses Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <button
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                className={`flex items-center space-x-1 rtl:space-x-reverse transition-colors duration-200 cursor-pointer py-1 ${
                  isHome ? "text-white/80 hover:text-gold-custom-light" : "text-navy-custom/80 hover:text-emerald-custom"
                }`}
              >
                <span>Courses</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {coursesDropdownOpen && (
                <div className="absolute left-0 mt-0 w-64 rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-2 transition-all text-navy-custom border border-gray-100 z-50">
                  {coursesList.length === 0 ? (
                    <div className="px-3 py-4 text-xs font-semibold text-gray-400 text-center">
                      No courses available yet
                    </div>
                  ) : (
                    coursesList.map((course) => {
                      const isCourseActive = pathname === course.path;
                      return (
                        <Link
                          key={course.path}
                          href={course.path}
                          onClick={() => setCoursesDropdownOpen(false)}
                          className={`block px-3 py-2 text-xs font-semibold rounded-lg hover:bg-emerald-50 hover:text-emerald-custom transition-all ${
                            isCourseActive ? "bg-emerald-50 text-emerald-custom" : ""
                          }`}
                        >
                          {course.name}
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {bottomLinks.map((link) => (
              <Link key={link.path} href={link.path} className={linkClass(link.path)}>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="hidden lg:flex items-center space-x-5 rtl:space-x-reverse">
            {/* Actions: Sign In & Get Started */}
            <Link
              href="/login"
              className={`text-sm font-semibold transition-all ${
                isHome ? "text-white/90 hover:text-gold-custom-light" : "text-navy-custom/80 hover:text-emerald-custom"
              }`}
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-emerald-custom hover:bg-emerald-800 hover-lift shadow-md transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-all ${
                isHome 
                  ? "text-white/85 hover:bg-white/10" 
                  : "text-navy-custom/85 hover:bg-gray-100"
              }`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 top-[52px] z-45 border-t flex flex-col p-6 animate-fade-in overflow-y-auto pb-24 ${
          isHome 
            ? "bg-navy-custom border-emerald-950 text-white" 
            : "bg-white border-gray-100 text-navy-custom"
        }`}>
          <nav className="flex flex-col space-y-4 font-medium text-base">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`pb-2 border-b transition-colors ${
                  isHome ? "border-emerald-950" : "border-gray-50"
                } ${
                  pathname === link.path 
                    ? isHome ? "text-gold-custom-light font-bold" : "text-emerald-custom font-bold"
                    : isHome ? "text-white/80" : "text-navy-custom/80"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Courses Dropdown */}
            <div className="pt-1">
              <button
                onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                className={`w-full flex items-center justify-between pb-2 border-b font-medium ${
                  isHome ? "border-emerald-950 text-white/80" : "border-gray-50 text-navy-custom/80"
                }`}
              >
                <span>Courses</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-205 ${mobileCoursesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileCoursesOpen && (
                <div className="pl-4 pt-2 space-y-2 flex flex-col text-xs">
                  {coursesList.length === 0 ? (
                    <div className="py-2 font-medium text-gray-400 text-sm">
                      No courses available yet
                    </div>
                  ) : (
                    coursesList.map((course) => (
                      <Link
                        key={course.path}
                        href={course.path}
                        onClick={() => {
                          setMobileCoursesOpen(false);
                          setMobileMenuOpen(false);
                        }}
                        className={`py-1 font-semibold transition-all border-b ${
                          isHome 
                            ? "border-emerald-950/30 text-white/70 hover:text-gold-custom-light" 
                            : "border-gray-50/50 text-navy-custom/75 hover:text-emerald-custom"
                        }`}
                      >
                        {course.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {bottomLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`pb-2 border-b transition-colors ${
                  isHome ? "border-emerald-950" : "border-gray-50"
                } ${
                  pathname === link.path 
                    ? isHome ? "text-gold-custom-light font-bold" : "text-emerald-custom font-bold"
                    : isHome ? "text-white/80" : "text-navy-custom/80"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Trial CTA buttons on mobile */}
            <div className="pt-4 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-center py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isHome 
                    ? "text-white border border-white/20 hover:bg-white/10" 
                    : "text-navy-custom border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full text-sm font-semibold text-white bg-emerald-custom hover:bg-emerald-900 shadow-md transition-all"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
