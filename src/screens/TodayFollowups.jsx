import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate, addDays } from '../utils/date.js';
import {
  BellRing,
  MessageCircle,
  Mail,
  Smartphone,
  CheckCircle,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PauseCircle
} from 'lucide-react';

export default function TodayFollowups() {
  const { t, todayFollowups, demoDate, markReminderSent, recordPromiseToPay } = useApp();

  const [activePromiseModal, setActivePromiseModal] = useState(null); // followup id
  const [promisedDate, setPromisedDate] = useState(addDays(demoDate, 5));

  const handlePromiseSubmit = (invoiceId) => {
    recordPromiseToPay(invoiceId, promisedDate);
    setActivePromiseModal(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight">{t.todayFollowups.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
              {todayFollowups.length} Due
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{t.todayFollowups.subtitle}</p>
        </div>
        <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-amber-300 font-mono">
          Simulated Date: {formatDate(demoDate)}
        </div>
      </div>

      {todayFollowups.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">All Caught Up for Today!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            No pending escalation follow-ups due on {formatDate(demoDate)}. Use the demo date fast-forward (+7d / +30d) in the top bar to simulate time progression.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayFollowups.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-emerald-500/40 transition-colors"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {item.customer.name}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {item.invoice.invoiceNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    Stage: {item.stage.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                    {item.overdueDays > 0 ? `${item.overdueDays}d Overdue` : 'Due Today'}
                  </span>
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white self-end sm:self-center">
                  {formatPaise(item.amountPaise)}
                </div>
              </div>

              {/* Ready Message Box */}
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
                  Ready Message (Language: {item.customer.preferredLanguage?.toUpperCase() || 'EN'})
                </label>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line font-sans leading-relaxed">
                  {item.whatsappText}
                </div>
              </div>

              {/* Action Buttons: WhatsApp, Email, SMS, Mark as Sent, Promise to Pay */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* WhatsApp */}
                  <a
                    href={item.waLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => markReminderSent(item.invoice.id, item.stage.id, 'whatsapp')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Email */}
                  <a
                    href={item.mailLink}
                    onClick={() => markReminderSent(item.invoice.id, item.stage.id, 'email')}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>

                  {/* SMS */}
                  <a
                    href={item.smsLink}
                    onClick={() => markReminderSent(item.invoice.id, item.stage.id, 'sms')}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>SMS</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {/* Promise to Pay */}
                  <button
                    type="button"
                    onClick={() => setActivePromiseModal(item.id)}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>{t.todayFollowups.promiseToPay}</span>
                  </button>

                  {/* Mark as Sent */}
                  <button
                    type="button"
                    onClick={() => markReminderSent(item.invoice.id, item.stage.id, 'manual')}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.todayFollowups.markSent}</span>
                  </button>
                </div>
              </div>

              {/* Promise to Pay Date Picker Modal */}
              {activePromiseModal === item.id && (
                <div className="mt-3 p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Customer promised payment on:
                    </span>
                    <input
                      type="date"
                      value={promisedDate}
                      onChange={(e) => setPromisedDate(e.target.value)}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-semibold"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePromiseSubmit(item.invoice.id)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs"
                    >
                      Pause Ladder Until {formatDate(promisedDate)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePromiseModal(null)}
                      className="px-2 py-1 text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
