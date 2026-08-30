export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { FeesClient } from "./FeesClient";

export default async function FeesPage() {
  const [activeRegistrations, teachers, feeRecords, salaryPayments] = await Promise.all([
    prisma.registration.findMany({
      where: { 
        status: { in: ["ACTIVE", "PENDING_EMAIL_VERIFICATION"] } 
      },
      include: { student: { include: { user: true } }, course: true }
    }),
    prisma.teacherProfile.findMany({
      include: { user: true }
    }),
    prisma.feeRecord.findMany({
      orderBy: { paidAt: "desc" },
      take: 20,
      include: { registration: { include: { student: { include: { user: true } }, course: true } } }
    }),
    prisma.salaryPayment.findMany({
      orderBy: { paidAt: "desc" },
      take: 20,
      include: { teacher: { include: { user: true } } }
    })
  ]);

  return <FeesClient 
    activeRegistrations={activeRegistrations} 
    teachers={teachers} 
    feeRecords={feeRecords} 
    salaryPayments={salaryPayments} 
  />;
}
