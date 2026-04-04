import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-[#faf9f7] overflow-hidden">
      {/* Sidebar */}
      <DashboardNav user={user} />

      {/* Main content — pt-14 offsets the mobile fixed top bar */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
