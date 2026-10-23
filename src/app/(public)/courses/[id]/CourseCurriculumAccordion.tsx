"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CurriculumModule {
  week: string;
  title: string;
  details: string[];
}

export function CourseCurriculumAccordion({ curriculum }: { curriculum: CurriculumModule[] }) {
  const [expandedCurriculum, setExpandedCurriculum] = useState<number | null>(0);

  if (!curriculum || curriculum.length === 0) return null;

  return (
    <div className="space-y-3">
      {curriculum.map((module, idx) => {
        const isOpen = expandedCurriculum === idx;
        return (
          <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setExpandedCurriculum(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-navy-custom hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded bg-emerald-custom/10 text-emerald-custom text-[10px] uppercase font-bold">
                  {module.week}
                </span>
                <span>{module.title}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="p-5 pt-0 border-t border-gray-50 bg-gray-50/50">
                <ul className="space-y-2 text-xs text-gray-500 font-semibold pt-4">
                  {module.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-custom shrink-0"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
