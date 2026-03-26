import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("title").eq("id", id).single();
  return { title: `Finances — ${data?.title ?? "Project"}` };
}

export default async function ProjectFinancesPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: finances }] = await Promise.all([
    supabase.from("projects").select("id, title").eq("id", id).single(),
    supabase.from("v_project_financials_current").select("*").eq("project_id", id).single(),
  ]);

  if (!project) notFound();

  const tabs = [
    { label: "Overview", href: `/app/projects/${id}` },
    { label: "Materials", href: `/app/projects/${id}/materials` },
    { label: "Time", href: `/app/projects/${id}/time` },
    { label: "Finances", href: `/app/projects/${id}/finances` },
    { label: "Publish", href: `/app/projects/${id}/publish` },
  ];

  const hasData = finances !== null;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/projects" className="hover:text-[#be7b3b]">Projects</Link> /{" "}
          <Link href={`/app/projects/${id}`} className="hover:text-[#be7b3b]">{project.title}</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Financial Overview</h1>
      </div>

      <div className="flex gap-1 mb-8 border-b border-[#e5e0d8]">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab.label === "Finances"
                ? "text-[#1a1714] border-[#be7b3b]"
                : "text-gray-500 hover:text-[#1a1714] border-transparent hover:border-[#be7b3b]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {!hasData ? (
        <div className="text-sm text-gray-500">No financial data available for this project.</div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          {/* Costs Breakdown */}
          <section className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e5e0d8] bg-[#faf9f7]">
              <h2 className="text-sm font-semibold text-[#1a1714]">Costs Breakdown</h2>
            </div>
            <div className="divide-y divide-[#e5e0d8]">
              <CostRow label="Materials" value={finances.material_cost ?? 0} />
              <CostRow label="Labor" value={finances.labor_cost ?? 0} detail={`${Math.floor((finances.labor_minutes ?? 0) / 60)}h ${(finances.labor_minutes ?? 0) % 60}m @ ${formatCurrency(finances.hourly_rate_snapshot ?? 0)}/hr`} />
              <CostRow label="Overhead" value={finances.overhead_cost ?? 0} />
              <div className="px-5 py-4 flex justify-between items-center bg-gray-50">
                <span className="text-sm font-medium text-[#1a1714]">Total Cost</span>
                <span className="text-lg font-bold text-[#1a1714] tabular-nums">{formatCurrency(finances.total_cost ?? 0)}</span>
              </div>
            </div>
          </section>

          {/* Profitability */}
          <section className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e5e0d8] bg-[#faf9f7]">
              <h2 className="text-sm font-semibold text-[#1a1714]">Profitability</h2>
            </div>
            <div className="divide-y divide-[#e5e0d8]">
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-medium text-[#1a1714]">Client Price (Charged Amount)</span>
                  <p className="text-xs text-gray-400 mt-0.5">Set in Project Settings</p>
                </div>
                <span className="text-base font-semibold text-[#1a1714] tabular-nums">
                  {finances.charged_amount !== null ? formatCurrency(finances.charged_amount) : <span className="text-gray-400 italic font-normal">Not set</span>}
                </span>
              </div>

              {finances.charged_amount !== null && (
                <>
                  <div className="px-5 py-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-[#1a1714]">Gross Profit</span>
                    <span className={`text-base font-semibold tabular-nums ${(finances.profit_amount ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(finances.profit_amount ?? 0)}
                    </span>
                  </div>
                  <div className="px-5 py-4 flex justify-between items-center bg-gray-50">
                    <span className="text-sm font-medium text-[#1a1714]">Profit Margin</span>
                    <span className={`text-lg font-bold tabular-nums ${(finances.profit_margin_pct ?? 0) >= 0.2 ? "text-green-600" : (finances.profit_margin_pct ?? 0) >= 0 ? "text-amber-600" : "text-red-600"}`}>
                      {((finances.profit_margin_pct ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function CostRow({ label, value, detail }: { label: string; value: number; detail?: string }) {
  return (
    <div className="px-5 py-3 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">{label}</span>
        {detail && <span className="text-xs text-gray-400 mt-0.5">{detail}</span>}
      </div>
      <span className="text-sm font-medium text-[#1a1714] tabular-nums">{formatCurrency(value)}</span>
    </div>
  );
}
