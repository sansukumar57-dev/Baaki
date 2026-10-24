import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import {
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Sliders,
  DollarSign,
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function CashForecast() {
  const {
    t,
    cashForecastData,
    safetyBufferPaise,
    whatIfCustomerDelay,
    setWhatIfCustomerDelay,
    whatIfBigOrder,
    setWhatIfBigOrder,
    whatIfSupplierDelay,
    setWhatIfSupplierDelay
  } = useApp();

  const { weeks, firstShortfallWeek, lowestCashPaise, gapShortfallPaise, gapCoveringInvoices } = cashForecastData;

  // Chart min/max scaling
  const allCashValues = weeks.flatMap(w => [w.openingPaise, w.closingPaise, safetyBufferPaise]);
  const minVal = Math.min(0, ...allCashValues);
  const maxVal = Math.max(80000000, ...allCashValues);
  const range = maxVal - minVal || 1;

  const chartHeight = 160;
  const chartWidth = 720;
  const colWidth = chartWidth / weeks.length;

  const getY = (valPaise) => {
    const norm = (valPaise - minVal) / range;
    return chartHeight - norm * (chartHeight - 30) - 15;
  };

  const bufferY = getY(safetyBufferPaise);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight">{t.cashForecast.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
              13 Weeks Forward
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{t.cashForecast.subtitle}</p>
        </div>

        <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-emerald-400 font-mono">
          Safety Buffer: {formatPaise(safetyBufferPaise)}
        </div>
      </div>

      {/* Shortfall Alert */}
      {firstShortfallWeek ? (
        <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-5 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-rose-300 text-base">
                {t.cashForecast.bufferWarning.replace('{week}', firstShortfallWeek)}
              </h3>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Closing cash dips to {formatPaise(weeks[firstShortfallWeek - 1].closingPaise)} in Week {firstShortfallWeek} (below the {formatPaise(safetyBufferPaise)} safety buffer).
                A cash gap of {formatPaise(gapShortfallPaise)} must be bridged.
              </p>
            </div>
          </div>
          <Link
            to="/chase-first"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow shrink-0"
          >
            Chase Invoices to Bridge Gap →
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 text-emerald-300 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-xs font-semibold">
            Cash buffer is fully secure! Operating balance remains above {formatPaise(safetyBufferPaise)} across all 13 weeks.
          </div>
        </div>
      )}

      {/* What-If Stress Testing Interactive Switches */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.cashForecast.whatIfTitle}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Switch 1: Customer Delay */}
          <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            whatIfCustomerDelay
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-900 dark:text-amber-200'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={whatIfCustomerDelay}
              onChange={(e) => setWhatIfCustomerDelay(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600"
            />
            <div className="text-xs">
              <span className="font-bold block">{t.cashForecast.whatIfCustomerDelay}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Simulates Kalyani Agro (CUST-001) delaying payment by 30 days.
              </span>
            </div>
          </label>

          {/* Switch 2: Big Order */}
          <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            whatIfBigOrder
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-900 dark:text-emerald-200'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={whatIfBigOrder}
              onChange={(e) => setWhatIfBigOrder(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600"
            />
            <div className="text-xs">
              <span className="font-bold block">{t.cashForecast.whatIfBigOrder}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Simulates receiving a rush ₹2,50,000 export packaging order in Week 5.
              </span>
            </div>
          </label>

          {/* Switch 3: Supplier Delayed */}
          <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            whatIfSupplierDelay
              ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-900 dark:text-blue-200'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={whatIfSupplierDelay}
              onChange={(e) => setWhatIfSupplierDelay(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600"
            />
            <div className="text-xs">
              <span className="font-bold block">{t.cashForecast.whatIfSupplierDelay}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Negotiate 14 days credit extension with Kraft paper suppliers.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Visual Projection Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cash Availability Projection</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500" />
              <span className="text-slate-500">Buffer Line ({formatPaise(safetyBufferPaise)})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Closing Cash</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto py-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44">
            {/* Grid Lines */}
            <line x1="0" y1={bufferY} x2={chartWidth} y2={bufferY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="8" y={bufferY - 5} fill="#f43f5e" fontSize="10" fontWeight="bold">Safety Buffer ₹2,00,000</text>

            {/* Zero line if negative */}
            {minVal < 0 && (
              <line x1="0" y1={getY(0)} x2={chartWidth} y2={getY(0)} stroke="#64748b" strokeWidth="1" />
            )}

            {/* Bars for each week */}
            {weeks.map((w, idx) => {
              const x = idx * colWidth + 8;
              const y = getY(w.closingPaise);
              const isBelow = w.isBelowBuffer;
              const height = Math.abs(chartHeight - y - 20);

              return (
                <g key={w.weekNumber}>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={colWidth - 16}
                    height={Math.max(4, height)}
                    rx="4"
                    fill={isBelow ? '#f43f5e' : '#10b981'}
                    opacity={isBelow ? '0.85' : '0.8'}
                  />
                  {/* Week label */}
                  <text
                    x={x + (colWidth - 16) / 2}
                    y={chartHeight - 4}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    W{w.weekNumber}
                  </text>
                  {/* Point */}
                  <circle
                    cx={x + (colWidth - 16) / 2}
                    cy={y}
                    r="3.5"
                    fill={isBelow ? '#e11d48' : '#059669'}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Invoices that cover the gap */}
      {gapCoveringInvoices.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t.cashForecast.gapCoversTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Collecting even one of these overdue invoices will keep the cash buffer completely safe
              </p>
            </div>
            <Link to="/chase-first" className="text-xs font-bold text-emerald-600 hover:text-emerald-500">
              View All Chase Priorities →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {gapCoveringInvoices.slice(0, 3).map(inv => (
              <div
                key={inv.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate max-w-[180px]">
                    {inv.customerName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">{inv.invoiceNumber}</span>
                  <span className="text-[10px] text-rose-500 font-bold block">{inv.overdueDays} days overdue</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 block">
                    {formatPaise(inv.balancePaise)}
                  </span>
                  <Link
                    to={`/invoices?search=${encodeURIComponent(inv.invoiceNumber)}`}
                    className="text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    Chase Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13-Week Detailed Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Week-by-Week Cash Flow Ledger</h3>
          <span className="text-[11px] text-slate-500">
            Rule Verified: Next week opening cash strictly equals previous week closing cash
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-3">Week</th>
                <th className="p-3">Period</th>
                <th className="p-3 text-right">{t.cashForecast.openingCash}</th>
                <th className="p-3 text-right text-emerald-600 dark:text-emerald-400">{t.cashForecast.inflows}</th>
                <th className="p-3 text-right text-amber-600 dark:text-amber-400">{t.cashForecast.outflows}</th>
                <th className="p-3 text-right">{t.cashForecast.closingCash}</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {weeks.map(w => (
                <tr
                  key={w.weekNumber}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    w.isBelowBuffer ? 'bg-rose-50/20 dark:bg-rose-950/20' : ''
                  }`}
                >
                  <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">Week {w.weekNumber}</td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">
                    {formatDate(w.startDate, 'short')} - {formatDate(w.endDate, 'short')}
                  </td>
                  <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatPaise(w.openingPaise)}
                  </td>
                  <td className="p-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                    + {formatPaise(w.inflowPaise)}
                  </td>
                  <td className="p-3 text-right font-medium text-amber-600 dark:text-amber-400">
                    - {formatPaise(w.outflowPaise)}
                  </td>
                  <td className="p-3 text-right font-black text-slate-900 dark:text-white">
                    {formatPaise(w.closingPaise)}
                  </td>
                  <td className="p-3 text-center">
                    {w.isBelowBuffer ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                        Buffer Breached
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        Healthy
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
