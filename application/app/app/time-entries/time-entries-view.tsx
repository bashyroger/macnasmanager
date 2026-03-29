"use client";

import { useState, useEffect } from "react";
import { LayoutList, Calendar as CalendarIcon, Clock } from "lucide-react";
import { TimeEntryList } from "./time-entry-list";
import { TimeEntryCalendar } from "./time-entry-calendar";

export function TimeEntriesView({ entries }: { entries: any[] }) {
  const [viewMode, setViewModeState] = useState<"list" | "calendar">("list");

  useEffect(() => {
    const saved = localStorage.getItem("macnas_time_entries_view");
    if (saved === "calendar") {
      setViewModeState("calendar");
    }
  }, []);

  const setViewMode = (mode: "list" | "calendar") => {
    setViewModeState(mode);
    localStorage.setItem("macnas_time_entries_view", mode);
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-lg font-medium mb-2">No time entries yet</p>
        <p className="text-sm">Log time manually or sync via Google Calendar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest ml-1">View</h2>
        <div className="flex bg-white border border-[#e5e0d8] rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === "list" 
                ? "bg-[#faf9f7] text-[#1a1714] shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-black/5" 
                : "text-gray-500 hover:text-[#1a1714] hover:bg-gray-50/50"
            }`}
          >
            <LayoutList className="w-4 h-4" />
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === "calendar" 
                ? "bg-[#faf9f7] text-[#1a1714] shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-black/5" 
                : "text-gray-500 hover:text-[#1a1714] hover:bg-gray-50/50"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Calendar
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {viewMode === "list" ? (
        <TimeEntryList entries={entries} />
      ) : (
        <TimeEntryCalendar entries={entries} />
      )}
    </div>
  );
}
