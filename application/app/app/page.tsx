import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  Package,
  Clock,
  BarChart2,
  Settings,
  Globe,
  ArrowRight,
} from "lucide-react";

export default async function AppDashboard() {
  const supabase = await createClient();

  // Fetch quick stats in parallel
  const [
    { count: openProjects },
    { count: unassignedTime },
    { count: totalClients },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .in("status", ["inquiry", "consultation", "design", "production"])
      .eq("is_archived", false),
    supabase
      .from("time_entries")
      .select("*", { count: "exact", head: true })
      .eq("needs_manual_assignment", true),
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("is_archived", false),
  ]);

  const stats = [
    { label: "Open Projects", value: openProjects ?? 0, href: "/app/projects", color: "bg-amber-50 text-amber-700" },
    { label: "Unassigned Time", value: unassignedTime ?? 0, href: "/app/time-entries/unassigned", color: unassignedTime ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700" },
    { label: "Active Clients", value: totalClients ?? 0, href: "/app/clients", color: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1714]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Studio Macnas — overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-[#e5e0d8] p-5 hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-[#1a1714]">{stat.value}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mb-1 ${stat.color}`}>
                {stat.label === "Unassigned Time" && stat.value > 0 ? "needs review" : "active"}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: "/app/projects/new", label: "New Project", icon: FolderKanban, desc: "Start a new client project" },
          { href: "/app/clients", label: "Clients", icon: Users, desc: "Manage client profiles" },
          { href: "/app/materials", label: "Materials", icon: Package, desc: "Browse and edit materials" },
          { href: "/app/time-entries", label: "Time Entries", icon: Clock, desc: "Log and review time" },
          { href: "/app/reports", label: "Reports", icon: BarChart2, desc: "Weekly and financial summaries" },
          { href: "/app/settings/sustainability", label: "Sustainability", icon: Settings, desc: "Configure axes and thresholds" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-xl border border-[#e5e0d8] p-5 hover:shadow-sm transition-shadow group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-[#faf9f7] border border-[#e5e0d8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#be7b3b] group-hover:border-[#be7b3b] transition-colors">
              <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#1a1714]">{item.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
