"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LayoutDashboard, Users, BookOpen, Clock, Settings, GraduationCap, DollarSign, Calendar, Video, Link as LinkIcon, ClipboardList } from "lucide-react";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const sidebarItems = [
    { name: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { name: "My Classes", path: "/teacher/classes", icon: Clock },
    { name: "Attendance", path: "/teacher/attendance", icon: ClipboardList },
    { name: "Send Link", path: "/teacher/send-link", icon: LinkIcon },
    { name: "Salary", path: "/teacher/salary", icon: DollarSign },
    { name: "Profile", path: "/teacher/profile", icon: Settings },
  ];

  return (
    <DashboardLayout title="Teacher Portal" role="teacher" sidebarItems={sidebarItems}>
      {children}
    </DashboardLayout>
  );
}
