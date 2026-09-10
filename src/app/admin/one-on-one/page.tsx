export const dynamic = "force-dynamic";

import { getOneOnOneAdminTimetable } from "@/app/actions/oneOnOne";
import { OneOnOneAdminClient } from "./OneOnOneAdminClient";

export default async function AdminOneOnOnePage() {
  const result = await getOneOnOneAdminTimetable();
  const registrations = result.registrations || [];

  return <OneOnOneAdminClient initialRegistrations={registrations} />;
}
