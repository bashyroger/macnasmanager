"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export type ColumnDef<T> = {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  sortAccessor?: (item: T) => any;
};

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  emptyState?: React.ReactNode;
}

export function DataTable<T>({ data, columns, emptyState }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    id: number | null; // index of column in columns array
    direction: "asc" | "desc";
  }>({ id: null, direction: "asc" });

  const handleSort = (idx: number) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.id === idx && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ id: idx, direction });
  };

  const sortedData = useMemo(() => {
    if (sortConfig.id === null) return data;

    const column = columns[sortConfig.id];
    
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (column.sortAccessor) {
        aValue = column.sortAccessor(a);
        bValue = column.sortAccessor(b);
      } else if (column.accessorKey) {
        aValue = a[column.accessorKey];
        bValue = b[column.accessorKey];
      } else {
        return 0;
      }

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const order = sortConfig.direction === "asc" ? 1 : -1;
      
      // Case-insensitive string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * order;
      }

      return aValue < bValue ? -1 * order : 1 * order;
    });
  }, [data, sortConfig, columns]);

  if (!data || data.length === 0) {
    return emptyState || (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-medium mb-2">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 ${column.className || ""}`}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(idx)}
                    className="flex items-center gap-1 hover:text-[#be7b3b] transition-colors focus:outline-none"
                  >
                    {column.header}
                    {sortConfig.id === idx ? (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-3 h-3 text-[#be7b3b]" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-[#be7b3b]" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 text-gray-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, i) => (
            <tr
              key={(item as any).id || i}
              className={`hover:bg-[#faf9f7] transition-colors ${
                i < sortedData.length - 1 ? "border-b border-[#e5e0d8]" : ""
              }`}
            >
              {columns.map((column, j) => (
                <td key={j} className={`px-4 py-3 ${column.className || ""}`}>
                  {column.cell
                    ? column.cell(item)
                    : column.accessorKey
                    ? (item[column.accessorKey] as any)?.toString() || "—"
                    : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
