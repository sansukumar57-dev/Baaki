import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import {
  FolderArchive,
  Printer,
  FileSpreadsheet,
  Search,
  ExternalLink,
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';

export default function Documents() {
  const { t, invoices } = useApp();
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(inv => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight">{t.documents.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
              Audit Dossiers
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{t.documents.subtitle}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search dossiers by invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Dossiers List */}
      <div className="space-y-3.5">
        {filtered.map(inv => (
          <div
            key={inv.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                    {inv.customerName}
                  </span>
                  <span className="text-xs text-slate-400">
                    Dated: {formatDate(inv.invoiceDate)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Total: {formatPaise(inv.grandTotalPaise)} · Outstanding: <span className="font-bold text-rose-500">{formatPaise(inv.balancePaise)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  to={`/print/invoice/${inv.id}`}
                  target="_blank"
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tax Invoice</span>
                </Link>

                {inv.overdueDays >= 30 && (
                  <Link
                    to={`/print/demand-letter/${inv.id}`}
                    target="_blank"
                    className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1 border border-rose-300 dark:border-rose-800"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Demand Letter</span>
                  </Link>
                )}

                <Link
                  to={`/print/evidence/${inv.id}`}
                  target="_blank"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download Evidence Pack</span>
                </Link>
              </div>
            </div>

            {/* Timeline preview */}
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] uppercase">
                Audit Trail ({inv.timeline?.length || 1} Events Recorded)
              </span>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 font-mono text-[11px] truncate">
                Latest: {inv.timeline?.[inv.timeline.length - 1]?.event || 'Invoice created'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
