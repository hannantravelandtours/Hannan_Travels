"use client";

import React, { useState } from "react";
import { createCourse, deleteCourse, toggleCourseActive } from "@/app/actions/coursesAdmin";
import { BookOpen, Plus, Trash2, Edit2, AlertCircle } from "lucide-react";
import { CourseCategory } from "@prisma/client";

export function CoursesClient({ courses }: { courses: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await createCourse(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsAdding(false);
      }
    } catch (err) {
      console.error(err);
      setError("A critical error occurred. Please check your Supabase API keys in the .env file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-custom">Manage Courses</h2>
          <p className="text-sm text-gray-500">Create and update course offerings.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? "Cancel" : "Add Course"}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-navy-custom mb-4">Add New Course</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center space-x-2 border border-red-100">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Course Name</label>
                <input name="name" required placeholder="E.g. Advanced Tajweed" className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Subtitle</label>
                <input name="subtitle" placeholder="E.g. Learn to read Quran with perfect pronunciation" className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Banner Image</label>
                <input type="file" name="bannerImage" accept="image/*" className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2 px-4 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Category</label>
                <select name="category" required className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all appearance-none">
                  <option value="QAIDA">Qaida</option>
                  <option value="NAZRA">Nazra</option>
                  <option value="HIFZ">Hifz</option>
                  <option value="QURAN">Quran</option>
                  <option value="TAJWEED">Tajweed</option>
                  <option value="ARABIC">Arabic</option>
                  <option value="ISLAMIC_STUDIES">Islamic Studies</option>
                  <option value="KIDS">Kids</option>
                  <option value="FEMALE_ONLY">Female Only</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Description</label>
                <textarea name="description" rows={2} placeholder="Brief description of the course..." className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div className="md:col-span-3 flex items-center space-x-2 pt-2">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked className="w-4 h-4 text-emerald-custom rounded border-gray-300 focus:ring-emerald-custom" />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-600">Active (Visible to public)</label>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button disabled={isSubmitting} type="submit" className="px-6 py-2.5 bg-navy-custom hover:bg-navy-900 text-white font-bold text-sm rounded-xl transition-colors">
                {isSubmitting ? "Saving..." : "Save Course"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className={`bg-white rounded-2xl shadow-sm border ${course.isActive ? 'border-gray-100' : 'border-gray-200 opacity-75'} p-6 relative flex flex-col`}>
             <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                  course.category === 'QAIDA' ? 'bg-blue-50 text-blue-600' :
                  course.category === 'NAZRA' ? 'bg-purple-50 text-purple-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {course.category}
                </span>
                <div className="flex items-center space-x-2">
                   <button 
                      onClick={() => toggleCourseActive(course.id, !course.isActive)}
                      className={`text-xs font-bold px-2 py-1 rounded ${course.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} transition-colors`}
                    >
                      {course.isActive ? 'Active' : 'Inactive'}
                   </button>
                   <button onClick={() => {
                     if(confirm('Delete this course?')) deleteCourse(course.id);
                   }} className="text-gray-400 hover:text-red-500 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
             
             <div className="flex items-center space-x-4 mb-4">
                {course.bannerImage && (
                  <img src={course.bannerImage} alt={course.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-navy-custom text-lg">{course.name}</h3>
                  {course.subtitle && <p className="text-xs text-gray-500 mt-0.5">{course.subtitle}</p>}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">{course.description || "No description provided."}</p>
             
             <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end">
                <div className="flex items-center text-xs font-bold text-gray-400">
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  {course.batches?.length || 0} Batches
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
