"use client";

import React, { useState } from "react";
import { updateLiveLink } from "@/app/actions/teacherActions";
import { Users, Clock, Calendar, Video, Edit2, CheckCircle } from "lucide-react";
import Link from "next/link";

export function TeacherClassesClient({ batches }: { batches: any[] }) {
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveLink = async (batchId: string) => {
    if (!linkInput.trim()) return;
    await updateLiveLink(batchId, linkInput, titleInput, dateInput);
    setEditingLink(null);
    setSuccessMessage("Link sent successfully to all students and admin!");
    setTimeout(() => setSuccessMessage(null), 3000);
    setTitleInput("");
    setDateInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-custom">My Assigned Batches</h2>
        <p className="text-sm text-gray-500">Manage your classes, update live links, and mark attendance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batches.length === 0 && (
          <div className="col-span-2 bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
             <h3 className="text-lg font-bold text-gray-600">No assigned batches yet.</h3>
          </div>
        )}
        
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[10px] font-bold text-emerald-custom-light uppercase tracking-widest">{batch.course.name}</span>
               <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md">
                 Active
               </span>
            </div>
            
            <h3 className="text-xl font-bold text-navy-custom">{batch.name}</h3>
            
            <div className="mt-4 space-y-2 flex-grow">
               <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-emerald-custom" />
                  <span className="font-semibold text-gray-700 w-24">Days:</span> 
                  <span className="text-gray-600">{batch.daysOfWeek.join(", ")}</span>
               </div>
               <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-3 text-emerald-custom" />
                  <span className="font-semibold text-gray-700 w-24">Time:</span> 
                  <span className="text-gray-600">{batch.time} (UTC)</span>
               </div>
               <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-3 text-emerald-custom" />
                  <span className="font-semibold text-gray-700 w-24">Students:</span> 
                  <span className="text-gray-600">{batch._count.registrations} Enrolled</span>
               </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 space-y-4">
               {/* Previous Links History */}
               {batch.linkHistory && batch.linkHistory.length > 0 && (
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center mb-2">
                      <Clock className="w-4 h-4 mr-1.5" /> Previous Links
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                       {batch.linkHistory.map((historyItem: any) => (
                        <div key={historyItem.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-xs gap-2">
                           <div className="flex flex-col">
                             {historyItem.title && <span className="font-bold text-gray-800">{historyItem.title}</span>}
                             <a href={historyItem.url} target="_blank" className="text-emerald-600 hover:text-emerald-700 font-semibold truncate max-w-full sm:max-w-[200px]">
                               {historyItem.url}
                             </a>
                           </div>
                           <span className="text-gray-400 whitespace-nowrap text-[10px] sm:text-xs font-medium">
                             {historyItem.date 
                               ? new Date(historyItem.date).toLocaleDateString() + ' ' + new Date(historyItem.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                               : new Date(historyItem.createdAt).toLocaleDateString() + ' ' + new Date(historyItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                             }
                           </span>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {/* Live Link Section */}
               <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-emerald-800 uppercase flex items-center">
                      <Video className="w-4 h-4 mr-1.5" /> Live Class Link
                    </label>
                  </div>
                  
                  {editingLink === batch.id ? (
                    <div className="flex flex-col gap-2">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                         <input 
                           placeholder="Class Title (Optional)"
                           value={titleInput}
                           onChange={(e) => setTitleInput(e.target.value)}
                           className="flex-1 bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2 text-sm outline-none"
                         />
                         <input 
                           type="datetime-local"
                           value={dateInput}
                           onChange={(e) => setDateInput(e.target.value)}
                           className="flex-1 bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2 text-sm outline-none"
                         />
                       </div>
                       <div className="flex flex-col sm:flex-row gap-2">
                         <input 
                           autoFocus
                           value={linkInput}
                           onChange={(e) => setLinkInput(e.target.value)}
                           className="flex-1 bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2 text-sm outline-none"
                           placeholder="Paste Google Meet or Zoom link here..."
                         />
                         <div className="flex space-x-2">
                           <button onClick={() => { setEditingLink(null); setTitleInput(""); setDateInput(""); }} className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                              Cancel
                           </button>
                           <button onClick={() => handleSaveLink(batch.id)} className="px-4 py-2 bg-emerald-custom hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1.5" /> Send Link
                           </button>
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100">
                       {batch.liveClassLink ? (
                         <a href={batch.liveClassLink} target="_blank" className="flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 truncate w-full sm:max-w-[70%]">
                           <Video className="w-4 h-4 mr-2 flex-shrink-0" />
                           <span className="truncate">{batch.liveClassLink}</span>
                         </a>
                       ) : (
                         <span className="text-sm text-gray-400 italic">No link assigned yet</span>
                       )}
                       
                       <button onClick={() => {
                         setEditingLink(batch.id);
                         setLinkInput(batch.liveClassLink || "");
                       }} className="w-full sm:w-auto px-4 py-2 bg-navy-custom hover:bg-navy-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center">
                         {batch.liveClassLink ? "Update Link" : "Send Link"}
                       </button>
                    </div>
                  )}

                  {successMessage && editingLink !== batch.id && (
                    <p className="mt-2 text-xs font-semibold text-emerald-600 animate-pulse">
                      ✓ {successMessage}
                    </p>
                  )}
               </div>

               <Link href={`/teacher/classes/${batch.id}`} className="w-full py-2.5 bg-navy-custom hover:bg-navy-900 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2">
                 <span>Manage Students & Attendance</span>
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
