import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getUsers } from "./actions";
import { TeamManagement } from "./team-management";

export const metadata = {
  title: "Team | Studio Macnas",
  description: "Manage team member roles and send invitations.",
};

export default async function TeamSettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { users, error } = await getUsers();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1714]">
          Team <span className="text-gray-300 font-normal ml-2">/ Access</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage who has access to the Studio Macnas dashboard and what they can do.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm font-medium">
          {error}
        </div>
      ) : (
        <TeamManagement currentUserId={user.id} initialUsers={users ?? []} />
      )}
    </div>
  );
}
