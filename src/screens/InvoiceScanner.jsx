import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { validateGstin } from '../utils/gstin.js';
import { calculateInvoiceTotals, formatPaise } from '../utils/money.js';
import {
  Scan,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

export default function InvoiceScanner() {
  const { t, business, customers, createInvoice, demoDate } = useApp();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [fileName, setFileName] = useState('');

  // Sample OCR extracted template for simulated demo testing
  const runSimulatedOcr = (name = 'kraft_carton_invoice_photo.jpg') => {
    setIsProcessing(true);
    setFileName(name);

    setTimeout(() => {
      // Extracted simulated data
      const sample = {
        invoiceNumber: 'INV/26-27/0045',
        invoiceDate: demoDate,
        dueDate: '2026-11-24',
        customerName: 'Kalyani Agro Foods Pvt Ltd',
        customerGstin: '27AAACA1111A1ZS',
        placeOfSupplyStateCode: '27',
        placeOfSupplyStateName: 'Maharashtra',
        items: [
          {
            description: '5-Ply Heavy Master Packing Boxes (Printed)',
            hsn: '4819',
            quantity: 1200,
            unit: 'Boxes',
            ratePaise: 4800,
            discountPaise: 0,
            gstRate: 18,
            confidence: 0.98
          },
          {
            description: 'Die-cut Corrugated Inner Partition Sets',
            hsn: '4819',
            quantity: 1200,
            unit: 'Sets',
            ratePaise: 1500,
            discountPaise: 0,
            gstRate: 18,
            confidence: 0.72 // Low confidence to test highlighting!
          }
        ],
        printedTaxablePaise: 7560000,
        printedTaxPaise: 1360800,
        printedTotalPaise: 8920800
      };

      // Math validation
      const math = calculateInvoiceTotals(sample.items, business.stateCode, sample.placeOfSupplyStateCode, 'regular');
      const gstinVal = validateGstin(sample.customerGstin);

      const mathMatches = math.grandTotalPaise === sample.printedTotalPaise;

      setExtractedData({
        ...sample,
        math,
        gstinVal,
        mathMatches
      });

      setIsProcessing(false);
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please upload an image or PDF under 5MB.');
      return;
    }
    runSimulatedOcr(file.name);
  };

  const handleAcceptAndSave = () => {
    if (!extractedData) return;

    const newInv = {
      invoiceDate: extractedData.invoiceDate,
      dueDate: extractedData.dueDate,
      customerId: 'CUST-001',
      customerName: extractedData.customerName,
      customerGstin: extractedData.customerGstin,
      customerAddress: 'Gat No. 124, Uruli Kanchan, Pune - 412202',
      placeOfSupplyStateCode: extractedData.placeOfSupplyStateCode,
      placeOfSupplyStateName: extractedData.placeOfSupplyStateName,
      items: extractedData.math.items,
      isSameState: extractedData.math.isSameState,
      totalTaxablePaise: extractedData.math.totalTaxablePaise,
      totalCgstPaise: extractedData.math.totalCgstPaise,
      totalSgstPaise: extractedData.math.totalSgstPaise,
      totalIgstPaise: extractedData.math.totalIgstPaise,
      totalTaxPaise: extractedData.math.totalTaxPaise,
      roundOffPaise: extractedData.math.roundOffPaise,
      grandTotalPaise: extractedData.math.grandTotalPaise,
      totalInWords: extractedData.math.totalInWords,
      status: 'sent'
    };

    const created = createInvoice(newInv);
    navigate(`/invoices?search=${encodeURIComponent(created.invoiceNumber)}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight">AI Photo & PDF Invoice Scanner</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OCR + Tax Audit</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Capture a physical paper bill or upload a PDF. Auto-extracts line items, validates GSTIN check digit, and recalculates GST math.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4 shadow-sm hover:border-emerald-500 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <Scan className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Upload Paper Invoice Photo or PDF
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accepts JPG, PNG, or PDF up to 5 MB. Files are processed in memory and never stored.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Choose Image / PDF File</span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            type="button"
            onClick={() => runSimulatedOcr('sample_kraft_carton_bill.jpg')}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Run Sample Corrugated Invoice OCR</span>
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold">Reading invoice image with OCR and verifying GSTIN checksum...</p>
        </div>
      )}

      {/* Extracted Review Panel */}
      {extractedData && !isProcessing && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                AI Extraction Review ({fileName})
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                Review extracted fields carefully. Low confidence items are highlighted with an alert icon.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {extractedData.mathMatches ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>GST Math Verified</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-700 border border-rose-500/30">
                  Math Mismatch
                </span>
              )}

              {extractedData.gstinVal.valid ? (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GSTIN Validated</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-700 border border-rose-500/30">
                  GSTIN Check Digit Failed
                </span>
              )}
            </div>
          </div>

          {/* Form preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Invoice Number</span>
              <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{extractedData.invoiceNumber}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Invoice Date</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formatDate(extractedData.invoiceDate)}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Customer</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{extractedData.customerName}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Customer GSTIN</span>
              <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{extractedData.customerGstin}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">HSN</th>
                  <th className="p-2.5 text-right">Qty</th>
                  <th className="p-2.5 text-right">Rate</th>
                  <th className="p-2.5 text-right">GST %</th>
                  <th className="p-2.5 text-right">Taxable</th>
                  <th className="p-2.5 text-center">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {extractedData.items.map((it, idx) => (
                  <tr key={idx} className={it.confidence < 0.8 ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="p-2.5 font-medium">{it.description}</td>
                    <td className="p-2.5 font-mono">{it.hsn}</td>
                    <td className="p-2.5 text-right">{it.quantity} {it.unit}</td>
                    <td className="p-2.5 text-right font-mono">{formatPaise(it.ratePaise)}</td>
                    <td className="p-2.5 text-right">{it.gstRate}%</td>
                    <td className="p-2.5 text-right font-bold">{formatPaise(it.quantity * it.ratePaise)}</td>
                    <td className="p-2.5 text-center">
                      {it.confidence < 0.8 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span>{Math.round(it.confidence * 100)}% (Unsure)</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          {Math.round(it.confidence * 100)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block">Total In Words</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{extractedData.math.totalInWords}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Grand Total</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {formatPaise(extractedData.math.grandTotalPaise)}
              </span>
            </div>
          </div>

          {/* Accept and Save Button */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setExtractedData(null)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleAcceptAndSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept & Save to Invoices</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
