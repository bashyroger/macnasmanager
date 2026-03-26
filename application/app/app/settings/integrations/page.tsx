import { createClient } from "@/lib/supabase/server";
import { connectGoogleCalendar, disconnectGoogleCalendar } from "./actions";
import { CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Integrations Settings" };

export default async function IntegrationsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  const p = await searchParams;

  let isConnected = false;
  if (userId) {
    const { data: tokens } = await supabase
      .from("google_tokens")
      .select("id")
      .eq("user_id", userId)
      .single();
    
    isConnected = !!tokens;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a1714]">Integrations</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage connections to external services.</p>
      </div>

      {p.error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm font-medium">Failed to connect: {p.error.replace(/_/g, " ")}</p>
        </div>
      )}

      {p.success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-sm font-medium">Google Calendar successfully connected!</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1a1714] flex items-center gap-2">
                  Google Calendar
                  {isConnected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  Sync time entries directly to a dedicated Studio Macnas calendar. 
                  Dashboard entries are exported immediately, and new calendar events 
                  are imported every 15 minutes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isConnected ? (
                <form action={disconnectGoogleCalendar}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </form>
              ) : (
                <form action={connectGoogleCalendar}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Connect Calendar
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sync Logs Section */}
      <h2 className="text-lg font-semibold text-[#1a1714] mb-4">Recent Sync Runs</h2>
      <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
        <SyncLogsTable />
      </div>
    </div>
  );
}

async function SyncLogsTable() {
  const supabase = await createClient();
  const { data: runs, error } = await supabase
    .from("sync_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error || !runs || runs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        No sync runs recorded yet. The background job runs every 15 minutes.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-[#faf9f7] border-b border-[#e5e0d8]">
        <tr>
          <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
          <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
          <th className="px-4 py-3 text-left font-medium text-gray-600">Time</th>
          <th className="px-4 py-3 text-right font-medium text-gray-600">Records</th>
        </tr>
      </thead>
      <tbody>
        {runs.map((r, i) => (
          <tr key={r.id} className={i < runs.length - 1 ? "border-b border-[#e5e0d8]" : ""}>
            <td className="px-4 py-3 capitalize">{r.sync_type.replace(/_/g, " ")}</td>
            <td className="px-4 py-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                r.status === "success" ? "bg-green-50 text-green-700" :
                r.status === "running" ? "bg-blue-50 text-blue-700" :
                "bg-red-50 text-red-700"
              }`}>
                {r.status}
              </span>
              {(r.summary_json as any)?.error_details && <p className="text-xs text-red-500 mt-1 max-w-xs truncate" title={(r.summary_json as any).error_details}>{(r.summary_json as any).error_details}</p>}
            </td>
            <td className="px-4 py-3 text-gray-500">
              {new Date(r.started_at).toLocaleString("en-GB", { 
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
              })}
            </td>
            <td className="px-4 py-3 text-right font-medium tabular-nums">
              {(r.summary_json as any)?.records_processed ?? 0}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
