export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTeacherSlotsByUserId, getOneOnOneTeacherTimetable } from "@/app/actions/oneOnOne";
import { TeacherOneOnOneClient } from "./TeacherOneOnOneClient";

export default async function TeacherOneOnOnePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div className="p-8 text-center text-gray-500">Please log in to access this page.</div>;
  }

  const [slotsRes, timetableRes] = await Promise.all([
    getTeacherSlotsByUserId(session.user.id),
    getOneOnOneTeacherTimetable(session.user.id),
  ]);

  const slots = slotsRes.slots || [];
  const teacherProfileId = slotsRes.teacherProfileId || timetableRes.teacherProfileId || "";
  const registrations = timetableRes.registrations || [];

  return (
    <TeacherOneOnOneClient
      userId={session.user.id}
      teacherProfileId={teacherProfileId}
      initialSlots={slots as any}
      initialRegistrations={registrations as any}
    />
  );
}
