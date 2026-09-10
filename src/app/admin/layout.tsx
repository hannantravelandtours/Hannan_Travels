"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LayoutDashboard, Users, BookOpen, Clock, Settings, GraduationCap, DollarSign, Bell, UserCheck } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const sidebarItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Teachers", path: "/admin/teachers", icon: GraduationCap },
    { name: "Courses", path: "/admin/courses", icon: BookOpen },
    { name: "Batches", path: "/admin/batches", icon: Clock },
    { name: "1-on-1 Classes", path: "/admin/one-on-one", icon: UserCheck },
    { name: "Students", path: "/admin/students", icon: Users },
    { name: "Fees & Finances", path: "/admin/fees", icon: DollarSign },
    { name: "Announcements", path: "/admin/announcements", icon: Bell },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <DashboardLayout title="Admin Portal" role="admin" sidebarItems={sidebarItems}>
      {children}
    </DashboardLayout>
  );
}
