import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import {
  Target,
  MessageCircle,
  Eye,
  FileText,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

export default function ChaseFirst() {
  const { t, chaseList, markReminderSent, cashForecastData } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight">{t.chaseFirst.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
              {chaseList.length} Invoices
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{t.chaseFirst.subtitle}</p>
        </div>

        {cashForecastData.firstShortfallWeek && (
          <div className="text-xs bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 rounded-lg text-rose-300 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Shortfall in Week {cashForecastData.firstShortfallWeek}</span>
          </div>
        )}
      </div>

      {/* Chase Priority List */}
      <div className="space-y-3.5">
        {chaseList.map((item, idx) => {
          const waText = encodeURIComponent(
            `Namaste ${item.customer.contactPerson || item.customerName} ji 🙏\n\nFriendly reminder from Sharma Packaging regarding overdue invoice *${item.invoiceNumber}* for *${formatPaise(item.balancePaise)}* (${item.overdueDays} days past due).\n\nKindly release payment: http://localhost:5173/pay/${item.token}\n\nThank you!`
          );
          const waLink = `https://wa.me/${(item.customer.phone || '').replace(/[^0-9]/g, '')}?text=${waText}`;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-emerald-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Rank & Details */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Rank</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">#{idx + 1}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {item.customerName}
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-semibold">
                      {item.invoiceNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                      {item.overdueDays} days overdue
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Grade {item.customer.grade}
                    </span>
                    {item.coversShortfall && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Covers Week {cashForecastData.firstShortfallWeek} Gap
                      </span>
                    )}
                  </div>

                  {/* Reason in Plain Words */}
                  <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                    <span className="text-amber-500 font-bold shrink-0">Why chase today:</span>
                    <span className="italic">{item.reason}</span>
                  </div>
                </div>
              </div>

              {/* Right: Amount, Score & Quick Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Balance Owed</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white block">
                    {formatPaise(item.balancePaise)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Score: {item.score}/100</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => markReminderSent(item.id, 'chase_quick', 'whatsapp')}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {item.overdueDays >= 30 && (
                    <Link
                      to={`/print/demand-letter/${item.id}`}
                      target="_blank"
                      className="px-3 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Demand Letter</span>
                    </Link>
                  )}

                  <Link
                    to={`/invoices?search=${encodeURIComponent(item.invoiceNumber)}`}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                    title="View invoice timeline"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
