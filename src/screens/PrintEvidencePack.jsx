import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import { Printer, ArrowLeft, ShieldCheck, FileCheck } from 'lucide-react';

export default function PrintEvidencePack() {
  const { id } = useParams();
  const { invoices, business, customers, demoDate } = useApp();

  const invoice = invoices.find(i => i.id === id) || invoices[0];
  const customer = customers.find(c => c.id === invoice.customerId) || {};

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-4 print:p-0 print:bg-white text-slate-900">
      {/* Controls */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between no-print">
        <Link to="/documents" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Documents</span>
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Complete Evidence Dossier (A4)</span>
        </button>
      </div>

      {/* A4 Sheet */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 p-8 shadow-xl print:shadow-none print:border-none print:p-0 text-slate-900 font-sans text-xs space-y-6">
        {/* Dossier Header */}
        <div className="border-b-2 border-slate-900 pb-4 text-center">
          <h1 className="text-xl font-black uppercase tracking-wider text-slate-950">
            Receivables Recovery Evidence Pack & Audit Trail
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Complete documentary dossier of supply, billing, payment demands, and customer interactions
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[11px] font-mono font-bold text-slate-800">
            <span>Dossier Ref: EVP/{invoice.sequenceNumber}/26-27</span>
            <span>·</span>
            <span>Date Generated: {formatDate(demoDate)}</span>
          </div>
        </div>

        {/* Section 1: Parties & Invoice Summary */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-300 rounded-xl">
          <div>
            <h3 className="font-bold text-[10px] uppercase text-slate-500">Creditor / Supplier</h3>
            <p className="font-bold text-sm text-slate-950 mt-0.5">{business.name}</p>
            <p className="text-slate-600">{business.address}</p>
            <p className="font-mono text-[11px] mt-1">GSTIN: {business.gstin} · Udyam: {business.udyamNumber || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-bold text-[10px] uppercase text-slate-500">Debtor / Customer</h3>
            <p className="font-bold text-sm text-slate-950 mt-0.5">{invoice.customerName}</p>
            <p className="text-slate-600">{invoice.customerAddress}</p>
            <p className="font-mono text-[11px] mt-1">GSTIN: {invoice.customerGstin || 'Unregistered'} · Rep: {customer.contactPerson}</p>
          </div>
        </div>

        {/* Section 2: Account Status */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase text-slate-700 border-b border-slate-200 pb-1">
            1. Account Status & Financial Particulars
          </h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Invoice Number</span>
              <span className="font-mono font-bold text-xs text-slate-900">{invoice.invoiceNumber}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Billed</span>
              <span className="font-mono font-bold text-xs text-slate-900">{formatPaise(invoice.grandTotalPaise)}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Part Payments</span>
              <span className="font-mono font-bold text-xs text-emerald-600">{formatPaise(invoice.paidPaise)}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Outstanding Due</span>
              <span className="font-mono font-bold text-xs text-rose-600">{formatPaise(invoice.balancePaise)}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Chronological Audit Trail & Reminders */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase text-slate-700 border-b border-slate-200 pb-1">
            2. Chronological Follow-Up & Escalation Trail
          </h3>
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 w-28">Date</th>
                  <th className="p-2 border-r border-slate-300">Event Description / Notice Stage</th>
                  <th className="p-2 text-right w-24">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(invoice.timeline || []).map((tl, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{formatDate(tl.date)}</td>
                    <td className="p-2 border-r border-slate-200 text-slate-800">{tl.event}</td>
                    <td className="p-2 text-right text-emerald-600 font-bold text-[11px]">Logged</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Dispute / Customer Claims */}
        {invoice.dispute && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs space-y-1">
            <div className="font-bold text-rose-900">3. Customer Dispute / Billing Issue Recorded:</div>
            <p className="text-slate-800">{invoice.dispute.reason}</p>
            <p className="text-[11px] text-slate-500">
              Raised by: {invoice.dispute.raisedBy} on {formatDate(invoice.dispute.raisedAt)} · Status: {invoice.dispute.status}
            </p>
          </div>
        )}

        {/* Section 5: Statutory Declaration */}
        <div className="border-t-2 border-slate-900 pt-4 space-y-4">
          <div>
            <h3 className="font-bold text-xs uppercase text-slate-900">Certificate of Accuracy & Commercial Truth</h3>
            <p className="text-slate-700 text-xs mt-1 leading-relaxed">
              I, {business.ownerName}, Proprietor of {business.name}, hereby certify that the particulars furnished above are true extracts from our books of account maintained in the ordinary course of business. The goods listed in invoice {invoice.invoiceNumber} were duly manufactured and delivered, and the stated balance remains due and unpaid.
            </p>
          </div>

          <div className="flex justify-between items-end pt-4">
            <div className="text-[10px] text-slate-500 font-mono">
              Place: Pune, Maharashtra · Date: {formatDate(demoDate)}
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-950">For {business.name}</div>
              <div className="mt-8 font-bold text-slate-950">{business.ownerName}</div>
              <div className="text-[10px] text-slate-500">{business.designation}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
