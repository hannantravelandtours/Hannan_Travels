"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LayoutDashboard, Users, BookOpen, Clock, Settings, GraduationCap, DollarSign, Calendar, Video, ClipboardList } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const sidebarItems = [
    { name: "Dashboard", path: "/student", icon: LayoutDashboard },
    { name: "My Classes", path: "/student/classes", icon: Video },
    { name: "Attendance", path: "/student/attendance", icon: ClipboardList },
    { name: "Fee Status", path: "/student/fees", icon: DollarSign },
    { name: "Profile", path: "/student/profile", icon: Settings },
  ];

  return (
    <DashboardLayout title="Student Portal" role="student" sidebarItems={sidebarItems}>
      {children}
    </DashboardLayout>
  );
}
