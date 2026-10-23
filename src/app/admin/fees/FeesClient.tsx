"use client";

import React, { useState } from "react";
import { recordFeePayment, payTeacherSalary } from "@/app/actions/feesAdmin";
import { DollarSign, Plus, AlertCircle, CheckCircle } from "lucide-react";

export function FeesClient({ activeRegistrations, teachers, feeRecords, salaryPayments }: { activeRegistrations: any[], teachers: any[], feeRecords: any[], salaryPayments: any[] }) {
  const [activeTab, setActiveTab] = useState<"fees" | "salaries">("fees");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFeeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await recordFeePayment(formData);
    if (res.error) setError(res.error);
    else e.currentTarget.reset();
    setIsSubmitting(false);
  };

  const handleSalarySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await payTeacherSalary(formData);
    if (res.error) setError(res.error);
    else e.currentTarget.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-custom">Finances</h2>
          <p className="text-sm text-gray-500">Manage student fees and teacher salaries.</p>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("fees")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "fees" ? "border-emerald-custom text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Student Fees
        </button>
        <button 
          onClick={() => setActiveTab("salaries")}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "salaries" ? "border-emerald-custom text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Teacher Salaries
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center space-x-2 border border-red-100">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {activeTab === "fees" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-1 h-fit">
            <h3 className="text-lg font-bold text-navy-custom mb-4 flex items-center"><Plus className="w-4 h-4 mr-2" /> Record Payment</h3>
            <form onSubmit={handleFeeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Student & Course</label>
                <select name="registrationId" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none">
                  <option value="">Select Registration...</option>
                  {activeRegistrations.map((reg: any) => {
                    const planBadge = reg.isOneOnOne
                      ? `[1-on-1: ${reg.oneOnOnePlan?.title || "Plan"} - Rs ${Number(reg.oneOnOnePlan?.defaultPrice || 0).toLocaleString()}/mo]`
                      : `[Batch: ${reg.batch?.name || "General"} - Rs ${Number(reg.batch?.price || 0).toLocaleString()}/mo]`;

                    return (
                      <option key={reg.id} value={reg.id}>
                        {reg.student.user.name} — {reg.course.name} {planBadge}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Billing Month</label>
                <input type="month" name="month" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Amount Paid</label>
                <input type="number" step="0.01" name="amountPaid" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none" />
              </div>
              <button disabled={isSubmitting} className="w-full py-2.5 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors">
                {isSubmitting ? "Saving..." : "Record Fee"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-navy-custom">Recent Fee Transactions</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feeRecords.map(fee => (
                    <tr key={fee.id}>
                      <td className="px-4 py-3 text-navy-custom font-medium">{fee.registration.student.user.name}</td>
                      <td className="px-4 py-3">{fee.registration.course.name}</td>
                      <td className="px-4 py-3">{fee.month}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">{fee.amountPaid.toString()}</td>
                      <td className="px-4 py-3">
                         <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md uppercase tracking-wider">{fee.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-1 h-fit">
            <h3 className="text-lg font-bold text-navy-custom mb-4 flex items-center"><Plus className="w-4 h-4 mr-2" /> Pay Salary</h3>
            <form onSubmit={handleSalarySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Teacher</label>
                <select name="teacherId" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none">
                  <option value="">Select Teacher...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Salary Month</label>
                <input type="month" name="month" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Amount</label>
                <input type="number" step="0.01" name="amount" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none" />
              </div>
              <button disabled={isSubmitting} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors">
                {isSubmitting ? "Processing..." : "Process Salary"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-navy-custom">Recent Salary Disbursements</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Teacher</th>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {salaryPayments.map(sal => (
                    <tr key={sal.id}>
                      <td className="px-4 py-3 text-navy-custom font-medium">{sal.teacher.user.name}</td>
                      <td className="px-4 py-3">{sal.month}</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{sal.amount.toString()}</td>
                      <td className="px-4 py-3 text-xs">{new Date(sal.paidAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
