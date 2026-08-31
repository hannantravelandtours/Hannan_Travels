"use client";

import React, { useState } from "react";
import { sendClassLink } from "@/app/actions/classLinks";
import { Send, Video, CheckCircle, AlertCircle } from "lucide-react";

export default function SendLinkClient({ batches, teacherUserId }: { batches: any[], teacherUserId: string }) {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!selectedBatch || !linkInput.trim()) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const res = await sendClassLink(selectedBatch, linkInput.trim(), teacherUserId);
    if (res.error) {
      setError(res.error);
    } else {
      const batchName = batches.find(b => b.id === selectedBatch)?.name || "batch";
      setSuccess(`Class link sent successfully to all students in "${batchName}"!`);
      setLinkInput("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-navy-custom">Send Class Link</h2>
        <p className="text-sm text-gray-500">Select a batch and send the class link to all enrolled students.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm flex items-center space-x-2 border border-emerald-100">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center space-x-2 border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Batch Dropdown */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Select Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-3 px-4 text-sm outline-none transition-all appearance-none"
          >
            <option value="">Choose a batch...</option>
            {batches.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.course.name} ({b._count?.registrations || 0} students)
              </option>
            ))}
          </select>
        </div>

        {/* Link Input */}
        {selectedBatch && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Class Link (Zoom / Google Meet)</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Paste your class link here..."
                  className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={isSubmitting || !linkInput.trim()}
                className="px-6 py-3 bg-emerald-custom hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending..." : "Send Link"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
