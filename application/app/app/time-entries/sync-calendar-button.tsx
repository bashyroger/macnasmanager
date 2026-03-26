"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { triggerManualCalendarSync } from "./actions";
import { useRouter } from "next/navigation";

export function SyncCalendarButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await triggerManualCalendarSync();
      router.refresh();
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Failed to sync calendar. Check integrations settings.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5e0d8] text-[#1a1714] text-sm font-medium hover:bg-[#faf9f7] transition-colors disabled:opacity-50"
      title="Sync events from the last 24 hours"
    >
      <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
      {isSyncing ? "Syncing..." : "Sync Calendar"}
    </button>
  );
}
