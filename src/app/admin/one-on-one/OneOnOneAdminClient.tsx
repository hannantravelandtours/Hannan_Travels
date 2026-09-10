"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Search,
  Filter,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  User,
  RefreshCw,
  Plus,
  Trash2,
  DollarSign,
  Layers,
} from "lucide-react";
import {
  confirmOneOnOneRegistration,
  getOneOnOneAdminTimetable,
  createOneOnOnePlan,
  deleteOneOnOnePlan,
  setTeacherPlanFee,
} from "@/app/actions/oneOnOne";

interface SlotItem {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacher?: {
    user: {
      name: string;
    };
  };
}

interface RegistrationItem {
  id: string;
  status: string;
  isOneOnOne: boolean;
  registeredAt: Date;
  preferredTeacherName: string;
  student: {
    user: {
      name: string;
      email: string;
      phone: string | null;
    };
  };
  course: {
    name: string;
    category: string;
  };
  oneOnOnePlan?: {
    id: string;
    title: string;
    classesPerWeek: number;
    defaultPrice: number;
    currency: string;
  } | null;
  teacherSlot?: SlotItem | null;
  allSlots?: SlotItem[];
}

interface PlanItem {
  id: string;
  title: string;
  classesPerWeek: number;
  defaultPrice: number;
  currency: string;
  courseId?: string | null;
  course?: { name: string } | null;
}

interface TeacherItem {
  id: string;
  name: string;
  qualification?: string | null;
  bio?: string | null;
}

interface TeacherFeeItem {
  id: string;
  teacherId: string;
  planId: string;
  monthlyFee: number;
  currency: string;
  teacher: {
    user: { name: string };
  };
  plan: {
    title: string;
    classesPerWeek: number;
  };
}

