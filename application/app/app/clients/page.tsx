import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import { ClientList } from "./client-list";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, email, phone, is_archived, created_at")
    .eq("is_archived", false)
    .order("full_name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1714]">Clients</h1>
          <p className="text-sm text-gray-500 mt-0.5">{clients?.length ?? 0} active clients</p>
        </div>
        <Link
          href="/app/clients/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New client
        </Link>
      </div>

      {!clients || clients.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-2">No clients yet</p>
          <p className="text-sm">Create your first client to get started.</p>
        </div>
      ) : (
        <ClientList clients={clients as any[]} />
      )}
    </div>
  );
}
