import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import {
  Wallet,
  AlertCircle,
  CalendarCheck,
  Receipt,
  TrendingDown,
  Building2,
  ArrowRight,
  MessageCircle,
  Eye,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { t, dashboardStats, cashForecastData, chaseList, demoDate, markReminderSent } = useApp();

  const {
    toCollectPaise,
    overduePaise,
    expectedWeekPaise,
    expectedMonthPaise,
    upcomingBillsPaise,
    bankCashPaise,
    ageing
  } = dashboardStats;

  const totalAgeingPaise =
    ageing.notYetDuePaise +
    ageing.days1_30Paise +
    ageing.days31_60Paise +
    ageing.days61_90Paise +
    ageing.days90PlusPaise || 1;

  const getPercent = (amount) => Math.round((amount / totalAgeingPaise) * 100);

  const top5Chase = chaseList.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700/60 shadow-lg text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight">{t.dashboard.title}</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Sharma Packaging (Pune)
            </span>
          </div>
          <p className="text-slate-300 text-sm mt-1">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/new-invoice"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm shadow transition-all flex items-center gap-1.5"
          >
            + {t.nav.newInvoice}
          </Link>
          <Link
            to="/followups"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5"
          >
            {t.nav.todayFollowups}
          </Link>
        </div>
      </div>

      {/* Cash Buffer Shortfall Alert Banner if applicable */}
      {cashForecastData.firstShortfallWeek && (
        <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-4 text-amber-200 flex items-start gap-3 shadow-md">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-amber-300 text-base">
              {t.cashForecast.bufferWarning.replace('{week}', cashForecastData.firstShortfallWeek)}
            </h4>
            <p className="text-sm text-amber-200/90 mt-0.5">
              Operating cash falls to {formatPaise(cashForecastData.lowestCashPaise)}, threatening salaries and supplier payments.
              Recovering top overdue invoices will keep the cash buffer safe.
            </p>
          </div>
          <Link
            to="/cash-forecast"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs whitespace-nowrap"
          >
            {t.cashForecast.title} →
          </Link>
        </div>
      )}

      {/* 6 Key Financial Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Money to Collect */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{t.dashboard.toCollect}</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
            {formatPaise(toCollectPaise)}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1" title={t.dashboard.toCollectTooltip}>
            Total unpaid customer dues
          </p>
        </div>

        {/* Overdue */}
        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-xl p-3.5 shadow-sm bg-rose-50/20 dark:bg-rose-950/10">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700 dark:text-rose-400">
            <span>{t.dashboard.overdue}</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1.5">
            {formatPaise(overduePaise)}
          </div>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1" title={t.dashboard.overdueTooltip}>
            Past 30-day credit term
          </p>
        </div>

        {/* Expected This Week */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{t.dashboard.expectedWeek}</span>
            <CalendarCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
            {formatPaise(expectedWeekPaise)}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Due within next 7 days</p>
        </div>

        {/* Expected This Month */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{t.dashboard.expectedMonth}</span>
            <Receipt className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
            {formatPaise(expectedMonthPaise)}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Due within next 30 days</p>
        </div>

        {/* Bills Due Next 30 Days */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{t.dashboard.billsDue30Days}</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1.5">
            {formatPaise(upcomingBillsPaise)}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Salaries, Rent & Raw Materials</p>
        </div>

        {/* Cash in Bank & Lowest Forecast */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{t.dashboard.bankCash}</span>
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">
            {formatPaise(bankCashPaise)}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Lowest: <span className="font-semibold">{formatPaise(cashForecastData.lowestCashPaise)}</span>
          </p>
        </div>
      </div>

      {/* Ageing Breakdown Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.dashboard.ageingTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of outstanding money by overdue timeline from due date
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
            Total Dues: {formatPaise(toCollectPaise)}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-6 w-full rounded-lg overflow-hidden flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div
            style={{ width: `${getPercent(ageing.notYetDuePaise)}%` }}
            className="bg-emerald-500 h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"
            title={`Not Yet Due: ${formatPaise(ageing.notYetDuePaise)} (${getPercent(ageing.notYetDuePaise)}%)`}
          >
            {getPercent(ageing.notYetDuePaise) > 8 && `${getPercent(ageing.notYetDuePaise)}%`}
          </div>
          <div
            style={{ width: `${getPercent(ageing.days1_30Paise)}%` }}
            className="bg-amber-400 h-full transition-all flex items-center justify-center text-[10px] text-slate-950 font-bold"
            title={`1-30 Days: ${formatPaise(ageing.days1_30Paise)} (${getPercent(ageing.days1_30Paise)}%)`}
          >
            {getPercent(ageing.days1_30Paise) > 8 && `${getPercent(ageing.days1_30Paise)}%`}
          </div>
          <div
            style={{ width: `${getPercent(ageing.days31_60Paise)}%` }}
            className="bg-orange-500 h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"
            title={`31-60 Days: ${formatPaise(ageing.days31_60Paise)} (${getPercent(ageing.days31_60Paise)}%)`}
          >
            {getPercent(ageing.days31_60Paise) > 8 && `${getPercent(ageing.days31_60Paise)}%`}
          </div>
          <div
            style={{ width: `${getPercent(ageing.days61_90Paise)}%` }}
            className="bg-rose-500 h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"
            title={`61-90 Days: ${formatPaise(ageing.days61_90Paise)} (${getPercent(ageing.days61_90Paise)}%)`}
          >
            {getPercent(ageing.days61_90Paise) > 8 && `${getPercent(ageing.days61_90Paise)}%`}
          </div>
          <div
            style={{ width: `${getPercent(ageing.days90PlusPaise)}%` }}
            className="bg-rose-800 h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"
            title={`90+ Days: ${formatPaise(ageing.days90PlusPaise)} (${getPercent(ageing.days90PlusPaise)}%)`}
          >
            {getPercent(ageing.days90PlusPaise) > 8 && `${getPercent(ageing.days90PlusPaise)}%`}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <p className="text-slate-500 dark:text-slate-400">{t.dashboard.notYetDue}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{formatPaise(ageing.notYetDuePaise)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <div>
              <p className="text-slate-500 dark:text-slate-400">{t.dashboard.days1_30}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{formatPaise(ageing.days1_30Paise)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
            <div>
              <p className="text-slate-500 dark:text-slate-400">{t.dashboard.days31_60}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{formatPaise(ageing.days31_60Paise)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
            <div>
              <p className="text-slate-500 dark:text-slate-400">{t.dashboard.days61_90}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{formatPaise(ageing.days61_90Paise)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-800 shrink-0" />
            <div>
              <p className="text-slate-500 dark:text-slate-400">{t.dashboard.days90Plus}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{formatPaise(ageing.days90PlusPaise)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 From "Chase These First" */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.dashboard.topChaseTitle}</h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                Action Required Today
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritized by amount, days overdue, customer reliability, and impact on future cash shortfall
            </p>
          </div>
          <Link
            to="/chase-first"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
          >
            {t.dashboard.viewAllChase} ({chaseList.length}) →
          </Link>
        </div>

        <div className="space-y-3">
          {top5Chase.map((item, idx) => {
            const waText = encodeURIComponent(
              `Namaste ${item.customer.contactPerson || item.customerName} ji 🙏\n\nFriendly reminder from Sharma Packaging regarding overdue invoice *${item.invoiceNumber}* for *${formatPaise(item.balancePaise)}* (${item.overdueDays} days past due).\n\nKindly release payment: http://localhost:5173/pay/${item.token}\n\nThank you!`
            );
            const waLink = `https://wa.me/${(item.customer.phone || '').replace(/[^0-9]/g, '')}?text=${waText}`;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-black flex items-center justify-center text-sm shrink-0 mt-0.5">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{item.customerName}</span>
                      <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                        {item.invoiceNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                        {item.overdueDays} days overdue
                      </span>
                      {item.coversShortfall && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          Covers Cash Gap
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                      💡 {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-base font-black text-slate-900 dark:text-white mr-2">
                    {formatPaise(item.balancePaise)}
                  </span>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => markReminderSent(item.id, 'dashboard_quick', 'whatsapp')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow"
                    title="Send instant WhatsApp payment reminder"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <Link
                    to={`/invoices?search=${encodeURIComponent(item.invoiceNumber)}`}
                    className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs"
                    title="View invoice details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
