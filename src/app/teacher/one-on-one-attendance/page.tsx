export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTeacherOneOnOneStudents, getTeacherAllOneOnOneAttendance } from "@/app/actions/oneOnOneAttendance";
import { OneOnOneAttendanceClient } from "./OneOnOneAttendanceClient";

export default async function TeacherOneOnOneAttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div>Please log in</div>;
  }

  // Get all active 1-on-1 students and all previous attendance history
  const [students, initialRecords] = await Promise.all([
    getTeacherOneOnOneStudents(session.user.id),
    getTeacherAllOneOnOneAttendance(session.user.id),
  ]);

  // Plain JSON serialization to avoid Date object issues across Server/Client boundary
  const serializedRecords = JSON.parse(JSON.stringify(initialRecords));
  const serializedStudents = JSON.parse(JSON.stringify(students));

  return (
    <OneOnOneAttendanceClient
      students={serializedStudents}
      initialRecords={serializedRecords}
      teacherUserId={session.user.id}
    />
  );
}

