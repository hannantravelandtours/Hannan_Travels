"use client";
// sample Comment
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Settings,
  Shield,
  Video,
  Globe
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  role: "student" | "teacher" | "admin";
  sidebarItems: SidebarItem[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  role,
  sidebarItems
}) => {
  const { direction, setLanguage, language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isRTL = direction === "rtl";

  const handleLogout = () => {
    router.push("/");
  };

  const notifications = [
    { id: 1, text: "Class starting in 15 minutes", time: "Now" },
    { id: 2, text: "Teacher marked Homework 4", time: "2 hours ago" },
    { id: 3, text: "Tuition invoice generated", time: "1 day ago" }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex" dir={direction}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 bg-navy-custom text-gray-300 border-r border-emerald-950 shrink-0 ${isRTL ? "border-l border-r-0" : ""}`}>
        {/* Brand header */}
        <div className="p-6 border-b border-emerald-950 flex items-center space-x-2 rtl:space-x-reverse">
          <BookOpen className="h-6 w-6 text-gold-custom-light shrink-0" />
          <div>
            <span className="block text-sm font-bold text-white tracking-tight">Hannan Consultants</span>
            <span className="block text-[10px] font-bold text-emerald-custom-light uppercase tracking-wider">
              {role} portal
            </span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive
                  ? "bg-emerald-custom text-white shadow-md"
                  : "hover:bg-navy-light text-gray-400 hover:text-white"
                  }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer profile */}
        <div className="p-4 border-t border-emerald-950 bg-navy-custom/95 text-xs">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-custom text-white flex items-center justify-center font-bold">
              {role === "admin" ? "A" : role === "teacher" ? "T" : "S"}
            </div>
            <div>
              <span className="block font-bold text-white capitalize">{role} User</span>
              <span className="block text-[10px] text-gray-500">ID: HC-98231</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-navy-custom text-gray-300 h-full p-4 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-4">
              <span className="font-bold text-white">Academy Portal</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-lg text-xs font-bold text-gray-400 hover:bg-navy-light hover:text-white"
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 rtl:space-x-reverse text-gray-400 hover:text-red-400 font-bold p-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-150 h-16 flex items-center justify-between px-6 shrink-0 relative z-30">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm sm:text-base font-black text-navy-custom">{title}</h1>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Quick Virtual classroom link */}
            <Link
              href="/classroom"
              className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-emerald-custom text-white text-xs font-bold hover:bg-emerald-900 shadow-sm transition-colors"
            >
              <Video className="h-4 w-4 animate-pulse text-gold-custom-light" />
              <span className="hidden sm:inline">Enter Classroom</span>
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                onBlur={() => setTimeout(() => setNotificationOpen(false), 200)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-custom animate-ping"></span>
              </button>

              {notificationOpen && (
                <div className={`absolute ${isRTL ? "left-0" : "right-0"} mt-2 w-64 rounded-xl bg-white shadow-xl border border-gray-100 p-2 z-50`}>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase pb-2 border-b border-gray-100 px-2">Recent Notifications</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 hover:bg-gray-50 rounded-lg text-left rtl:text-right">
                        <span className="block text-[11px] font-semibold text-navy-custom">{n.text}</span>
                        <span className="block text-[9px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                className="flex items-center space-x-1 rtl:space-x-reverse p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-custom text-white flex items-center justify-center font-bold text-xs">
                  {role.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="h-4.5 w-4.5 text-gray-500" />
              </button>

              {profileOpen && (
                <div className={`absolute ${isRTL ? "left-0" : "right-0"} mt-2 w-48 rounded-xl bg-white shadow-xl border border-gray-100 p-1 z-50`}>
                  <Link
                    href={`/${role}/settings`}
                    className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-xs rounded-lg hover:bg-gray-50 text-navy-custom"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-xs rounded-lg hover:bg-gray-50 text-red-500 text-left rtl:text-right cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
