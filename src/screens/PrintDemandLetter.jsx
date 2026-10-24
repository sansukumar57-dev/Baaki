import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise, rupeesToWordsIndian } from '../utils/money.js';
import { formatDate, addDays } from '../utils/date.js';
import { Printer, ArrowLeft, ShieldAlert, PhoneCall } from 'lucide-react';

export default function PrintDemandLetter() {
  const { id } = useParams();
  const { invoices, business, customers, demoDate } = useApp();

  const invoice = invoices.find(i => i.id === id) || invoices[0];
  const customer = customers.find(c => c.id === invoice.customerId) || {};

  // Checkbox to include MSMED interest in total demand
  const [includeInterest, setIncludeInterest] = useState(false);

  // 7-day payment deadline from letter date
  const deadlineDate = addDays(demoDate, 7);

  // Total demanded
  const totalDemandedPaise = invoice.balancePaise + (includeInterest ? invoice.msmedInterestPaise : 0);

  const rupees = totalDemandedPaise / 100;
  const upiUri = `upi://pay?pa=${encodeURIComponent(business.upiId)}&pn=${encodeURIComponent(business.name)}&am=${rupees.toFixed(2)}&tn=${encodeURIComponent(invoice.invoiceNumber)}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(upiUri)}`;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-4 print:p-0 print:bg-white text-slate-900">
      {/* Print Controls (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <Link to="/invoices" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>
        <div className="flex items-center gap-3">
          {business.udyamRegistered && invoice.msmedInterestPaise > 0 && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
              <input
                type="checkbox"
                checked={includeInterest}
                onChange={(e) => setIncludeInterest(e.target.checked)}
                className="rounded text-emerald-600 w-4 h-4"
              />
              <span>Add MSMED Interest ({formatPaise(invoice.msmedInterestPaise)}) to Total Demanded</span>
            </label>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 p-8 shadow-xl print:shadow-none print:border-none print:p-0 text-slate-900 font-sans text-xs space-y-4">
        {/* Letterhead */}
        <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black text-slate-950 uppercase">{business.name}</h1>
            <p className="text-slate-600 text-[11px] mt-0.5">{business.address}</p>
            <div className="font-mono text-[11px] text-slate-600 mt-1">
              GSTIN: {business.gstin} · Phone: {business.phone} · Email: {business.email}
            </div>
            {business.udyamRegistered && (
              <div className="text-[11px] font-semibold text-emerald-700">
                Udyam Registration: {business.udyamNumber} ({business.enterpriseType})
              </div>
            )}
          </div>
          <div className="text-right text-[11px] font-mono">
            <div><strong>Date of Letter:</strong> {formatDate(demoDate)}</div>
            <div><strong>Reference:</strong> PDL/{invoice.sequenceNumber}/26-27</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-1">
          <h2 className="text-lg font-black tracking-wide uppercase text-slate-950">
            Payment Demand Letter
          </h2>
        </div>

        {/* MANDATORY STATUTORY DISTINCTION (Explicitly Required by Specification) */}
        <div className="p-3 bg-slate-50 border-2 border-slate-800 rounded-lg text-slate-800 text-xs font-semibold leading-relaxed">
          This letter is from {business.name} about money owed for the invoices listed below. It is not a notice from the GST department and not a legal notice from a lawyer.
        </div>

        {/* Addressed To */}
        <div className="pt-2 text-xs">
          <p className="font-bold text-slate-700 uppercase text-[10px]">To,</p>
          <p className="font-bold text-slate-950 text-sm mt-0.5">{invoice.customerName}</p>
          <p className="text-slate-700">Kind Attention: {customer.contactPerson || 'Accounts Department'}</p>
          <p className="text-slate-600">{invoice.customerAddress}</p>
          <p className="font-mono text-[11px] text-slate-600 mt-0.5">GSTIN: {invoice.customerGstin || 'Unregistered'}</p>
        </div>

        {/* Letter Body */}
        <div className="space-y-2.5 text-xs text-slate-800 leading-relaxed">
          <p>Dear Sir / Madam,</p>
          <p>
            We write regarding the outstanding payment for corrugated packaging materials supplied by our firm against the invoice detailed below. As per our agreed commercial terms of 30 days credit, payment was due on <strong>{formatDate(invoice.dueDate)}</strong> and is now <strong>{invoice.overdueDays} days overdue</strong>.
          </p>

          {/* Invoice Statement Table */}
          <table className="w-full text-left border-collapse border border-slate-400 my-2 text-xs">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-400">
                <th className="p-2 border-r border-slate-400">Invoice Number</th>
                <th className="p-2 border-r border-slate-400 text-center">Invoice Date</th>
                <th className="p-2 border-r border-slate-400 text-right">Invoice Amount</th>
                <th className="p-2 border-r border-slate-400 text-right">Part Payments</th>
                <th className="p-2 border-r border-slate-400 text-right font-black">Principal Balance Owed</th>
                <th className="p-2 text-center">Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="p-2 border-r border-slate-300 font-mono font-bold">{invoice.invoiceNumber}</td>
                <td className="p-2 border-r border-slate-300 text-center">{formatDate(invoice.invoiceDate)}</td>
                <td className="p-2 border-r border-slate-300 text-right font-mono">{formatPaise(invoice.grandTotalPaise)}</td>
                <td className="p-2 border-r border-slate-300 text-right font-mono text-emerald-700">
                  {invoice.paidPaise > 0 ? formatPaise(invoice.paidPaise) : 'Nil'}
                </td>
                <td className="p-2 border-r border-slate-300 text-right font-mono font-black text-slate-950">
                  {formatPaise(invoice.balancePaise)}
                </td>
                <td className="p-2 text-center font-bold text-rose-600">{invoice.overdueDays} days</td>
              </tr>
            </tbody>
          </table>

          {/* MSMED Statutory Interest Clause (if Udyam registered) */}
          {business.udyamRegistered && (
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-1">
              <div className="font-bold text-slate-950">Statutory Notice under MSMED Act, 2006:</div>
              <p className="text-slate-700">
                Under Section 15 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, buyers are required to pay micro and small suppliers within the agreed period, which cannot exceed 45 days. Under Section 16, interest applies on late payment computed as compound interest with monthly rests at three times the RBI bank rate (Bank Rate: 6.75% p.a. as per rbi.org.in; Penalty Rate: 20.25% p.a.).
              </p>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-mono font-semibold">
                <span>Accrued Statutory Interest (Separate Figure):</span>
                <span className="text-rose-600">{formatPaise(invoice.msmedInterestPaise)}</span>
              </div>
            </div>
          )}

          {/* Deadline Paragraph */}
          <p>
            We kindly request you to remit the outstanding sum of <strong>{formatPaise(totalDemandedPaise)}</strong> ({rupeesToWordsIndian(totalDemandedPaise)}) on or before <strong>{formatDate(deadlineDate)}</strong> (within 7 days from the date of this letter).
          </p>

          {/* Payment Instructions & QR */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-300 rounded-lg mt-3">
            <div>
              <div className="font-bold text-slate-950 text-xs mb-1">How to Settle this Balance:</div>
              <div className="text-[11px] space-y-0.5 font-mono">
                <div><strong>Bank Name:</strong> {business.bankName}</div>
                <div><strong>Account Name:</strong> {business.name}</div>
                <div><strong>Current A/C:</strong> {business.accountNumber}</div>
                <div><strong>IFSC:</strong> {business.ifsc}</div>
                <div><strong>Branch:</strong> {business.bankBranch}</div>
                <div><strong>UPI ID:</strong> {business.upiId}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end text-right">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Scan to Pay via UPI</span>
                <span className="font-black text-sm text-slate-950 block">{formatPaise(totalDemandedPaise)}</span>
              </div>
              <img src={qrImageUrl} alt="UPI QR Code" className="w-20 h-20 border border-slate-300 rounded" />
            </div>
          </div>

          {/* Dispute Contact */}
          <p className="text-slate-700 pt-1">
            If there is any discrepancy in this account or if you have already initiated this remittance, please contact our proprietor <strong>{business.ownerName}</strong> immediately at <strong>{business.phone}</strong> or by email at <strong>{business.email}</strong> so we may update our records.
          </p>

          <p className="pt-2">We appreciate your prompt cooperation in resolving this matter amicably.</p>
        </div>

        {/* Signoff */}
        <div className="pt-6 flex justify-between items-end">
          <div className="text-slate-500 text-[10px]">
            This document is issued by the supplier directly for commercial accounts reconciliation.
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-950">Yours faithfully,</div>
            <div className="font-bold text-slate-950 mt-1">For {business.name}</div>
            <div className="mt-8 font-bold text-slate-950">{business.ownerName}</div>
            <div className="text-slate-500 text-[10px]">{business.designation}</div>
          </div>
        </div>

        {/* 45 Days Overdue Next Steps Advisory (only shows if 45+ days overdue) */}
        {invoice.overdueDays >= 45 && (
          <div className="mt-6 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 no-print space-y-1">
            <div className="font-bold flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Owner Advisory Note (Invoice is {invoice.overdueDays} days overdue):</span>
            </div>
            <p>
              As this invoice has exceeded 45 days past credit term, suggested next steps for Sharma Packaging:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
              <li>Place a direct phone call with {customer.contactPerson || 'Customer Principal'}.</li>
              <li>Consult an advocate regarding formal civil recovery remedies.</li>
              <li>As an Udyam-registered enterprise, file a delayed payment reference online at the <strong>MSME Samadhaan Portal (samadhaan.msme.gov.in)</strong> under Section 18 of the MSMED Act, 2006.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
