"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { direction } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname?.startsWith("/courses/");
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  
  if (isAuthPage) {
    return (
      <div className="flex flex-col min-h-screen" dir={direction}>
        <main className="flex-grow pt-0">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir={direction}>
      <Navbar />
      <main className={`flex-grow ${isHome ? "pt-0" : "pt-20"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
