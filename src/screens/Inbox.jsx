import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import {
  Inbox as InboxIcon,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Receipt,
  RotateCcw,
  User,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function Inbox() {
  const { t, inboxItems, resolveInboxItem } = useApp();
  const [filter, setFilter] = useState('pending'); // 'pending' | 'resolved' | 'all'

  const filteredItems = inboxItems.filter(item => {
    if (filter === 'pending') return item.status === 'pending';
    if (filter === 'resolved') return item.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.nav.inbox}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              {inboxItems.filter(i => i.status === 'pending').length} Pending Resolution
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customer billing disputes and "already paid" notifications submitted through customer links
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs self-start sm:self-center">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              filter === 'pending' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              filter === 'resolved' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              filter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Items
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Inbox is Clear!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No claims or disputes matching this filter. When customers flag an issue or report a transfer via their link, it appears here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    item.type === 'dispute'
                      ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                      : 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {item.type === 'dispute' ? 'Customer Dispute' : 'Already Paid Claim'}
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.customerName}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {item.invoiceNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {formatPaise(item.amountPaise)}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    item.status === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                {item.type === 'dispute' ? (
                  <div>
                    <span className="font-bold text-rose-600 dark:text-rose-400">Dispute Reason: </span>
                    <span className="text-slate-800 dark:text-slate-200">{item.reason}</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Raised by: {item.contactPerson} on {formatDate(item.createdAt)} · Escalation ladder paused.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">Claimed Transfer Details:</div>
                    <div className="font-mono text-slate-800 dark:text-slate-200">
                      UTR / Ref: <span className="font-bold">{item.utrReference}</span> · Date: {formatDate(item.payDate)}
                    </div>
                    {item.notes && <p className="text-slate-500 mt-1">Notes: {item.notes}</p>}
                  </div>
                )}
              </div>

              {/* Actions for Owner */}
              {item.status === 'pending' ? (
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  {item.type === 'already_paid' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => resolveInboxItem(item.id, 'reject', 'UTR not reflected in Bank of Maharashtra statement')}
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
                      >
                        Reject Claim (Resume Ladder)
                      </button>
                      <button
                        type="button"
                        onClick={() => resolveInboxItem(item.id, 'accept', 'Payment verified and confirmed in bank')}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow"
                      >
                        Accept & Mark Paid in Ledger
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => resolveInboxItem(item.id, 'reject', 'Goods inspected: packaging meets purchase order specifications')}
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
                      >
                        Reject Dispute (Resume Ladder)
                      </button>
                      <button
                        type="button"
                        onClick={() => resolveInboxItem(item.id, 'credit_note', 'Credit Note CN/26-27/0002 issued for ₹12,000')}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow"
                      >
                        Issue Credit Note & Adjust Invoice
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic pt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Resolution: {item.resolutionNote || item.actionTaken}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
