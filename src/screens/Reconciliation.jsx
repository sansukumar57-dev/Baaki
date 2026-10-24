import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import {
  Landmark,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  TrendingUp,
  Receipt,
  FileCheck
} from 'lucide-react';

export default function Reconciliation() {
  const { t, bankTransactions, confirmBankMatch } = useApp();
  const [filter, setFilter] = useState('all');

  const getCaseBadge = (caseType) => {
    switch (caseType) {
      case 'exact':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            {t.reconciliation.caseExact}
          </span>
        );
      case 'part_payment':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
            {t.reconciliation.casePart}
          </span>
        );
      case 'multiple_invoices':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
            {t.reconciliation.caseMultiple}
          </span>
        );
      case 'tds_shortfall':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            {t.reconciliation.caseTds}
          </span>
        );
      case 'overpayment':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            {t.reconciliation.caseOverpay}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            {t.reconciliation.caseUnmatched}
          </span>
        );
    }
  };

  const filtered = bankTransactions.filter(txn => {
    if (filter === 'unconfirmed') return !txn.confirmed;
    if (filter === 'confirmed') return txn.confirmed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight">{t.reconciliation.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
              Bank of Maharashtra
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{t.reconciliation.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{t.reconciliation.importCsv}</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                alert('Sample bank statement (bank-statement.csv) is loaded and ready for reconciliation below.');
              }}
            />
          </label>
        </div>
      </div>

      {/* Reconciliation Transactions List */}
      <div className="space-y-4">
        {filtered.map(txn => (
          <div
            key={txn.id}
            className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-4 transition-all ${
              txn.confirmed
                ? 'border-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/10'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            {/* Top Bar: Date, Narration, Amount, Case */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs text-slate-400">{formatDate(txn.date)}</span>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Ref: {txn.reference}
                </span>
                {getCaseBadge(txn.caseType)}
              </div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 self-end sm:self-center">
                + {formatPaise(txn.depositPaise)}
              </div>
            </div>

            {/* Bank Narration */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 font-mono text-xs text-slate-800 dark:text-slate-200">
              <span className="text-slate-400 text-[10px] block font-sans uppercase font-bold">Bank Statement Narration</span>
              {txn.narration}
            </div>

            {/* Matching Intelligence & Anomaly Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Matched Customer & Invoices</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {txn.expectedCustomer || 'Unknown Sender (Unmatched)'}
                </p>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Invoices:</span>
                  {txn.expectedInvoices.length > 0 ? (
                    txn.expectedInvoices.map(inv => (
                      <span key={inv} className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-semibold">
                        {inv}
                      </span>
                    ))
                  ) : (
                    <span className="text-rose-500 italic">None detected</span>
                  )}
                </div>
              </div>

              {/* Special Flags like TDS or Overpayment */}
              <div>
                {txn.caseType === 'tds_shortfall' && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-xs">
                    <div className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Possibly TDS deducted: ask the customer for the TDS certificate (Form 16A)</span>
                    </div>
                    <p className="text-[11px] mt-0.5 text-amber-700 dark:text-amber-400">
                      Payment of {formatPaise(txn.depositPaise)} matches invoice total {formatPaise(10997600)} minus exactly 2% TDS on ₹93,200 taxable value (₹1,864).
                    </p>
                  </div>
                )}

                {txn.caseType === 'overpayment' && (
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-300 dark:border-purple-800 rounded-lg text-purple-800 dark:text-purple-300 text-xs">
                    <span className="font-bold">Overpayment detected: </span>
                    Customer paid {formatPaise(txn.depositPaise)} against invoice amount of {formatPaise(4141800)}.
                    Excess of {formatPaise(358200)} will be credited to customer's ledger balance.
                  </div>
                )}

                {txn.caseType === 'multiple_invoices' && (
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-300 text-xs">
                    <span className="font-bold">Dual Invoice Settlement: </span>
                    Single RTGS payment of {formatPaise(txn.depositPaise)} settles both INV/26-27/0009 ({formatPaise(10195200)}) and INV/26-27/0018 ({formatPaise(13629000)}).
                  </div>
                )}

                {txn.caseType === 'unmatched' && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 rounded-lg text-rose-800 dark:text-rose-300 text-xs">
                    <span className="font-bold">Unmatched Deposit: </span>
                    UPI credit from unknown party. Requires manual verification with Bank of Maharashtra branch.
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Match Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              {txn.confirmed ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.reconciliation.confirmed}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => confirmBankMatch(txn.id)}
                  disabled={txn.caseType === 'unmatched'}
                  className={`px-4 py-2 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors ${
                    txn.caseType === 'unmatched'
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{t.reconciliation.confirmMatch}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
