"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1a1714] text-white rounded-xl text-sm font-medium hover:bg-[#2c2825] transition-colors disabled:opacity-70"
    >
      {loading ? "Signing out..." : "Sign out & try another account"}
    </button>
  );
}
