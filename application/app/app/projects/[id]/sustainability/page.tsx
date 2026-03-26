import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { computeProjectSustainability } from "@/lib/sustainability";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("title").eq("id", id).single();
  return { title: `Sustainability — ${data?.title ?? "Project"}` };
}

export default async function ProjectSustainabilityPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("id, title").eq("id", id).single();
  if (!project) notFound();

  // Compute sustainability dynamically for display until snapshot is taken
  const sustainability = await computeProjectSustainability(id);

  const tabs = [
    { label: "Overview", href: `/app/projects/${id}` },
    { label: "Materials", href: `/app/projects/${id}/materials` },
    { label: "Time", href: `/app/projects/${id}/time` },
    { label: "Finances", href: `/app/projects/${id}/finances` },
    { label: "Sustainability", href: `/app/projects/${id}/sustainability` },
    { label: "Publish", href: `/app/projects/${id}/publish` },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/projects" className="hover:text-[#be7b3b]">Projects</Link> /{" "}
          <Link href={`/app/projects/${id}`} className="hover:text-[#be7b3b]">{project.title}</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Sustainability Overview</h1>
      </div>

      <div className="flex gap-1 mb-8 border-b border-[#e5e0d8] overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              tab.label === "Sustainability"
                ? "text-[#1a1714] border-[#be7b3b]"
                : "text-gray-500 hover:text-[#1a1714] border-transparent hover:border-[#be7b3b]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {!sustainability.isComplete && sustainability.missingScores ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-red-800 mb-2">Calculation Blocked: Missing Data</h2>
          <p className="text-sm text-red-700 mb-4">
            Some materials used in this project are missing sustainability scores for active axes. 
            The system cannot guarantee a deterministic overall score until these values are provided in the Material Library.
          </p>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {sustainability.missingScores.map((m, i) => (
              <li key={i}>
                <span className="font-semibold">{m.materialName}</span> is missing <span className="font-semibold">{m.axisName}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Grades Card */}
          <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
            <div className="px-5 py-6 flex flex-col items-center justify-center border-b border-[#e5e0d8] bg-[#faf9f7]">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Overall Score</div>
              <div className="text-5xl font-bold text-[#1a1714] tabular-nums tracking-tight">
                {sustainability.overallScore === 0 ? "N/A" : sustainability.overallScore}
              </div>
            </div>
            {sustainability.axes && sustainability.axes.length > 0 ? (
              <div className="divide-y divide-[#e5e0d8]">
                {sustainability.axes.map((axis) => (
                  <div key={axis.axisId} className="px-5 py-4 flex justify-between items-center bg-white">
                    <span className="text-sm font-medium text-[#1a1714]">{axis.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 tabular-nums">{axis.score} / 100</span>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getGradeColors(axis.letterGrade)}`}>
                        {axis.letterGrade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-gray-400">No active sustainability axes configured.</div>
            )}
          </div>

          {/* Radar Chart Placeholder (Would use Recharts in a real app, keeping it simple HTML for now or we can implement real Recharts) */}
          <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden p-6 min-h-[300px] flex flex-col items-center justify-center">
            {sustainability.radarChartPayload && sustainability.radarChartPayload.length > 0 ? (
               <div className="text-center">
                 <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#e5e0d8] rounded-full flex items-center justify-center text-[#be7b3b]">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                 </div>
                 <p className="text-sm text-gray-400">JSON Payload ready for Showcase Radar Chart</p>
                 <pre className="mt-4 text-[10px] text-left overflow-auto bg-gray-50 p-2 text-gray-500 max-w-xs rounded">
                   {JSON.stringify(sustainability.radarChartPayload, null, 2)}
                 </pre>
               </div>
            ) : (
              <p className="text-sm text-gray-400">Insufficient data to generate radar chart</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getGradeColors(grade: string) {
  switch (grade) {
    case "A": return "bg-green-100 text-green-700";
    case "B": return "bg-blue-100 text-blue-700";
    case "C": return "bg-amber-100 text-amber-700";
    case "D": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-500";
  }
}
