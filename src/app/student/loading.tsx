import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-in fade-in duration-300">
      <div className="p-4 bg-emerald-50 rounded-full">
        <Loader2 className="w-8 h-8 text-emerald-custom animate-spin" />
      </div>
      <p className="text-sm font-bold text-gray-500 animate-pulse">Loading data...</p>
    </div>
  );
}
