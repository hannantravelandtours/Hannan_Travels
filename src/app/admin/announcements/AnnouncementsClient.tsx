"use client";

import React, { useState } from "react";
import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from "@/app/actions/announcements";
import { Bell, Plus, Trash2, Edit2, CheckCircle, AlertCircle, Users, GraduationCap, Clock } from "lucide-react";

export default function AnnouncementsClient({ announcements, batches, teachers }: { announcements: any[], batches: any[], teachers: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [targetType, setTargetType] = useState("ALL");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (editingId) {
      res = await updateAnnouncement(editingId, formData);
    } else {
      res = await createAnnouncement(formData);
    }

    if (res.error) {
      setError(res.error);
    } else {
      setIsAdding(false);
      setEditingId(null);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteAnnouncement(deleteId);
    setDeleteId(null);
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case "ALL": return <Users className="w-4 h-4" />;
      case "ALL_TEACHERS": return <GraduationCap className="w-4 h-4" />;
      case "TEACHER": return <GraduationCap className="w-4 h-4" />;
      case "ALL_BATCHES": return <Clock className="w-4 h-4" />;
      case "BATCH": return <Clock className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTargetLabel = (type: string, id: string) => {
    if (type === "ALL") return "Everyone";
    if (type === "ALL_TEACHERS") return "All Teachers";
    if (type === "ALL_BATCHES") return "All Students (All Batches)";
    if (type === "TEACHER") {
      const t = teachers.find(t => t.id === id);
      return t ? `Teacher: ${t.user.name}` : "Specific Teacher";
    }
    if (type === "BATCH") {
      const b = batches.find(b => b.id === id);
      return b ? `Batch: ${b.name}` : "Specific Batch";
    }
    return type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-custom">Announcements</h2>
          <p className="text-sm text-gray-500">Create and manage system-wide announcements.</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setTargetType("ALL"); setError(null); }}
            className="flex items-center px-4 py-2 bg-emerald-custom hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-sm shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-navy-custom">{editingId ? "Edit Announcement" : "Create Announcement"}</h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-sm font-semibold text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center space-x-2 border border-red-100">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Title</label>
                <input name="title" required className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Message</label>
                <textarea name="message" required rows={4} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all resize-none"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Target Audience</label>
                  <select 
                    name="targetType" 
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all"
                  >
                    <option value="ALL">Everyone</option>
                    <option value="ALL_TEACHERS">All Teachers</option>
                    <option value="ALL_BATCHES">All Students (All Batches)</option>
                    <option value="TEACHER">Specific Teacher</option>
                    <option value="BATCH">Specific Batch</option>
                  </select>
                </div>
                
                {targetType === "TEACHER" && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Select Teacher</label>
                    <select name="targetId" required className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all">
                      <option value="">Choose a teacher...</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.user.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === "BATCH" && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Select Batch</label>
                    <select name="targetId" required className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all">
                      <option value="">Choose a batch...</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.course.name})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button disabled={isSubmitting} type="submit" className="px-6 py-2.5 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors">
                {isSubmitting ? "Saving..." : editingId ? "Update Announcement" : "Post Announcement"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600">No Announcements</h3>
            <p className="text-sm text-gray-400 mt-2">Create an announcement to notify students or teachers.</p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    a.targetType === "ALL" ? "bg-blue-50 text-blue-600" :
                    a.targetType.includes("TEACHER") ? "bg-purple-50 text-purple-600" :
                    "bg-emerald-50 text-emerald-600"
                  }`}>
                    {getTargetIcon(a.targetType)}
                    <span className="ml-1.5">{getTargetLabel(a.targetType, a.targetId)}</span>
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-navy-custom">{a.title}</h4>
                <p className="text-sm text-gray-500 whitespace-pre-wrap">{a.message}</p>
              </div>
              <div className="flex md:flex-col items-center justify-end gap-2 shrink-0">
                <button
                  onClick={() => setDeleteId(a.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-navy-custom mb-2">Delete Announcement?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will remove the announcement from user dashboards.
            </p>
            <div className="flex space-x-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
