export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getOneOnOneStudentSchedule } from "@/app/actions/oneOnOne";
import { StudentOneOnOneClient } from "./StudentOneOnOneClient";

export default async function StudentOneOnOnePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div className="p-8 text-center text-gray-500">Please log in to view your 1-on-1 classes.</div>;
  }

  const res = await getOneOnOneStudentSchedule(session.user.id);
  const registrations = res.registrations || [];

  return <StudentOneOnOneClient registrations={registrations as any} />;
}
