"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Bags", href: "/bags" },
  { name: "Materials", href: "/materials" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Contact", href: "/contact" },
];

export function PublicNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#171717] border-b border-[#ef5cff]/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#fafA00] flex items-center justify-center font-black text-black text-2xl group-hover:scale-110 transition-transform">
                M
              </div>
              <div className="hidden sm:block">
                <span className="text-[#ef5cff] font-medium text-sm tracking-tight">
                  Rethinking fashion patterns
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#fafA00]",
                  pathname === link.href ? "text-[#fafA00]" : "text-[#a9a9a9]"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/app" 
              className="px-4 py-2 rounded-lg bg-[#fafA00] text-black text-xs font-bold hover:bg-white transition-all ml-4"
            >
              Manager Login
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#000000] border-b border-[#ef5cff]/30 px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block text-lg font-medium py-2",
                pathname === link.href ? "text-[#fafA00]" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10">
            <Link 
              href="/app"
              className="block text-center px-4 py-3 rounded-xl bg-[#fafA00] text-black font-bold"
            >
              Macnas Manager
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
