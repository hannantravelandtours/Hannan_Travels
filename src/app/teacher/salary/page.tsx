export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign, Calendar, TrendingUp, CreditCard } from "lucide-react";

export default async function TeacherSalaryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div>Please log in</div>;
  }

  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      salaryPayments: {
        orderBy: { paidAt: "desc" }
      }
    }
  });

  if (!teacher) {
    return <div className="p-8 text-center text-gray-500">Teacher profile not found.</div>;
  }

  const totalEarned = teacher.salaryPayments.reduce((sum, s) => sum + Number(s.amount), 0);
  const lastPayment = teacher.salaryPayments[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-custom">Salary & Payments</h2>
        <p className="text-sm text-gray-500">View your salary payment history.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Earned</p>
            <h3 className="text-xl font-bold text-emerald-600">{totalEarned.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Last Payment</p>
            <h3 className="text-xl font-bold text-navy-custom">{lastPayment ? Number(lastPayment.amount).toFixed(2) : "N/A"}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Total Payments</p>
            <h3 className="text-xl font-bold text-navy-custom">{teacher.salaryPayments.length}</h3>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-navy-custom flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-emerald-custom" />
            Payment History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teacher.salaryPayments.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    No salary payments recorded yet.
                  </td>
                </tr>
              )}
              {teacher.salaryPayments.map((payment) => {
                const [year, monthNum] = payment.month.split("-");
                const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1);
                const monthLabel = monthDate.toLocaleString("default", { month: "long", year: "numeric" });
                const paidDate = new Date(payment.paidAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

                return (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-navy-custom">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{monthLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {Number(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {paidDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
