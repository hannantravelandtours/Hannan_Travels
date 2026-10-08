export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTeacherOneOnOneStudents } from "@/app/actions/oneOnOneAttendance";
import { OneOnOneAttendanceClient } from "./OneOnOneAttendanceClient";

export default async function TeacherOneOnOneAttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div>Please log in</div>;
  }

  // Get all active 1-on-1 students for this teacher
  const students = await getTeacherOneOnOneStudents(session.user.id);

  return <OneOnOneAttendanceClient students={students} teacherUserId={session.user.id} />;
}

