"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

type CsvRow = {
  name: string;
  unit: string;
  cost_per_unit: string;
  supplier_name?: string;
  origin_story?: string;
  production_method?: string;
  end_of_life?: string;
};

type PreviewRow = CsvRow & { _valid: boolean; _error?: string };

function validateRow(row: CsvRow, index: number): PreviewRow {
  const errors: string[] = [];
  if (!row.name?.trim()) errors.push("name required");
  if (!row.unit?.trim()) errors.push("unit required");
  const cost = parseFloat(row.cost_per_unit);
  if (isNaN(cost) || cost <= 0) errors.push("cost_per_unit must be a positive number");
  return { ...row, _valid: errors.length === 0, _error: errors.join(", ") };
}

export function ImportForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const validated = result.data.map((r, i) => validateRow(r, i));
        setRows(validated);
        setDone(false);
        setImportError(null);
      },
    });
  };

  const validRows = rows.filter((r) => r._valid);

  const handleImport = async () => {
    setImporting(true);
    setImportError(null);
    const supabase = createClient();
    const payload = validRows.map((r) => ({
      name: r.name.trim(),
      unit: r.unit.trim(),
      cost_per_unit: parseFloat(r.cost_per_unit),
      supplier_name: r.supplier_name?.trim() || null,
      origin_story: r.origin_story?.trim() || null,
      production_method: r.production_method?.trim() || null,
      end_of_life: r.end_of_life?.trim() || null,
    }));

    const { error } = await supabase
      .from("materials")
      .upsert(payload, { onConflict: "name" });

    setImporting(false);
    if (error) {
      setImportError(error.message);
      return;
    }
    setDone(true);
    router.push("/app/materials");
    router.refresh();
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Upload area */}
      <div
        className="border-2 border-dashed border-[#e5e0d8] rounded-2xl p-10 text-center cursor-pointer hover:border-[#be7b3b] hover:bg-[#faf9f7] transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-[#1a1714]">Click to upload CSV</p>
        <p className="text-xs text-gray-400 mt-1">
          Required columns: <code className="bg-gray-100 px-1 rounded">name, unit, cost_per_unit</code> — Optional: <code className="bg-gray-100 px-1 rounded">supplier_name, origin_story, production_method, end_of_life</code>
        </p>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      </div>

      {/* Preview table */}
      {rows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">
              {validRows.length} of {rows.length} rows valid
            </p>
            {rows.some((r) => !r._valid) && (
              <span className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {rows.filter((r) => !r._valid).length} rows will be skipped
              </span>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-auto max-h-72">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
                  <th className="text-left px-3 py-2 font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500 uppercase tracking-wide">Unit</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500 uppercase tracking-wide">Cost/unit</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500 uppercase tracking-wide">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={`border-b border-[#e5e0d8] last:border-0 ${!row._valid ? "bg-red-50" : ""}`}>
                    <td className="px-3 py-2">
                      {row._valid ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <span className="text-red-500 text-xs">{row._error}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[#1a1714] font-medium">{row.name}</td>
                    <td className="px-3 py-2 text-gray-500">{row.unit}</td>
                    <td className="px-3 py-2 text-gray-500">{row.cost_per_unit}</td>
                    <td className="px-3 py-2 text-gray-400">{row.supplier_name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {importError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-3">{importError}</p>
          )}

          {done && (
            <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Import complete — redirecting…
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              disabled={validRows.length === 0 || importing}
              onClick={handleImport}
              className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors"
            >
              {importing ? "Importing…" : `Import ${validRows.length} material${validRows.length !== 1 ? "s" : ""}`}
            </button>
            <button
              onClick={() => { setRows([]); if (fileRef.current) fileRef.current.value = ""; }}
              className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium text-gray-600 hover:bg-[#faf9f7] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
