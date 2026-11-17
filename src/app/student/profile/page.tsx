export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Shield } from "@/components/Icons";

export default async function StudentProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-navy-custom">My Profile</h2>
        <p className="text-sm text-gray-500 mt-2">Manage your account information and preferences.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-4xl mb-6 shadow-inner">
          {session.user.name?.charAt(0) || "U"}
        </div>
        <h3 className="text-2xl font-bold text-navy-custom">{session.user.name}</h3>
        <p className="text-emerald-custom font-semibold uppercase text-xs tracking-widest mt-1">Student</p>
        
        <div className="w-full mt-8 space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Mail className="w-5 h-5 text-gray-400 mr-4" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Email Address</p>
              <p className="font-semibold text-gray-700">{session.user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Shield className="w-5 h-5 text-gray-400 mr-4" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Account Role</p>
              <p className="font-semibold text-gray-700">Student Access</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 w-full text-center">
           <p className="text-sm text-gray-400 italic">Profile editing will be available soon.</p>
        </div>
      </div>
    </div>
  );
}
