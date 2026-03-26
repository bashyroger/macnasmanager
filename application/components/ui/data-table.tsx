"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Filter } from "lucide-react";

export type ColumnDef<T> = {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  sortAccessor?: (item: T) => any;
};

export type FilterDef<T> = {
  id: string;
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  filterFn: (item: T, value: string) => boolean;
};

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filters?: FilterDef<T>[];
  emptyState?: React.ReactNode;
}

export function DataTable<T>({ data, columns, filters, emptyState }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    id: number | null; // index of column in columns array
    direction: "asc" | "desc";
  }>({ id: null, direction: "asc" });

  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleSort = (idx: number) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.id === idx && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ id: idx, direction });
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const filteredAndSortedData = useMemo(() => {
    // 1. Filter
    let result = [...data];
    if (filters) {
      Object.entries(filterValues).forEach(([filterId, value]) => {
        if (value && value !== "_all") {
          const filterDef = filters.find(f => f.id === filterId);
          if (filterDef) {
            result = result.filter(item => filterDef.filterFn(item, value));
          }
        }
      });
    }

    // 2. Sort
    if (sortConfig.id === null) return result;

    const column = columns[sortConfig.id];
    
    return result.sort((a, b) => {
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
  }, [data, sortConfig, columns, filters, filterValues]);

  if (!data || data.length === 0) {
    return emptyState || (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-medium mb-2">No data yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 bg-[#faf9f7] p-3 rounded-xl border border-[#e5e0d8]">
          <div className="flex items-center gap-2 text-gray-500 mr-2 border-r border-[#e5e0d8] pr-4">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Filters</span>
          </div>
          {filters.map((filter) => (
            <div key={filter.id} className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight ml-0.5">
                {filter.label}
              </label>
              <select
                value={filterValues[filter.id] || "_all"}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="text-xs bg-white border border-[#e5e0d8] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#be7b3b] focus:border-[#be7b3b] transition-all min-w-[120px] h-8"
              >
                <option value="_all">{filter.placeholder || `All ${filter.label}s`}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {Object.values(filterValues).some(v => v !== "_all" && v !== "") && (
            <button
              onClick={() => setFilterValues({})}
              className="text-[10px] text-[#be7b3b] hover:text-[#a86330] font-bold uppercase tracking-wider ml-auto px-2 py-1 rounded hover:bg-[#be7b3b]/10 transition-all"
            >
              Reset
            </button>
          )}
        </div>
      )}

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
            {filteredAndSortedData.map((item, i) => (
              <tr
                key={(item as any).id || i}
                className={`hover:bg-[#faf9f7] transition-colors ${
                  i < filteredAndSortedData.length - 1 ? "border-b border-[#e5e0d8]" : ""
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
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-12 text-gray-400 border-t border-[#e5e0d8]">
            <p className="text-sm">No items match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
