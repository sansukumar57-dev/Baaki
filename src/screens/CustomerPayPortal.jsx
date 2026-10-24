import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatPaise } from '../utils/money.js';
import { formatDate } from '../utils/date.js';
import {
  QrCode,
  CheckCircle,
  AlertTriangle,
  Building2,
  Calendar,
  CreditCard,
  Send,
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function CustomerPayPortal() {
  const { token } = useParams();
  const { invoices, business, addDispute, addAlreadyPaidClaim } = useApp();

  const invoice = invoices.find(i => i.token === token) || invoices[0];

  const [activeTab, setActiveTab] = useState('pay'); // 'pay' | 'already_paid' | 'dispute'

  // Form states
  const [utr, setUtr] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [claimAmount, setClaimAmount] = useState((invoice.balancePaise / 100).toString());
  const [notes, setNotes] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const [disputeReason, setDisputeReason] = useState('');
  const [disputePerson, setDisputePerson] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  // UPI payment URI
  const rupees = invoice.balancePaise / 100;
  const upiUri = `upi://pay?pa=${encodeURIComponent(business.upiId)}&pn=${encodeURIComponent(business.name)}&am=${rupees.toFixed(2)}&tn=${encodeURIComponent(invoice.invoiceNumber)}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!utr.trim()) {
      alert('Please enter your UTR / Payment reference number');
      return;
    }
    const paise = Math.round(parseFloat(claimAmount || '0') * 100);
    addAlreadyPaidClaim(invoice.invoiceNumber, utr.trim(), payDate, paise, notes);
    setClaimSuccess(true);
  };

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      alert('Please enter the reason for dispute');
      return;
    }
    addDispute(invoice.invoiceNumber, disputeReason.trim(), disputePerson.trim() || invoice.customerName);
    setDisputeSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Supplier Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            B
          </div>
          <h1 className="text-xl font-black text-white">{business.name}</h1>
          <p className="text-xs text-slate-400">
            GSTIN: <span className="font-mono text-slate-300">{business.gstin}</span> · Pune, Maharashtra
          </p>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Instant Payment & Dispute Resolution Portal</span>
          </div>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] text-slate-400 font-mono">Invoice Number</span>
              <p className="font-mono font-bold text-base text-white">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Due Date</span>
              <p className="font-bold text-xs text-amber-300">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs text-slate-400">Billed To</span>
              <p className="font-bold text-sm text-slate-200">{invoice.customerName}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Amount Due</span>
              <p className="font-black text-2xl text-emerald-400">{formatPaise(invoice.balancePaise)}</p>
            </div>
          </div>

          {/* Items summary */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-xs space-y-2">
            <div className="text-[11px] uppercase font-bold text-slate-400">Itemized Breakdown</div>
            {invoice.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span>{it.quantity} {it.unit} x {it.description}</span>
                <span className="font-mono font-semibold">{formatPaise(it.lineTotalPaise)}</span>
              </div>
            ))}
            <div className="border-t border-slate-800 pt-1 flex justify-between font-bold text-slate-200">
              <span>Total Invoice Amount</span>
              <span>{formatPaise(invoice.grandTotalPaise)}</span>
            </div>
            {invoice.paidPaise > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Already Paid</span>
                <span>- {formatPaise(invoice.paidPaise)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Selector: Pay via UPI | Already Paid | Something Wrong */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('pay')}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'pay' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pay by UPI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('already_paid')}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'already_paid' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            I've Already Paid
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dispute')}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'dispute' ? 'bg-rose-700 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dispute / Issue
          </button>
        </div>

        {/* Tab 1: Pay by UPI */}
        {activeTab === 'pay' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <h3 className="font-bold text-sm text-white">Scan with any UPI App</h3>
            <p className="text-xs text-slate-400">GPay, PhonePe, Paytm, BHIM, or any Bank UPI app</p>
            <div className="p-4 bg-white rounded-2xl inline-block shadow-md">
              <img src={qrImageUrl} alt="UPI QR Code" className="w-48 h-48 mx-auto" />
            </div>
            <div className="text-xs text-slate-300 font-mono bg-slate-800 py-2 px-3 rounded-lg max-w-sm mx-auto">
              UPI ID: <span className="text-emerald-400 font-bold">{business.upiId}</span>
            </div>
            <a
              href={upiUri}
              className="inline-block w-full max-w-sm py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow transition-colors"
            >
              Open UPI App ({formatPaise(invoice.balancePaise)})
            </a>
          </div>
        )}

        {/* Tab 2: Already Paid Form */}
        {activeTab === 'already_paid' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            {claimSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-white text-base">Payment Details Submitted!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you! Your reference has been submitted to Sharma Packaging. Follow-up reminders are now automatically paused while the accounts team reconciles the bank ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-sm text-white">Report Already Paid</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Submitting your payment details pauses automated reminders immediately.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Bank UTR / Transaction Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. UTR3829104829 or UPI Ref"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Date of Transfer *</label>
                    <input
                      type="date"
                      required
                      value={payDate}
                      onChange={(e) => setPayDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Amount Paid (₹) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Remarks / Bank Name (Optional)</label>
                  <textarea
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Paid via HDFC Netbanking from Account #8901"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Submit Payment Reference & Pause Reminders
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Dispute Form */}
        {activeTab === 'dispute' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            {disputeSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-rose-400 mx-auto" />
                <h3 className="font-bold text-white text-base">Dispute Logged with Accounts</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your query has been lodged directly in the owner's Inbox. The escalation ladder is paused, and Rakesh Sharma will contact you to resolve this.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-sm text-white">Something Wrong with this Invoice?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Flag billing errors, missing goods, or damaged cartons. Pauses collection reminders.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Name & Phone *</label>
                  <input
                    type="text"
                    required
                    value={disputePerson}
                    onChange={(e) => setDisputePerson(e.target.value)}
                    placeholder="e.g. Nitin Pardeshi (+91 98228 99001)"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reason for Dispute *</label>
                  <textarea
                    rows="3"
                    required
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Describe the issue (e.g. quantity discrepancy, rate mismatch, damaged packaging lots, credit note requested)..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Submit Dispute & Pause Collection Ladder
                </button>
              </form>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 underline">
            Return to Baaki Management App
          </Link>
        </div>
      </div>
    </div>
  );
}
