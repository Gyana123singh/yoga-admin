import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  Download,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from './Button';
import clsx from 'clsx';

export function ModernTable({
  columns,
  data = [],
  searchPlaceholder = 'Search records...',
  onRowClick,
  title,
  actions,
  pageSize: initialPageSize = 5,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState([]);

  // Filter logic
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(row => {
      return Object.values(row).some(val =>
        String(val).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm]);

  // Sort logic
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(r => r.id || JSON.stringify(r)));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const exportCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = data.map(r => columns.map(c => `"${r[c.accessor] || ''}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title || 'export'}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
      {/* Header Toolbar */}
      <div className="p-3.5 sm:p-5 border-b border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {title ? (
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
              Showing {sortedData.length} entries total
            </p>
          </div>
        ) : <div />}

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <Button variant="glass" size="sm" icon={Download} onClick={exportCSV} className="shrink-0">
            Export
          </Button>

          {actions}
        </div>
      </div>

      {/* Mobile Card View (Screens < md) */}
      <div className="block md:hidden p-3 space-y-3">
        {paginatedData.length > 0 ? (
          paginatedData.map((row, idx) => {
            const rowId = row.id || idx;
            const isSelected = selectedRows.includes(rowId);
            const firstCol = columns[0];
            const otherCols = columns.slice(1);

            return (
              <div
                key={rowId}
                onClick={() => onRowClick && onRowClick(row)}
                className={clsx(
                  'p-3.5 rounded-xl border transition-all cursor-pointer space-y-3',
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/50'
                    : 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 hover:border-indigo-500/40'
                )}
              >
                {/* Mobile Card Header Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectRow(rowId);
                      }}
                      className="text-slate-400 hover:text-indigo-500 shrink-0"
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-500" /> : <Square className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      {firstCol?.cell ? firstCol.cell(row) : <span className="font-bold text-xs text-slate-900 dark:text-white">{row[firstCol?.accessor]}</span>}
                    </div>
                  </div>
                </div>

                {/* Mobile Card Details Grid */}
                {otherCols.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/80 text-xs">
                    {otherCols.map((col) => (
                      <div key={col.accessor || col.header} className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                          {col.header}
                        </span>
                        <div className="mt-0.5 text-slate-700 dark:text-slate-300 font-medium">
                          {col.cell ? col.cell(row) : row[col.accessor]}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400">
            <Filter className="w-8 h-8 mx-auto text-slate-400 opacity-60 mb-2" />
            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No matching records</p>
            <p className="text-xs text-slate-500 mt-1">Try refining search terms.</p>
          </div>
        )}
      </div>

      {/* Desktop Table Content (Screens >= md) */}
      <div className="hidden md:block overflow-x-auto touch-scrolling">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800/80 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            <tr>
              <th className="p-4 w-10 text-center">
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-indigo-500">
                  {selectedRows.length > 0 && selectedRows.length === paginatedData.length ? (
                    <CheckSquare className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {columns.map((col) => (
                <th
                  key={col.accessor || col.header}
                  onClick={() => col.sortable !== false && col.accessor && handleSort(col.accessor)}
                  className={clsx(
                    'p-4 font-bold text-slate-700 dark:text-slate-300 select-none',
                    col.sortable !== false && 'cursor-pointer hover:text-indigo-500 transition-colors'
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable !== false && col.accessor && (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const rowId = row.id || idx;
                const isSelected = selectedRows.includes(rowId);
                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={clsx(
                      'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer',
                      isSelected && 'bg-indigo-50/60 dark:bg-indigo-950/20'
                    )}
                  >
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleSelectRow(rowId)} className="text-slate-400 hover:text-indigo-500">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-500" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>

                    {columns.map((col) => (
                      <td key={col.accessor || col.header} className="p-4 text-slate-700 dark:text-slate-300">
                        {col.cell ? col.cell(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <Filter className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No matching records</p>
                    <p className="text-xs text-slate-500">Try refining your search terms or filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 sm:p-4 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none text-xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="flex items-center gap-1 justify-center w-full sm:w-auto">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
