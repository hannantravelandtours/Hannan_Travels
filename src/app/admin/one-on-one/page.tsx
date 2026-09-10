export const dynamic = "force-dynamic";

import {
  getOneOnOneAdminTimetable,
  getOneOnOnePlans,
  getAllTeacherCustomFees,
} from "@/app/actions/oneOnOne";
import { getAllTeachers } from "@/app/actions/teachers";
import { getActiveCourses } from "@/app/actions/courses";
import { OneOnOneAdminClient } from "./OneOnOneAdminClient";

export default async function AdminOneOnOnePage() {
  const [timetableRes, plansRes, teachersRes, customFeesRes, coursesRes] = await Promise.all([
    getOneOnOneAdminTimetable(),
    getOneOnOnePlans(),
    getAllTeachers(),
    getAllTeacherCustomFees(),
    getActiveCourses(),
  ]);

  const registrations = timetableRes.registrations || [];
  const plans = plansRes.plans || [];
  const teachers = teachersRes || [];
  const customFees = customFeesRes.fees || [];
  const courses = coursesRes || [];

  return (
    <OneOnOneAdminClient
      initialRegistrations={registrations as any}
      initialPlans={plans as any}
      initialTeachers={teachers as any}
      initialCustomFees={customFees as any}
      courses={courses as any}
    />
  );
}
