export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Video, Calendar, Clock, BookOpen } from "lucide-react";

export default async function StudentClassesPage() {
  const session = await getServerSession(authOptions);
  
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session?.user?.id },
    include: {
      registrations: {
        where: { status: "ACTIVE" },
        include: {
          course: true,
          batch: {
            include: {
              teacher: { include: { user: true } },
              linkHistory: { orderBy: { createdAt: 'desc' } }
            }
          }
        }
      }
    }
  });

  const activeClasses = student?.registrations.filter(r => r.batch) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-custom">My Classes</h2>
        <p className="text-sm text-gray-500">Access your live sessions and schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeClasses.length === 0 && (
          <div className="col-span-2 bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600">No active classes yet.</h3>
            <p className="text-sm text-gray-400 mt-2">Your batch assignments will appear here once approved by the admin.</p>
          </div>
        )}
        
        {activeClasses.map((reg) => (
          <div key={reg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[10px] font-bold text-emerald-custom-light uppercase tracking-widest">{reg.course.name}</span>
               <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md">
                 Active
               </span>
            </div>
            
            <h3 className="text-xl font-bold text-navy-custom">{reg.batch?.name}</h3>
            
            {reg.accessEnabled === false ? (
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm font-bold text-amber-700">Access Restricted</p>
                <p className="text-xs text-amber-600 mt-1">Kindly process your fee to continue with this batch.</p>
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-3 flex-grow">
                   <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-emerald-custom" />
                      <span className="font-semibold text-gray-700 w-24">Days:</span> 
                      <span className="text-gray-600">{reg.batch?.daysOfWeek.join(", ")}</span>
                   </div>
                   <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-3 text-emerald-custom" />
                      <span className="font-semibold text-gray-700 w-24">Time:</span> 
                      <span className="text-gray-600">{reg.batch?.time} (UTC)</span>
                   </div>
                   <div className="flex items-center text-sm">
                      <BookOpen className="w-4 h-4 mr-3 text-emerald-custom" />
                      <span className="font-semibold text-gray-700 w-24">Teacher:</span> 
                      <span className="text-gray-600">{reg.batch?.teacher.user.name}</span>
                   </div>
                </div>

                {reg.batch?.linkHistory && reg.batch.linkHistory.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center mb-1">
                      <Clock className="w-3 h-3 mr-1.5" /> Previous Links
                    </span>
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                      {reg.batch.linkHistory.map((historyItem: any) => (
                        <div key={historyItem.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-[10px]">
                           <a href={historyItem.url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 font-semibold truncate max-w-[60%]">
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

                <div className="mt-6 pt-4 border-t border-gray-100">
                   {reg.batch?.liveClassLink ? (
                     <a 
                       href={reg.batch.liveClassLink}
                       target="_blank"
                       rel="noreferrer"
                       className="w-full py-3 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors shadow flex items-center justify-center space-x-2"
                     >
                       <Video className="w-4 h-4" />
                       <span>Join Live Class</span>
                     </a>
                   ) : (
                     <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-bold text-sm rounded-xl flex items-center justify-center space-x-2 cursor-not-allowed">
                       <Video className="w-4 h-4" />
                       <span>No Link Provided Yet</span>
                     </button>
                   )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
