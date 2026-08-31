"use client";

import React, { useState } from "react";
import { deleteStudent, updateStudent, toggleStudentAccess } from "@/app/actions/studentsAdmin";
import { Trash2, Mail, Phone, MapPin, Edit2, Key, AlertCircle, ShieldCheck, ShieldOff } from "lucide-react";

export function StudentsClient({ students }: { students: any[] }) {
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [viewingCredentials, setViewingCredentials] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteStudent(id);
    setStudentToDelete(null);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateStudent(editingStudent.id, formData);
    if (res.error) {
      setError(res.error);
    } else {
      setEditingStudent(null);
    }
    setIsSubmitting(false);
  };

  const handleAccessToggle = async (registrationId: string, currentAccess: boolean) => {
    await toggleStudentAccess(registrationId, !currentAccess);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-custom">Manage Students</h2>
          <p className="text-sm text-gray-500">View, edit, and manage registered students.</p>
        </div>
      </div>

      {/* Edit Student Form */}
      {editingStudent && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-navy-custom">Edit Student: {editingStudent.name}</h3>
            <button onClick={() => { setEditingStudent(null); setError(null); }} className="text-sm font-semibold text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          <form onSubmit={handleUpdate} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center space-x-2 border border-red-100">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Name</label>
                <input name="name" required defaultValue={editingStudent.name} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Email</label>
                <input name="email" type="email" defaultValue={editingStudent.email} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">New Password <span className="text-gray-300 normal-case">(leave blank to keep)</span></label>
                <input name="password" type="password" placeholder="Optional" minLength={6} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Phone</label>
                <input name="phone" defaultValue={editingStudent.phone || ""} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Father Name</label>
                <input name="fatherName" defaultValue={editingStudent.studentProfile?.fatherName || ""} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Country</label>
                <input name="country" defaultValue={editingStudent.studentProfile?.country || ""} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Address</label>
                <input name="address" defaultValue={editingStudent.studentProfile?.address || ""} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Age</label>
                <input name="age" type="number" defaultValue={editingStudent.studentProfile?.age || ""} className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-custom focus:ring-1 focus:ring-emerald-custom rounded-xl py-2.5 px-4 text-sm outline-none transition-all" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button disabled={isSubmitting} type="submit" className="px-6 py-2.5 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors">
                {isSubmitting ? "Updating..." : "Update Student"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Enrolled Courses</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No students registered yet.
                  </td>
                </tr>
              )}
              {students.map((student) => (
                <React.Fragment key={student.id}>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-navy-custom">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div>{student.name}</div>
                          <div className="text-xs text-gray-400 font-normal">Age: {student.studentProfile?.age || "-"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center text-xs"><Mail className="w-3 h-3 mr-1.5" /> {student.email}</div>
                      {student.phone && (
                        <div className="flex items-center text-xs"><Phone className="w-3 h-3 mr-1.5" /> {student.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {student.studentProfile?.country ? (
                        <div className="flex items-center text-xs"><MapPin className="w-3 h-3 mr-1.5 text-gray-400" /> {student.studentProfile.country}</div>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1.5 text-xs">
                         {student.studentProfile?.registrations?.map((reg: any) => (
                           <div key={reg.id} className="flex items-center space-x-2">
                             <span className="font-semibold text-emerald-700">{reg.course.name}</span>
                             <span className="text-gray-400 font-normal">({reg.status})</span>
                             <button
                               onClick={() => handleAccessToggle(reg.id, reg.accessEnabled !== false)}
                               className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                 reg.accessEnabled !== false
                                   ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                   : "bg-red-50 text-red-600 hover:bg-red-100"
                               }`}
                               title={reg.accessEnabled !== false ? "Click to revoke access" : "Click to grant access"}
                             >
                               {reg.accessEnabled !== false ? (
                                 <><ShieldCheck className="w-3 h-3" /><span>Access</span></>
                               ) : (
                                 <><ShieldOff className="w-3 h-3" /><span>Blocked</span></>
                               )}
                             </button>
                           </div>
                         ))}
                         {(!student.studentProfile?.registrations || student.studentProfile.registrations.length === 0) && (
                           <span className="text-gray-400 font-normal">None</span>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setViewingCredentials(viewingCredentials === student.id ? null : student.id)} className="text-gray-400 hover:text-blue-500 transition-colors p-1" title="View Credentials">
                        <Key className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingStudent(student); setError(null); }} className="text-gray-400 hover:text-emerald-500 transition-colors p-1" title="Edit Student">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setStudentToDelete(student.id)} className="p-1 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  {viewingCredentials === student.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-3 bg-blue-50/50 border-t border-blue-100">
                        <div className="flex items-center space-x-6 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-500 uppercase">Login Email:</span>
                            <span className="font-semibold text-navy-custom bg-white px-3 py-1 rounded-lg border border-gray-200">{student.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-500 uppercase">Password:</span>
                            <span className="font-semibold text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-200">••••••••</span>
                            <span className="text-gray-400 italic">(Use edit to change)</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-navy-custom mb-2">Delete Student?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this student and all their records? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setStudentToDelete(null)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(studentToDelete)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
