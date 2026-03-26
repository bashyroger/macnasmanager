import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginButton } from "./login-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Studio Macnas dashboard",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/app");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f7] px-4">
      <div className="w-full max-w-sm">
        {/* Logo / brand mark */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#be7b3b] mb-4">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1a1714]">Studio Macnas</h1>
          <p className="text-sm text-gray-500 mt-1">Internal dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm p-8">
          <h2 className="text-lg font-medium text-[#1a1714] mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign in with your Google account to access the dashboard.
          </p>
          <LoginButton />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Only pre-approved accounts can access this dashboard.
        </p>
      </div>
    </main>
  );
}
