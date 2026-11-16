"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function TopLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    // When pathname changes, finish the progress bar
    if (loading) {
      clearAllTimeouts();
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    // Listen for internal navigation link clicks
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        targetAttr !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // Only trigger if navigating to a different path
        const currentPath = window.location.pathname;
        const targetPath = href.split("?")[0].split("#")[0];

        if (targetPath !== currentPath) {
          clearAllTimeouts();
          setLoading(true);
          setProgress(25);

          // Simulate progress stages
          const t1 = setTimeout(() => setProgress(65), 150);
          const t2 = setTimeout(() => setProgress(85), 600);

          // Safety timeout
          const t3 = setTimeout(() => {
            setLoading(false);
            setProgress(0);
          }, 8000);

          timeoutsRef.current = [t1, t2, t3];
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      clearAllTimeouts();
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-all duration-300"
      style={{
        height: "3px",
        opacity: progress === 100 ? 0 : 1,
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-gold-custom via-emerald-400 to-emerald-custom shadow-[0_0_10px_rgba(16,185,129,0.7)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}