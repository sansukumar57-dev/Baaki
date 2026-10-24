import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrintInvoice() {
  const { id } = useParams();
  const { invoices, business } = useApp();

  const invoice = invoices.find(i => i.id === id) || invoices[0];

  const isComposition = business.registrationType === 'composition';
  const isUnregistered = business.registrationType === 'unregistered';

  const title = isComposition
    ? 'BILL OF SUPPLY'
    : (isUnregistered ? 'INVOICE' : 'TAX INVOICE');

  const subtitle = isComposition
    ? 'Composition taxable person, not eligible to collect tax on supplies'
    : '';

  const rupees = invoice.grandTotalPaise / 100;
  const upiUri = `upi://pay?pa=${encodeURIComponent(business.upiId)}&pn=${encodeURIComponent(business.name)}&am=${rupees.toFixed(2)}&tn=${encodeURIComponent(invoice.invoiceNumber)}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(upiUri)}`;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-4 print:p-0 print:bg-white text-slate-900">
      {/* Print Controls (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between no-print">
        <Link to="/invoices" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF (A4)</span>
        </button>
      </div>

      {/* A4 Sheet Container */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 p-8 shadow-xl print:shadow-none print:border-none print:p-0 text-slate-900 font-sans text-xs">
        {/* Header: Title & Subtitle */}
        <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
          <h1 className="text-2xl font-black tracking-wider uppercase">{title}</h1>
          {subtitle && (
            <p className="text-xs font-semibold text-slate-700 italic mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300">
          {/* Supplier Info */}
          <div>
            <h2 className="text-base font-extrabold text-slate-950">{business.name}</h2>
            <p className="text-slate-600 mt-0.5">{business.address}</p>
            <div className="mt-2 space-y-0.5 font-mono text-[11px]">
              <div><strong>GSTIN:</strong> {business.gstin}</div>
              <div><strong>PAN:</strong> {business.pan}</div>
              <div><strong>State:</strong> {business.state} (Code: {business.stateCode})</div>
              <div><strong>Phone:</strong> {business.phone} | <strong>Email:</strong> {business.email}</div>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="text-right">
            <div className="inline-block text-left bg-slate-50 border border-slate-300 p-3 rounded-lg space-y-1 font-mono text-[11px]">
              <div><strong>Invoice No:</strong> <span className="font-bold text-slate-950">{invoice.invoiceNumber}</span></div>
              <div><strong>Invoice Date:</strong> {formatDate(invoice.invoiceDate)}</div>
              <div><strong>Payment Due Date:</strong> <span className="font-bold text-rose-600">{formatDate(invoice.dueDate)}</span></div>
              <div><strong>Place of Supply:</strong> {invoice.placeOfSupplyStateName} ({invoice.placeOfSupplyStateCode})</div>
              <div><strong>Reverse Charge:</strong> No</div>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-300">
          <div>
            <h3 className="font-bold uppercase text-[10px] text-slate-500 mb-1">Details of Receiver (Billed To):</h3>
            <p className="font-bold text-sm text-slate-950">{invoice.customerName}</p>
            <p className="text-slate-600">{invoice.customerAddress}</p>
            <div className="mt-1 font-mono text-[11px]">
              <strong>GSTIN:</strong> {invoice.customerGstin || 'Unregistered'}
            </div>
          </div>

          <div>
            <h3 className="font-bold uppercase text-[10px] text-slate-500 mb-1">Place of Delivery:</h3>
            <p className="text-slate-800">{invoice.customerAddress}</p>
            <div className="mt-1 font-mono text-[11px]">
              <strong>State:</strong> {invoice.placeOfSupplyStateName} (Code: {invoice.placeOfSupplyStateCode})
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-4">
          <table className="w-full text-left border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-400">
                <th className="p-2 border-r border-slate-400 text-center w-8">#</th>
                <th className="p-2 border-r border-slate-400">Description of Goods</th>
                <th className="p-2 border-r border-slate-400 text-center w-16">HSN</th>
                <th className="p-2 border-r border-slate-400 text-right w-16">Qty</th>
                <th className="p-2 border-r border-slate-400 text-right w-20">Rate (₹)</th>
                <th className="p-2 border-r border-slate-400 text-right w-24">Taxable (₹)</th>
                {invoice.isSameState ? (
                  <>
                    <th className="p-2 border-r border-slate-400 text-right w-16">CGST</th>
                    <th className="p-2 border-r border-slate-400 text-right w-16">SGST</th>
                  </>
                ) : (
                  <th className="p-2 border-r border-slate-400 text-right w-20">IGST</th>
                )}
                <th className="p-2 text-right w-24">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {invoice.items.map((it, idx) => (
                <tr key={idx} className="border-b border-slate-300">
                  <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-300 font-medium">{it.description}</td>
                  <td className="p-2 border-r border-slate-300 text-center font-mono text-[11px]">{it.hsn}</td>
                  <td className="p-2 border-r border-slate-300 text-right">{it.quantity} {it.unit}</td>
                  <td className="p-2 border-r border-slate-300 text-right font-mono">{formatPaise(it.ratePaise)}</td>
                  <td className="p-2 border-r border-slate-300 text-right font-mono">{formatPaise(it.taxablePaise)}</td>
                  {invoice.isSameState ? (
                    <>
                      <td className="p-2 border-r border-slate-300 text-right font-mono text-[11px]">
                        {formatPaise(it.cgstPaise)} ({it.cgstRate}%)
                      </td>
                      <td className="p-2 border-r border-slate-300 text-right font-mono text-[11px]">
                        {formatPaise(it.sgstPaise)} ({it.sgstRate}%)
                      </td>
                    </>
                  ) : (
                    <td className="p-2 border-r border-slate-300 text-right font-mono text-[11px]">
                      {formatPaise(it.igstPaise)} ({it.igstRate}%)
                    </td>
                  )}
                  <td className="p-2 text-right font-mono font-bold">{formatPaise(it.lineTotalPaise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300">
          <div>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Amount Chargeable (in words):</span>
              <p className="font-bold text-slate-900 italic text-xs leading-snug">{invoice.totalInWords}</p>
            </div>

            {/* Bank details & UPI QR */}
            <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 border border-slate-300 rounded-lg">
              <img src={qrImageUrl} alt="Scan to pay" className="w-20 h-20 border border-slate-300 rounded" />
              <div className="text-[11px] space-y-0.5">
                <div className="font-bold text-slate-950">Bank Payment Details:</div>
                <div>Bank: {business.bankName}</div>
                <div>A/C: <span className="font-mono font-bold">{business.accountNumber}</span></div>
                <div>IFSC: <span className="font-mono font-bold">{business.ifsc}</span></div>
                <div>UPI ID: <span className="font-mono font-bold">{business.upiId}</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-right font-mono">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-sans text-slate-600">Total Taxable Value:</span>
              <span className="font-bold">{formatPaise(invoice.totalTaxablePaise)}</span>
            </div>
            {invoice.isSameState ? (
              <>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-sans text-slate-600">Central Tax (CGST):</span>
                  <span>{formatPaise(invoice.totalCgstPaise)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-sans text-slate-600">State Tax (SGST - Maharashtra):</span>
                  <span>{formatPaise(invoice.totalSgstPaise)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-sans text-slate-600">Integrated Tax (IGST):</span>
                <span>{formatPaise(invoice.totalIgstPaise)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="font-sans text-slate-600">Round Off:</span>
              <span>{formatPaise(invoice.roundOffPaise, true)}</span>
            </div>
            <div className="flex justify-between py-2 border-b-2 border-slate-900 text-sm font-black text-slate-950">
              <span className="font-sans">Grand Total:</span>
              <span>{formatPaise(invoice.grandTotalPaise)}</span>
            </div>
          </div>
        </div>

        {/* Declarations & Signatures */}
        <div className="grid grid-cols-2 gap-4 pt-4 text-[11px]">
          <div>
            <h4 className="font-bold uppercase text-[10px] text-slate-500 mb-1">Terms & Conditions:</h4>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
              <li>Goods once sold will not be taken back or exchanged.</li>
              <li>Payment is strictly due within 30 days from the invoice date.</li>
              <li>Interest under MSMED Act 2006 applies on delayed payments past credit terms.</li>
              <li>Subject to Pune jurisdiction only.</li>
            </ol>
          </div>

          <div className="text-right flex flex-col justify-between h-28">
            <div className="font-bold text-slate-900">
              For {business.name}
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-slate-950">{business.ownerName}</div>
              <div className="text-slate-500 text-[10px]">{business.designation} / Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
