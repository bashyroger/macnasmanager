"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Package,
  Clock,
  BarChart2,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    label: "Clients",
    href: "/app/clients",
    icon: Users,
  },
  {
    label: "Projects",
    href: "/app/projects",
    icon: FolderKanban,
  },
  {
    label: "Materials",
    href: "/app/materials",
    icon: Package,
  },
  {
    label: "Time Entries",
    href: "/app/time-entries",
    icon: Clock,
  },
  {
    label: "Reports",
    href: "/app/reports",
    icon: BarChart2,
  },
];

const settingsItems = [
  { label: "Sustainability", href: "/app/settings/sustainability" },
  { label: "Product Tiers", href: "/app/settings/product-tiers" },
  { label: "Website", href: "/app/settings/website" },
  { label: "Integrations", href: "/app/settings/integrations" },
  { label: "Team", href: "/app/settings/team" },
];

function NavContent({
  user,
  onClose,
}: {
  user: User;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[#e5e0d8]">
        <Link
          href="/app"
          className="flex items-center gap-3"
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded-lg bg-[#be7b3b] flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="text-sm font-semibold text-[#1a1714]">
            Studio Macnas
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-[#be7b3b] text-white"
                      : "text-gray-600 hover:bg-[#faf9f7] hover:text-[#1a1714]"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Settings group */}
        <div className="mt-6">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Settings
          </p>
          <ul className="space-y-0.5">
            {settingsItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-[#faf9f7] text-[#1a1714] font-medium"
                        : "text-gray-500 hover:bg-[#faf9f7] hover:text-[#1a1714]"
                    )}
                  >
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Public site link */}
        <div className="mt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-[#faf9f7] transition-colors"
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            Public site
          </Link>
        </div>
      </nav>

      {/* User + sign out */}
      <div className="px-3 py-4 border-t border-[#e5e0d8]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-[#be7b3b] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user.email?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#1a1714] truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export function DashboardNav({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar (md+) ── */}
      <aside className="hidden md:flex flex-col w-60 h-screen bg-white border-r border-[#e5e0d8] flex-shrink-0">
        <NavContent user={user} />
      </aside>

      {/* ── Mobile top bar (< md) ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-white border-b border-[#e5e0d8]">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#be7b3b] flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="text-sm font-semibold text-[#1a1714]">
            Studio Macnas
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md text-gray-500 hover:text-[#1a1714] hover:bg-[#faf9f7] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer panel */}
          <aside className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-md text-gray-400 hover:text-[#1a1714] hover:bg-[#faf9f7] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <NavContent user={user} onClose={() => setIsOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
