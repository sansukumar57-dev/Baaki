import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import {
  Search,
  Filter,
  FileText,
  Printer,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  X,
  Copy,
  Check,
  Send,
  FileSpreadsheet
} from 'lucide-react';

export default function Invoices() {
  const { t, invoices, customers, demoDate, markReminderSent } = useApp();
  const location = useLocation();

  // Parse URL query params
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [overdueFilter, setOverdueFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
        const matchCust = inv.customerName.toLowerCase().includes(q);
        const matchGstin = (inv.customerGstin || '').toLowerCase().includes(q);
        if (!matchNum && !matchCust && !matchGstin) return false;
      }

      // Status
      if (statusFilter !== 'all' && inv.computedStatus !== statusFilter) {
        return false;
      }

      // Customer
      if (customerFilter !== 'all' && inv.customerId !== customerFilter) {
        return false;
      }

      // Overdue Range
      if (overdueFilter === '1_30' && (inv.overdueDays < 1 || inv.overdueDays > 30)) return false;
      if (overdueFilter === '31_60' && (inv.overdueDays < 31 || inv.overdueDays > 60)) return false;
      if (overdueFilter === '61_90' && (inv.overdueDays < 61 || inv.overdueDays > 90)) return false;
      if (overdueFilter === '90_plus' && inv.overdueDays < 91) return false;
      if (overdueFilter === 'not_overdue' && inv.overdueDays > 0) return false;

      return true;
    });
  }, [invoices, search, statusFilter, customerFilter, overdueFilter]);

  const handleCopyLink = (token) => {
    const url = `${window.location.origin}/pay/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const getStatusBadge = (status, overdueDays) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">Paid</span>;
      case 'part_paid':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">Part Paid</span>;
      case 'overdue':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30">{overdueDays}d Overdue</span>;
      case 'due_soon':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">Due Soon</span>;
      case 'disputed':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">Disputed</span>;
      case 'draft':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-500/20 text-slate-700 dark:text-slate-400 border border-slate-500/30">Draft</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">Sent</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.invoices.title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.invoices.subtitle}</p>
        </div>
        <Link
          to="/new-invoice"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs shadow transition-all self-start sm:self-center"
        >
          + {t.nav.newInvoice}
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.invoices.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">{t.invoices.allStatuses}</option>
            <option value="overdue">{t.invoices.statusOverdue}</option>
            <option value="due_soon">{t.invoices.statusDueSoon}</option>
            <option value="part_paid">{t.invoices.statusPartPaid}</option>
            <option value="paid">{t.invoices.statusPaid}</option>
            <option value="disputed">{t.invoices.statusDisputed}</option>
            <option value="sent">{t.invoices.statusSent}</option>
            <option value="draft">{t.invoices.statusDraft}</option>
          </select>

          {/* Customer Filter */}
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">{t.invoices.allCustomers}</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Overdue Ageing Filter */}
          <select
            value={overdueFilter}
            onChange={(e) => setOverdueFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">{t.invoices.filterOverdue}</option>
            <option value="1_30">1 - 30 Days Overdue</option>
            <option value="31_60">31 - 60 Days Overdue</option>
            <option value="61_90">61 - 90 Days Overdue</option>
            <option value="90_plus">90+ Days Overdue</option>
            <option value="not_overdue">Not Overdue</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
          {(search || statusFilter !== 'all' || customerFilter !== 'all' || overdueFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setCustomerFilter('all');
                setOverdueFilter('all');
              }}
              className="text-rose-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-3.5">{t.invoices.colInvoiceNo}</th>
                <th className="py-3 px-3.5">{t.invoices.colCustomer}</th>
                <th className="py-3 px-3.5">{t.invoices.colDate}</th>
                <th className="py-3 px-3.5">{t.invoices.colDue}</th>
                <th className="py-3 px-3.5 text-right">{t.invoices.colTaxable}</th>
                <th className="py-3 px-3.5 text-right">{t.invoices.colTax}</th>
                <th className="py-3 px-3.5 text-right">{t.invoices.colTotal}</th>
                <th className="py-3 px-3.5 text-right">{t.invoices.colBalance}</th>
                <th className="py-3 px-3.5 text-center">{t.invoices.colStatus}</th>
                <th className="py-3 px-3.5 text-center">{t.invoices.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map(inv => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{inv.customerName}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {inv.customerGstin ? `GST: ${inv.customerGstin}` : 'Unregistered'} · {inv.placeOfSupplyStateName} ({inv.placeOfSupplyStateCode})
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400">{formatDate(inv.invoiceDate, 'short')}</td>
                  <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400">{formatDate(inv.dueDate, 'short')}</td>
                  <td className="py-3 px-3.5 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatPaise(inv.totalTaxablePaise)}
                  </td>
                  <td className="py-3 px-3.5 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatPaise(inv.totalTaxPaise)}
                    <span className="block text-[10px] text-slate-600 dark:text-slate-400">
                      {inv.isSameState ? 'CGST+SGST' : 'IGST'}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-slate-900 dark:text-white">
                    {formatPaise(inv.grandTotalPaise)}
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold">
                    <span className={inv.balancePaise > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {formatPaise(inv.balancePaise)}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    {getStatusBadge(inv.computedStatus, inv.overdueDays)}
                  </td>
                  <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                        title="View timeline and print documents"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Invoice Detail Panel */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
            <div className="space-y-6">
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {selectedInvoice.invoiceNumber}
                    </h3>
                    {getStatusBadge(selectedInvoice.computedStatus, selectedInvoice.overdueDays)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Issued: {formatDate(selectedInvoice.invoiceDate)} · Due: {formatDate(selectedInvoice.dueDate)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer & Tax Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px]">Customer Details</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{selectedInvoice.customerName}</p>
                  <p className="text-slate-600 dark:text-slate-300">{selectedInvoice.customerAddress}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    GSTIN: <span className="font-mono font-semibold">{selectedInvoice.customerGstin || 'Unregistered'}</span>
                  </p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px]">Place of Supply</span>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5">
                    {selectedInvoice.placeOfSupplyStateName} (Code: {selectedInvoice.placeOfSupplyStateCode})
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Tax Type: <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedInvoice.isSameState ? 'Intrastate (CGST 9% + SGST 9%)' : 'Interstate (IGST 18%)'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Amounts Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Taxable Value</span>
                  <span className="font-semibold">{formatPaise(selectedInvoice.totalTaxablePaise)}</span>
                </div>
                {selectedInvoice.isSameState ? (
                  <>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>CGST</span>
                      <span className="font-semibold">{formatPaise(selectedInvoice.totalCgstPaise)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>SGST</span>
                      <span className="font-semibold">{formatPaise(selectedInvoice.totalSgstPaise)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>IGST</span>
                    <span className="font-semibold">{formatPaise(selectedInvoice.totalIgstPaise)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Round Off</span>
                  <span className="font-semibold">{formatPaise(selectedInvoice.roundOffPaise, true)}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span>{formatPaise(selectedInvoice.grandTotalPaise)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-rose-600 dark:text-rose-400">
                  <span>Outstanding Balance</span>
                  <span>{formatPaise(selectedInvoice.balancePaise)}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic pt-1">
                  Words: {selectedInvoice.totalInWords}
                </p>
              </div>

              {/* Items Breakdown */}
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 mb-2">Line Items</h4>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2">HSN</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-medium">{item.description}</td>
                          <td className="p-2 font-mono text-[11px]">{item.hsn}</td>
                          <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                          <td className="p-2 text-right">{formatPaise(item.ratePaise)}</td>
                          <td className="p-2 text-right font-bold">{formatPaise(item.lineTotalPaise)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Link Box */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Customer Link (No Login Portal)
                  </div>
                  <button
                    onClick={() => handleCopyLink(selectedInvoice.token)}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
                  >
                    {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 truncate font-mono">
                  {window.location.origin}/pay/{selectedInvoice.token}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 mb-2">Audit Timeline</h4>
                <div className="border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-3 pl-3 text-xs">
                  {(selectedInvoice.timeline || []).map((tl, idx) => (
                    <div key={idx} className="relative">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[17px] top-1.5" />
                      <div className="font-semibold text-slate-900 dark:text-slate-200">{tl.event}</div>
                      <div className="text-[10px] text-slate-400">{formatDate(tl.date)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Print Tax Invoice, Print Demand Letter, Evidence Pack */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 mt-4">
              <Link
                to={`/print/invoice/${selectedInvoice.id}`}
                target="_blank"
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </Link>
              {selectedInvoice.balancePaise > 0 && (
                <Link
                  to={`/print/demand-letter/${selectedInvoice.id}`}
                  target="_blank"
                  className="flex-1 py-2 px-3 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow"
                >
                  <FileText className="w-4 h-4" />
                  <span>Demand Letter</span>
                </Link>
              )}
              <Link
                to={`/print/evidence/${selectedInvoice.id}`}
                target="_blank"
                className="py-2 px-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1"
                title="Print complete evidence pack"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Evidence Pack</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
