import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function Customers() {
  const { t, customers, invoices } = useApp();
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');

  const customerStats = customers.map(cust => {
    const custInvoices = invoices.filter(i => i.customerId === cust.id);
    const totalOwedPaise = custInvoices.reduce((sum, inv) => sum + (inv.balancePaise || 0), 0);
    const overdueCount = custInvoices.filter(i => i.overdueDays > 0 && i.balancePaise > 0).length;
    return {
      ...cust,
      totalOwedPaise,
      invoiceCount: custInvoices.length,
      overdueCount
    };
  });

  const filtered = customerStats.filter(c => {
    if (gradeFilter !== 'all' && c.grade !== gradeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.contactPerson || '').toLowerCase().includes(q) ||
        (c.gstin || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getGradeBadge = (grade) => {
    switch (grade) {
      case 'A':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Grade A</span>
          </span>
        );
      case 'B':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Grade B</span>
          </span>
        );
      case 'C':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/40 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Grade C (High Risk)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.customers.title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.customers.subtitle}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name, contact, GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-slate-500 font-semibold">Reliability:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          >
            <option value="all">All Grades (12)</option>
            <option value="A">Grade A (Disciplined)</option>
            <option value="B">Grade B (Moderate)</option>
            <option value="C">Grade C (Risky Delay)</option>
          </select>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => (
          <div
            key={cust.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Name and Grade */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{cust.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Attn: {cust.contactPerson}
                  </p>
                </div>
                {getGradeBadge(cust.grade)}
              </div>

              {/* Reliability Explanation in Words */}
              <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-700 dark:text-slate-300 italic border-l-2 border-emerald-500">
                "{cust.gradeReason}"
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                <div>
                  <span className="block text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase">{t.customers.avgDelay}</span>
                  <span className={`font-bold ${cust.avgDelayDays > 25 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {cust.avgDelayDays} days
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase">{t.customers.onTime}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {cust.onTimeRate}%
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase">{t.customers.totalOwed}</span>
                  <span className={`font-bold ${cust.totalOwedPaise > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatPaise(cust.totalOwedPaise)}
                  </span>
                </div>
              </div>

              {/* Location & Tax Info */}
              <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{cust.city}, {cust.state} ({cust.stateCode})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span>GSTIN: {cust.gstin || 'Unregistered'}</span>
                  <span className="uppercase text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    Lang: {cust.preferredLanguage}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: View Invoices */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {cust.invoiceCount} invoices ({cust.overdueCount} overdue)
              </span>
              <Link
                to={`/invoices?search=${encodeURIComponent(cust.name)}`}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
              >
                <span>View Invoices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
