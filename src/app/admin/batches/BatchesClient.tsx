"use client";

import React, { useState } from "react";
import { createBatch, deleteBatch, editBatch } from "@/app/actions/batchesAdmin";
import { Clock, Plus, Trash2, Video, Users, Calendar, AlertCircle } from "lucide-react";

export function BatchesClient({ batches, courses, teachers }: { batches: any[], courses: any[], teachers: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    let res;
    if (editingBatch) {
      formData.append("id", editingBatch.id);
      res = await editBatch(formData);
    } else {
      res = await createBatch(formData);
    }
    
    if (res.error) {
      setError(res.error);
    } else {
      setIsAdding(false);
      setEditingBatch(null);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-custom">Manage Batches</h2>
          <p className="text-sm text-gray-500">Assign teachers and schedule course batches.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingBatch(null); }}
          className="px-4 py-2 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding || editingBatch ? "Cancel" : "Add Batch"}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-navy-custom mb-4">Create New Batch</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center space-x-2 border border-red-100">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Batch Name</label>
                <input name="name" required defaultValue={editingBatch?.name || ""} placeholder="E.g. Evening Batch A" className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Course</label>
                <select name="courseId" required defaultValue={editingBatch?.courseId || ""} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all appearance-none">
                  <option value="">Select a Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Teacher</label>
                <select name="teacherId" required defaultValue={editingBatch?.teacherId || ""} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all appearance-none">
                  <option value="">Assign a Teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name || t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Time (UTC)</label>
                <input name="time" required defaultValue={editingBatch?.time || ""} placeholder="E.g. 18:00 UTC" className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Days of Week (Comma separated)</label>
                <input name="daysOfWeek" required defaultValue={editingBatch?.daysOfWeek?.join(", ") || ""} placeholder="Monday, Wednesday, Friday" className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Classes per Week</label>
                <input name="classesPerWeek" type="number" required min="1" max="7" defaultValue={editingBatch?.classesPerWeek || 3} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>

              <div className="flex space-x-2">
                <div className="w-2/3">
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Price</label>
                  <input name="price" type="number" step="0.01" required defaultValue={editingBatch?.price || 35} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
                </div>
                <div className="w-1/3">
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Curr</label>
                  <input name="currency" required defaultValue={editingBatch?.currency || "PKR"} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Live Class Link (Optional)</label>
                <input name="liveClassLink" defaultValue={editingBatch?.liveClassLink || ""} placeholder="Zoom or Meet link" className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Free Trial Video URL (Optional)</label>
                <input name="trialVideoUrl" defaultValue={editingBatch?.trialVideoUrl || ""} placeholder="e.g. YouTube or Drive link" className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button disabled={isSubmitting} type="submit" className="px-6 py-2.5 bg-navy-custom hover:bg-navy-900 text-white font-bold text-sm rounded-xl transition-colors">
                {isSubmitting ? "Saving..." : (editingBatch ? "Save Changes" : "Create Batch")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative group">
             <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => {
                     setEditingBatch(batch);
                     setIsAdding(true);
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }} className="text-xs font-bold text-emerald-custom bg-emerald-custom/10 hover:bg-emerald-custom hover:text-white px-2 py-1 rounded transition-colors mr-2">
                  Edit
                </button>
                <button onClick={() => {
                     if(confirm('Delete this batch?')) deleteBatch(batch.id);
                   }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
             
             <span className="text-[10px] font-bold text-emerald-custom-light uppercase tracking-widest">{batch.course.name}</span>
             <h3 className="text-lg font-bold text-navy-custom mt-1">{batch.name}</h3>
             
             <div className="mt-4 space-y-2 flex-grow">
               <div className="flex items-center text-xs font-bold text-gray-600">
                 <Users className="w-4 h-4 mr-2 text-emerald-custom" />
                 Teacher: {batch.teacher?.user?.name || batch.teacher?.name}
               </div>
               <div className="flex items-center text-xs font-bold text-gray-600">
                 <Clock className="w-4 h-4 mr-2 text-emerald-custom" />
                 {batch.time} ({batch.daysOfWeek.join(", ")})
               </div>
               <div className="flex items-center text-xs font-bold text-gray-600">
                 <Users className="w-4 h-4 mr-2 text-emerald-custom" />
                 {batch._count?.registrations || 0} Students Registered
               </div>
               <div className="flex items-center justify-between text-xs font-bold text-gray-600 mt-4 border-t border-gray-100 pt-3">
                 <span className="text-emerald-custom">{batch.classesPerWeek} Classes/Week</span>
                 <span className="text-lg font-black text-navy-custom">{batch.price} <span className="text-xs font-bold text-gray-400">{batch.currency}</span></span>
               </div>
             </div>

             <div className="mt-6 pt-4 border-t border-gray-100">
                {batch.linkHistory && batch.linkHistory.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center mb-1">
                      <Clock className="w-3 h-3 mr-1.5" /> Previous Links
                    </span>
                    <div className="space-y-1 max-h-20 overflow-y-auto pr-2 custom-scrollbar">
                      {batch.linkHistory.map((historyItem: any) => (
                        <div key={historyItem.id} className="flex justify-between items-center text-[10px]">
                           <a href={historyItem.url} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-600 truncate max-w-[65%]">
                             {historyItem.url}
                           </a>
                           <span className="text-gray-400 whitespace-nowrap">
                             {new Date(historyItem.createdAt).toLocaleDateString()} {new Date(historyItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  {batch.liveClassLink ? (
                    <a href={batch.liveClassLink} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-emerald-custom hover:text-emerald-600 transition-colors">
                      <Video className="w-4 h-4 mr-1" />
                      Current Live Class Link
                    </a>
                  ) : (
                    <span className="flex items-center text-xs font-bold text-gray-400">
                      <Video className="w-4 h-4 mr-1" />
                      No link provided
                    </span>
                  )}
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
