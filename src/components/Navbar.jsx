import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { LANGUAGES } from '../i18n/index.js';
import { formatDate, addDays } from '../utils/date.js';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Users,
  BellRing,
  GitBranch,
  Inbox,
  Landmark,
  TrendingDown,
  Target,
  FolderArchive,
  Scan,
  Settings,
  RotateCcw,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function Navbar() {
  const {
    t,
    language,
    setLanguage,
    textSize,
    setTextSize,
    demoDate,
    setDemoDate,
    resetDemo,
    inboxItems,
    todayFollowups,
    business
  } = useApp();

  const location = useLocation();

  const pendingInboxCount = inboxItems.filter(i => i.status === 'pending').length;
  const pendingFollowupsCount = todayFollowups.length;

  const navLinks = [
    { to: '/', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/invoices', label: t.nav.invoices, icon: FileText },
    { to: '/new-invoice', label: t.nav.newInvoice, icon: FilePlus },
    { to: '/followups', label: t.nav.todayFollowups, icon: BellRing, badge: pendingFollowupsCount },
    { to: '/chase-first', label: t.nav.chaseFirst, icon: Target },
    { to: '/cash-forecast', label: t.nav.cashForecast, icon: TrendingDown },
    { to: '/reconciliation', label: t.nav.payments, icon: Landmark },
    { to: '/inbox', label: t.nav.inbox, icon: Inbox, badge: pendingInboxCount },
    { to: '/customers', label: t.nav.customers, icon: Users },
    { to: '/ladder', label: t.nav.escalationLadder, icon: GitBranch },
    { to: '/documents', label: t.nav.documents, icon: FolderArchive },
    { to: '/scan', label: t.nav.scanInvoice, icon: Scan },
    { to: '/settings', label: t.nav.settings, icon: Settings }
  ];

  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      {/* Top Banner: Brand, Demo Date Stepper, Language & Reset */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-xl text-slate-950 shadow-md group-hover:bg-emerald-400 transition-colors">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">{t.appName}</span>
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  {business.name} (Pune)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                GST: {business.gstin} · Udyam: {business.udyamNumber ? 'MSME Verified' : 'No'}
              </p>
            </div>
          </Link>
        </div>

        {/* Demo Date Simulator Pill */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">{t.nav.demoDate}:</span>
          <span className="font-bold text-amber-300">{formatDate(demoDate)}</span>
          <div className="flex items-center gap-1 ml-1.5">
            <button
              onClick={() => setDemoDate(addDays(demoDate, 7))}
              title="Fast-forward 7 days"
              className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] text-slate-200"
            >
              +7d
            </button>
            <button
              onClick={() => setDemoDate(addDays(demoDate, 30))}
              title="Fast-forward 30 days"
              className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] text-slate-200"
            >
              +30d
            </button>
            <button
              onClick={() => setDemoDate('2026-10-24')}
              title="Reset date to default"
              className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] text-slate-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Controls: Language, Text Size, Reset Demo */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === lang.code
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>

          {/* Text Size */}
          <select
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded text-xs px-2 py-1"
            title="Adjust text size for readability"
          >
            <option value="normal">A (16px)</option>
            <option value="large">A+ (18px)</option>
            <option value="xl">A++ (20px)</option>
          </select>

          {/* Reset Demo */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data (invoices, customers, expenses, bank statement) to original sample state?')) {
                resetDemo();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded transition-colors"
            title="Reset demo data to default sample dataset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.nav.resetDemo}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-slate-950 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-2 flex items-center gap-1 py-1 min-w-max">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
