"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/navigation";
import "./calendar-overrides.css";

const locales = {
  "en-GB": enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function TimeEntryCalendar({ entries }: { entries: any[] }) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("week");

  // Load saved state on mount
  useEffect(() => {
    const savedDate = localStorage.getItem("macnas_calendar_date");
    if (savedDate) {
      const d = new Date(savedDate);
      if (!isNaN(d.getTime())) setCurrentDate(d);
    }
    
    const savedView = localStorage.getItem("macnas_calendar_view");
    if (savedView) {
      setCurrentView(savedView as View);
    }
  }, []);

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
    localStorage.setItem("macnas_calendar_date", newDate.toISOString());
  };

  const handleViewChange = (newView: View) => {
    setCurrentView(newView);
    localStorage.setItem("macnas_calendar_view", newView);
  };

  const events = entries.map((entry) => {
    // Optional: decorate the title if it has a project assigned
    const projectTitle = entry.projects ? entry.projects.title : "";
    const displayTitle = projectTitle ? `[${projectTitle}] ${entry.title}` : entry.title;
    
    return {
      id: entry.id,
      title: displayTitle,
      start: new Date(entry.start_time),
      end: new Date(entry.end_time),
      resource: entry,
    };
  });

  const handleSelectEvent = (event: any) => {
    router.push(`/app/time-entries/${event.id}/edit`);
  };

  const eventPropGetter = (event: any) => {
    const isUnassigned = event.resource.needs_manual_assignment;
    
    const style = {
      backgroundColor: isUnassigned ? "#fffbeb" : "#be7b3b", 
      borderColor: isUnassigned ? "#fde68a" : "transparent",
      color: isUnassigned ? "#b45309" : "#ffffff",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "6px",
      fontSize: "0.75rem",
      fontWeight: isUnassigned ? "500" : "400",
      padding: "2px 6px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
    };

    return { style };
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm text-sm h-[700px] flex flex-col hide-scrollbar">
      <div className="p-4 flex-1 overflow-hidden">
        <Calendar
          localizer={localizer}
          culture="en-GB"
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          date={currentDate}
          onNavigate={handleNavigate}
          view={currentView}
          onView={handleViewChange}
          views={["month", "week", "day"]}
          popup={true}
          selectable={true}
          onSelectSlot={(slotInfo) => {
            const startParam = encodeURIComponent(slotInfo.start.toISOString());
            const endParam = encodeURIComponent(slotInfo.end.toISOString());
            router.push(`/app/time-entries/new?start=${startParam}&end=${endParam}`);
          }}
          scrollToTime={new Date(new Date().setHours(8, 0, 0, 0))}
        />
      </div>
    </div>
  );
}