export function OneOnOneAdminClient({
  initialRegistrations,
  initialPlans,
  initialTeachers,
  initialCustomFees,
  courses,
}: {
  initialRegistrations: RegistrationItem[];
  initialPlans: PlanItem[];
  initialTeachers: TeacherItem[];
  initialCustomFees: TeacherFeeItem[];
  courses: any[];
}) {
  const [activeTab, setActiveTab] = useState<"timetable" | "packages" | "pricing">("timetable");

  const [registrations, setRegistrations] = useState<RegistrationItem[]>(initialRegistrations);
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
  const [teachers] = useState<TeacherItem[]>(initialTeachers);
  const [customFees, setCustomFees] = useState<TeacherFeeItem[]>(initialCustomFees);

  const [search, setSearch] = useState("");
  const [filterDay, setFilterDay] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // New Plan form state
  const [planTitle, setPlanTitle] = useState("");
  const [planClassesPerWeek, setPlanClassesPerWeek] = useState(3);
  const [planPrice, setPlanPrice] = useState(50);
  const [planCourseId, setPlanCourseId] = useState("");
  const [planSubmitting, setPlanSubmitting] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  // Teacher Fee Rate form state
  const [rateTeacherId, setRateTeacherId] = useState("");
  const [ratePlanId, setRatePlanId] = useState("");
  const [rateFee, setRateFee] = useState(40);
  const [rateSubmitting, setRateSubmitting] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    const res = await getOneOnOneAdminTimetable();
    if (res.success && res.registrations) {
      setRegistrations(res.registrations as any);
    }
    setRefreshing(false);
  };

  const handleConfirm = async (id: string) => {
    if (!confirm("Are you sure you want to confirm this 1-on-1 registration?")) return;
    setLoadingId(id);
    const res = await confirmOneOnOneRegistration(id);
    if (res.success) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "ACTIVE" } : r))
      );
    } else {
      alert(res.error || "Failed to confirm registration");
    }
    setLoadingId(null);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanSubmitting(true);
    setPlanError(null);

    const formData = new FormData();
    formData.set("title", planTitle);
    formData.set("classesPerWeek", planClassesPerWeek.toString());
    formData.set("defaultPrice", planPrice.toString());
    formData.set("courseId", planCourseId);
    formData.set("currency", "USD");

    const res = await createOneOnOnePlan(formData);
    if (res?.error) {
      setPlanError(res.error);
    } else if (res?.success) {
      const newPlan: PlanItem = {
        id: Math.random().toString(),
        title: planTitle,
        classesPerWeek: planClassesPerWeek,
        defaultPrice: planPrice,
        currency: "USD",
        courseId: planCourseId || null,
        course: courses.find((c) => c.id === planCourseId) || null,
      };
      setPlans((prev) => [...prev, newPlan]);
      setPlanTitle("");
    }
    setPlanSubmitting(false);
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Delete this 1-on-1 package plan?")) return;
    const res = await deleteOneOnOnePlan(planId);
    if (res.success) {
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } else {
      alert(res.error || "Failed to delete plan");
    }
  };

  const handleSetRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateSubmitting(true);
    setRateError(null);

    const formData = new FormData();
    formData.set("teacherId", rateTeacherId);
    formData.set("planId", ratePlanId);
    formData.set("monthlyFee", rateFee.toString());
    formData.set("currency", "USD");

    const res = await setTeacherPlanFee(formData);
    if (res?.error) {
      setRateError(res.error);
    } else if (res?.success) {
      const targetTeacher = teachers.find((t) => t.id === rateTeacherId);
      const targetPlan = plans.find((p) => p.id === ratePlanId);

      const updatedFee: TeacherFeeItem = {
        id: Math.random().toString(),
        teacherId: rateTeacherId,
        planId: ratePlanId,
        monthlyFee: rateFee,
        currency: "USD",
        teacher: { user: { name: targetTeacher?.name || "Teacher" } },
        plan: {
          title: targetPlan?.title || "Plan",
          classesPerWeek: targetPlan?.classesPerWeek || 3,
        },
      };

      setCustomFees((prev) => {
        const filtered = prev.filter(
          (f) => !(f.teacherId === rateTeacherId && f.planId === ratePlanId)
        );
        return [...filtered, updatedFee];
      });
    }
    setRateSubmitting(false);
  };

  // Filter registrations
  const filtered = registrations.filter((r) => {
    const studentName = r.student?.user?.name?.toLowerCase() || "";
    const studentEmail = r.student?.user?.email?.toLowerCase() || "";
    const teacherName = (
      r.allSlots?.[0]?.teacher?.user?.name ||
      r.teacherSlot?.teacher?.user?.name ||
      r.preferredTeacherName ||
      ""
    ).toLowerCase();
    const courseName = r.course?.name?.toLowerCase() || "";
    const query = search.toLowerCase();

    const matchesQuery =
      studentName.includes(query) ||
      studentEmail.includes(query) ||
      teacherName.includes(query) ||
      courseName.includes(query);

    const matchesDay =
      filterDay === "ALL" ||
      r.allSlots?.some((s) => s.dayOfWeek === filterDay) ||
      r.teacherSlot?.dayOfWeek === filterDay;

    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "PENDING" && r.status !== "ACTIVE") ||
      (filterStatus === "ACTIVE" && r.status === "ACTIVE");

    return matchesQuery && matchesDay && matchesStatus;
  });

  const pendingCount = registrations.filter((r) => r.status !== "ACTIVE").length;
  const activeCount = registrations.filter((r) => r.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-custom/10 text-emerald-custom flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-custom">1-on-1 Classes & Pricing Management</h1>
            <p className="text-xs text-gray-500">
              Manage student timetable, 1-on-1 class frequency packages, and teacher custom fee rates.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 space-x-4">
        <button
          onClick={() => setActiveTab("timetable")}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
            activeTab === "timetable"
              ? "border-emerald-custom text-emerald-custom"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>1-on-1 Student Timetable ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("packages")}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
            activeTab === "packages"
              ? "border-emerald-custom text-emerald-custom"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Class Packages / Categories ({plans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("pricing")}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
            activeTab === "pricing"
              ? "border-emerald-custom text-emerald-custom"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Teacher Fee Rates ({customFees.length})</span>
        </button>
      </div>

      {/* TAB 1: TIMETABLE & CONFIRMATIONS */}
      {activeTab === "timetable" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-1">
                <span>Total 1-on-1 Students</span>
                <User className="w-4 h-4 text-emerald-custom" />
              </div>
              <span className="text-2xl font-black text-navy-custom">{registrations.length}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold text-amber-700 mb-1">
                <span>Pending Confirmations</span>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-2xl font-black text-amber-900">{pendingCount}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-700 mb-1">
                <span>Active / Confirmed Classes</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-emerald-900">{activeCount}</span>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search student, teacher, or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-emerald-custom"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Days</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Confirmation</option>
                <option value="ACTIVE">Confirmed / Active</option>
              </select>
            </div>
          </div>

          {/* Timetable Table */}
          <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 border-b border-gray-150">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Course & Package</th>
                    <th className="py-3.5 px-4">Teacher</th>
                    <th className="py-3.5 px-4">30-Min Slots (Selected)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => {
                    const isConfirmed = item.status === "ACTIVE";
                    const teacherName =
                      item.allSlots?.[0]?.teacher?.user?.name ||
                      item.teacherSlot?.teacher?.user?.name ||
                      item.preferredTeacherName ||
                      "Unassigned";

                    const slotsList = item.allSlots && item.allSlots.length > 0
                      ? item.allSlots
                      : item.teacherSlot ? [item.teacherSlot] : [];

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-navy-custom">{item.student?.user?.name}</div>
                          <div className="text-[11px] text-gray-400">{item.student?.user?.email}</div>
                          {item.student?.user?.phone && (
                            <div className="text-[10px] text-gray-400">{item.student.user.phone}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-medium text-gray-700">
                          <div className="flex items-center space-x-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-custom" />
                            <span>{item.course?.name}</span>
                          </div>
                          {item.oneOnOnePlan ? (
                            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {item.oneOnOnePlan.title} (${item.oneOnOnePlan.defaultPrice}/mo)
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 uppercase">1-on-1 Standard</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-gray-800">
                          {teacherName}
                        </td>

                        <td className="py-3.5 px-4">
                          {slotsList.length > 0 ? (
                            <div className="space-y-1">
                              {slotsList.map((s) => (
                                <div key={s.id} className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold mr-1">
                                  <Clock className="w-3 h-3 text-emerald-600" />
                                  <span>{s.dayOfWeek}: {s.startTime} - {s.endTime}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>No Slot Selected</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {isConfirmed ? (
                            <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Confirmed / Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              <AlertCircle className="w-3 h-3" />
                              <span>Pending Confirmation</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {!isConfirmed && (
                            <button
                              onClick={() => handleConfirm(item.id)}
                              disabled={loadingId === item.id}
                              className="bg-emerald-custom hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg transition-all text-xs cursor-pointer shadow-sm"
                            >
                              {loadingId === item.id ? "Confirming..." : "Confirm Registration"}
                            </button>
                          )}
                          {isConfirmed && (
                            <span className="text-[11px] text-gray-400 font-semibold">Active</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        No 1-on-1 registrations found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLASS PACKAGES / CATEGORIES */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
              <Layers className="w-5 h-5 text-emerald-custom" />
              <h2 className="text-base font-bold text-navy-custom">Add New 1-on-1 Frequency Package</h2>
            </div>

            {planError && (
              <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{planError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-150">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Package Title</label>
                <input
                  type="text"
                  placeholder="e.g. 3 Classes / Week"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-navy-custom font-semibold outline-none focus:border-emerald-custom"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Classes / Week</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={planClassesPerWeek}
                  onChange={(e) => setPlanClassesPerWeek(parseInt(e.target.value))}
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-navy-custom font-semibold outline-none focus:border-emerald-custom"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Default Monthly Fee ($)</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={planPrice}
                  onChange={(e) => setPlanPrice(parseFloat(e.target.value))}
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-navy-custom font-semibold outline-none focus:border-emerald-custom"
                />
              </div>

              <button
                type="submit"
                disabled={planSubmitting}
                className="w-full bg-emerald-custom hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{planSubmitting ? "Adding..." : "Add Package"}</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between space-y-4 relative">
                <div>
                  <span className="text-[10px] font-bold text-emerald-custom uppercase tracking-wider block">
                    {p.classesPerWeek} Classes Per Week
                  </span>
                  <h3 className="text-lg font-bold text-navy-custom mt-1">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Default Monthly Fee:</p>
                  <span className="text-2xl font-black text-emerald-custom">${p.defaultPrice} <span className="text-xs font-semibold text-gray-400">/ mo</span></span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => handleDeletePlan(p.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEACHER FEE RATES */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
              <DollarSign className="w-5 h-5 text-emerald-custom" />
              <h2 className="text-base font-bold text-navy-custom">Set Teacher-Specific Custom Monthly Fee Rate</h2>
            </div>

            {rateError && (
              <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{rateError}</span>
              </div>
            )}

            <form onSubmit={handleSetRate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-150">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Select Teacher</label>
                <select
                  value={rateTeacherId}
                  onChange={(e) => setRateTeacherId(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-navy-custom font-semibold outline-none focus:border-emerald-custom"
                >
                  <option value="">Choose Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Select Package Plan</label>
                <select
                  value={ratePlanId}
                  onChange={(e) => setRatePlanId(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-navy-custom font-semibold outline-none focus:border-emerald-custom"
                >
                  <option value="">Choose Package Plan</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Default ${p.defaultPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Custom Teacher Fee ($)</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={rateFee}
                  onChange={(e) => setRateFee(parseFloat(e.target.value))}
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-navy-custom font-semibold outline-none focus:border-emerald-custom"
                />
              </div>

              <button
                type="submit"
                disabled={rateSubmitting}
                className="w-full bg-emerald-custom hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{rateSubmitting ? "Saving..." : "Set Custom Fee"}</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 border-b border-gray-150">
                  <tr>
                    <th className="py-3 px-4">Teacher Name</th>
                    <th className="py-3 px-4">Package Plan</th>
                    <th className="py-3 px-4">Custom Monthly Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customFees.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50/80">
                      <td className="py-3 px-4 font-bold text-navy-custom">{f.teacher?.user?.name}</td>
                      <td className="py-3 px-4 font-semibold text-gray-700">{f.plan?.title}</td>
                      <td className="py-3 px-4 font-black text-emerald-custom">${f.monthlyFee} / month</td>
                    </tr>
                  ))}

                  {customFees.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-400">
                        No custom teacher rates assigned yet. The default package prices apply to all teachers!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
