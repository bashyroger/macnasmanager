import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Plus, ChevronRight } from "lucide-react";
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
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Added</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, i) => (
                <tr
                  key={client.id}
                  className={`hover:bg-[#faf9f7] transition-colors ${i < clients.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/app/clients/${client.id}`} className="font-medium text-[#1a1714] hover:text-[#be7b3b] transition-colors">
                      {client.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">
                    {client.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-400">
                    {formatDate(client.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/app/clients/${client.id}`}>
                      <ChevronRight className="w-4 h-4 text-gray-300 hover:text-gray-500" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
