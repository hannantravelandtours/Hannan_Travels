"use client";

import React, { useState } from "react";
import { sendClassLink, sendOneOnOneClassLink } from "@/app/actions/classLinks";
import { Send, Video, CheckCircle, AlertCircle, UserCheck, Users } from "lucide-react";

interface Props {
  batches: any[];
  oneOnOneRegistrations?: any[];
  teacherUserId: string;
}

export default function SendLinkClient({ batches, oneOnOneRegistrations = [], teacherUserId }: Props) {
  const [mode, setMode] = useState<"one-on-one" | "batch">(
    oneOnOneRegistrations.length > 0 ? "one-on-one" : "batch"
  );
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedOneOnOne, setSelectedOneOnOne] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOneOnOneSelect = (regId: string) => {
    setSelectedOneOnOne(regId);
    const reg = oneOnOneRegistrations.find(r => r.id === regId);
    if (reg?.classLink) {
      setLinkInput(reg.classLink);
    } else {
      setLinkInput("");
    }
  };

  const handleSend = async () => {
    if (!linkInput.trim()) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (mode === "one-on-one") {
      if (!selectedOneOnOne) {
        setError("Please select a 1-on-1 student.");
        setIsSubmitting(false);
        return;
      }
      const res = await sendOneOnOneClassLink(selectedOneOnOne, linkInput.trim(), teacherUserId);
      if (res.error) {
        setError(res.error);
      } else {
        const studentName = oneOnOneRegistrations.find(r => r.id === selectedOneOnOne)?.student?.user?.name || "Student";
        setSuccess(`1-on-1 Class link saved and shared with ${studentName}!`);
      }
    } else {
      if (!selectedBatch) {
        setError("Please select a batch.");
        setIsSubmitting(false);
        return;
      }
      const res = await sendClassLink(selectedBatch, linkInput.trim(), teacherUserId, titleInput.trim(), dateInput);
      if (res.error) {
        setError(res.error);
      } else {
        const batchName = batches.find(b => b.id === selectedBatch)?.name || "batch";
        setSuccess(`Class link sent successfully to all students in "${batchName}"!`);
        setLinkInput("");
        setTitleInput("");
        setDateInput("");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-navy-custom">Send Class Link</h2>
        <p className="text-sm text-gray-500">Share your live Google Meet or Zoom class link directly with your students.</p>
      </div>

      {/* Target Type Selector */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => { setMode("one-on-one"); setSuccess(null); setError(null); }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === "one-on-one"
              ? "bg-white text-emerald-custom shadow-sm"
              : "text-gray-500 hover:text-navy-custom"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>1-on-1 Private Student ({oneOnOneRegistrations.length})</span>
        </button>
        <button
          type="button"
          onClick={() => { setMode("batch"); setSuccess(null); setError(null); }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === "batch"
              ? "bg-white text-emerald-custom shadow-sm"
              : "text-gray-500 hover:text-navy-custom"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Batch Class ({batches.length})</span>
        </button>
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
        {mode === "one-on-one" ? (
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Select 1-on-1 Student</label>
            {oneOnOneRegistrations.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-500 text-center">
                No active 1-on-1 students assigned yet.
              </div>
            ) : (
              <select
                value={selectedOneOnOne}
                onChange={(e) => handleOneOnOneSelect(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-3 px-4 text-sm outline-none transition-all"
              >
                <option value="">Choose a student...</option>
                {oneOnOneRegistrations.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.student?.user?.name} — {r.course?.name} ({r.oneOnOnePlan?.title || "1-on-1 Plan"})
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-3 px-4 text-sm outline-none transition-all"
            >
              <option value="">Choose a batch...</option>
              {batches.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.course.name} ({b._count?.registrations || 0} students)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Link Input */}
        {((mode === "one-on-one" && selectedOneOnOne) || (mode === "batch" && selectedBatch)) && (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
            {mode === "batch" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Class Title (Optional)</label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="e.g. Surah Al-Baqarah Revision"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-3 px-4 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Class Date & Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-3 px-4 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-2">
                Class Link (Zoom / Google Meet URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="https://meet.google.com/... or https://zoom.us/..."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={isSubmitting || !linkInput.trim()}
                  className="px-6 py-3 bg-emerald-custom hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center space-x-2 whitespace-nowrap shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Saving..." : mode === "one-on-one" ? "Save & Send Link" : "Send Link"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
