import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { APP_CONFIG } from '../data/config.js';
import { validateGstin, GST_STATE_CODES } from '../utils/gstin.js';
import { calculateInvoiceTotals, rupeesToPaise, formatPaise } from '../utils/money.js';
import { addDays, formatDate, getFinancialYearCode } from '../utils/date.js';
import {
  FilePlus,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Printer,
  Save,
  Send,
  Eye,
  Info
} from 'lucide-react';

export default function NewInvoice() {
  const { t, business, customers, createInvoice, demoDate } = useApp();
  const navigate = useNavigate();

  // Selected customer or new customer
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);

  // New customer form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustGstin, setNewCustGstin] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustCreditDays, setNewCustCreditDays] = useState(30);

  // Invoice parameters
  const [invoiceDate, setInvoiceDate] = useState(demoDate);
  const [items, setItems] = useState([
    {
      description: '5-Ply Master Corrugated Shipping Cartons (500x400x300mm)',
      hsn: '4819',
      quantity: 1000,
      unit: 'Boxes',
      rate: '48.00',
      discount: '0.00',
      gstRate: 18
    }
  ]);

  // Determine current active customer info
  const activeCustomer = useMemo(() => {
    if (isAddingNewCustomer) {
      const gstinVal = validateGstin(newCustGstin);
      return {
        id: 'CUST-NEW',
        name: newCustName || 'New Customer',
        gstin: newCustGstin.trim().toUpperCase(),
        address: newCustAddress || 'Address',
        stateCode: gstinVal.valid ? gstinVal.stateCode : '27',
        stateName: gstinVal.valid ? gstinVal.stateName : 'Maharashtra',
        creditDays: Number(newCustCreditDays) || 30
      };
    }
    const found = customers.find(c => c.id === selectedCustomerId);
    return found || customers[0];
  }, [isAddingNewCustomer, selectedCustomerId, customers, newCustName, newCustGstin, newCustAddress, newCustCreditDays]);

  // Validate active customer GSTIN
  const gstinValidation = useMemo(() => {
    if (!activeCustomer.gstin) {
      return { valid: true, isUnregistered: true };
    }
    return validateGstin(activeCustomer.gstin);
  }, [activeCustomer.gstin]);

  // Due Date calculated from invoiceDate + creditDays
  const dueDate = useMemo(() => {
    return addDays(invoiceDate, activeCustomer.creditDays || 30);
  }, [invoiceDate, activeCustomer.creditDays]);

  // Live Line-Item & Tax Calculation
  const calculatedTotals = useMemo(() => {
    const rawItems = items.map(item => ({
      description: item.description,
      hsn: item.hsn,
      quantity: Number(item.quantity) || 1,
      unit: item.unit,
      ratePaise: rupeesToPaise(item.rate),
      discountPaise: rupeesToPaise(item.discount),
      gstRate: Number(item.gstRate) || 0
    }));

    return calculateInvoiceTotals(
      rawItems,
      business.stateCode,
      activeCustomer.stateCode,
      business.registrationType
    );
  }, [items, business.stateCode, activeCustomer.stateCode, business.registrationType]);

  // UPI payment URI for QR Code
  const upiUri = useMemo(() => {
    const rupees = calculatedTotals.grandTotalPaise / 100;
    const nextSeq = 41; // Preview sequence
    const fy = getFinancialYearCode(invoiceDate);
    const invNum = `INV/${fy}/${String(nextSeq).padStart(4, '0')}`;
    return `upi://pay?pa=${encodeURIComponent(business.upiId)}&pn=${encodeURIComponent(business.name)}&am=${rupees.toFixed(2)}&tn=${encodeURIComponent(invNum)}&cu=INR`;
  }, [calculatedTotals.grandTotalPaise, business.upiId, business.name, invoiceDate]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;

  // Item helpers
  const handleItemChange = (index, field, value) => {
    const next = [...items];
    next[index][field] = value;
    setItems(next);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: 'Corrugated Packaging Material',
        hsn: '4819',
        quantity: 500,
        unit: 'Boxes',
        rate: '25.00',
        discount: '0.00',
        gstRate: 18
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Submit
  const handleSaveInvoice = (status = 'sent') => {
    if (isAddingNewCustomer && newCustGstin && !gstinValidation.valid) {
      alert('Please correct the customer GSTIN before proceeding.');
      return;
    }

    const invoiceData = {
      invoiceDate,
      dueDate,
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      customerGstin: activeCustomer.gstin,
      customerAddress: activeCustomer.address,
      placeOfSupplyStateCode: activeCustomer.stateCode,
      placeOfSupplyStateName: activeCustomer.stateName,
      items: calculatedTotals.items,
      isSameState: calculatedTotals.isSameState,
      totalTaxablePaise: calculatedTotals.totalTaxablePaise,
      totalCgstPaise: calculatedTotals.totalCgstPaise,
      totalSgstPaise: calculatedTotals.totalSgstPaise,
      totalIgstPaise: calculatedTotals.totalIgstPaise,
      totalTaxPaise: calculatedTotals.totalTaxPaise,
      roundOffPaise: calculatedTotals.roundOffPaise,
      grandTotalPaise: calculatedTotals.grandTotalPaise,
      totalInWords: calculatedTotals.totalInWords,
      status
    };

    const created = createInvoice(invoiceData);
    navigate(`/invoices?search=${encodeURIComponent(created.invoiceNumber)}`);
  };

  // Check e-invoicing threshold
  const isEInvoicingMandatory = business.turnoverPaise > 500000000; // > ₹5 Crore

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {business.registrationType === 'regular'
              ? t.newInvoice.title
              : (business.registrationType === 'composition' ? 'Bill of Supply' : 'Plain Invoice')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.newInvoice.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSaveInvoice('draft')}
            className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{t.newInvoice.saveDraft}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveInvoice('sent')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{t.newInvoice.sendInvoice}</span>
          </button>
        </div>
      </div>

      {/* E-Invoicing Alert if turnover > 5 Cr */}
      {isEInvoicingMandatory && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-400/40 rounded-xl p-3.5 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">E-Invoicing Note (Turnover Exceeds ₹5 Crore):</span> Under GST notification rules, business turnover exceeds ₹5 Crore. In a live production environment, an Invoice Reference Number (IRN) and signed QR code would be obtained from the Government IRP Portal.
          </div>
        </div>
      )}

      {/* Form Card 1: Customer Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.newInvoice.customerSection}</h3>
          <button
            type="button"
            onClick={() => setIsAddingNewCustomer(!isAddingNewCustomer)}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 underline"
          >
            {isAddingNewCustomer ? t.newInvoice.selectCustomer : t.newInvoice.orAddNew}
          </button>
        </div>

        {!isAddingNewCustomer ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.newInvoice.selectCustomer}
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.gstin ? `(${c.gstin})` : '(Unregistered)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.newInvoice.placeOfSupply}
              </label>
              <div className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between">
                <span>{activeCustomer.state} ({activeCustomer.stateCode})</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {calculatedTotals.isSameState ? 'CGST + SGST (9%+9%)' : 'IGST (18%)'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.invoices.colDue} ({activeCustomer.creditDays} days credit)
              </label>
              <div className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold">
                {formatDate(dueDate)}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.newInvoice.customerName}
              </label>
              <input
                type="text"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="e.g. Pune Paper & Packaging Ltd"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.newInvoice.customerGstin}
              </label>
              <input
                type="text"
                value={newCustGstin}
                onChange={(e) => setNewCustGstin(e.target.value.toUpperCase())}
                placeholder="15-character GSTIN or leave blank"
                className={`w-full px-3 py-2 text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white ${
                  newCustGstin && !gstinValidation.valid
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                }`}
              />
              {newCustGstin && (
                <p className={`text-[11px] mt-1 ${gstinValidation.valid ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {gstinValidation.valid
                    ? `✓ Valid GSTIN: ${gstinValidation.stateName} (Code ${gstinValidation.stateCode})`
                    : `✗ ${gstinValidation.error}`}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.newInvoice.creditDays}
              </label>
              <input
                type="number"
                value={newCustCreditDays}
                onChange={(e) => setNewCustCreditDays(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Card 2: Line Items */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.newInvoice.itemsSection}</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-xs font-semibold px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center gap-1 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.newInvoice.addItem}</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 grid grid-cols-12 gap-2.5 items-end text-xs"
            >
              {/* Description */}
              <div className="col-span-12 sm:col-span-4">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.newInvoice.description}
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
              </div>

              {/* HSN */}
              <div className="col-span-4 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  HSN
                </label>
                <input
                  type="text"
                  value={item.hsn}
                  onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)}
                  className="w-full px-2 py-1.5 font-mono text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
              </div>

              {/* Qty */}
              <div className="col-span-4 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.newInvoice.quantity}
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  className="w-full px-2 py-1.5 text-right bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
              </div>

              {/* Unit */}
              <div className="col-span-4 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Unit
                </label>
                <select
                  value={item.unit}
                  onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                  className="w-full px-1.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                >
                  <option value="Boxes">Boxes</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Sheets">Sheets</option>
                  <option value="Kg">Kg</option>
                </select>
              </div>

              {/* Rate */}
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.newInvoice.rate}
                </label>
                <input
                  type="text"
                  value={item.rate}
                  onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                  className="w-full px-2 py-1.5 text-right font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
              </div>

              {/* GST Rate */}
              <div className="col-span-4 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  GST %
                </label>
                <select
                  value={item.gstRate}
                  onChange={(e) => handleItemChange(idx, 'gstRate', e.target.value)}
                  className="w-full px-1.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white text-center"
                >
                  {APP_CONFIG.gstRates.map(r => (
                    <option key={r.rate} value={r.rate}>{r.rate}%</option>
                  ))}
                </select>
              </div>

              {/* Line Total & Remove */}
              <div className="col-span-4 sm:col-span-2 flex items-center justify-between gap-2">
                <div className="text-right flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatPaise(calculatedTotals.items[idx]?.lineTotalPaise || 0)}
                  </span>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card 3: Summary, GST Breakdown, Round-off & UPI QR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Summary Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Tax Breakdown & Round-Off
          </h3>

          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
            <span>Total Taxable Value</span>
            <span className="font-semibold">{formatPaise(calculatedTotals.totalTaxablePaise)}</span>
          </div>

          {calculatedTotals.isSameState ? (
            <>
              <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                <span>CGST (Central Tax)</span>
                <span className="font-semibold">{formatPaise(calculatedTotals.totalCgstPaise)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                <span>SGST (State Tax - Maharashtra)</span>
                <span className="font-semibold">{formatPaise(calculatedTotals.totalSgstPaise)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
              <span>IGST (Integrated Tax - Interstate)</span>
              <span className="font-semibold">{formatPaise(calculatedTotals.totalIgstPaise)}</span>
            </div>
          )}

          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
            <span>Round Off Adjustment</span>
            <span className="font-semibold">{formatPaise(calculatedTotals.roundOffPaise, true)}</span>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-base text-slate-900 dark:text-white">
            <span>Grand Total</span>
            <span className="text-emerald-600 dark:text-emerald-400">{formatPaise(calculatedTotals.grandTotalPaise)}</span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-600 dark:text-slate-300 text-[11px] italic">
            {calculatedTotals.totalInWords}
          </div>
        </div>

        {/* Right: Counter UPI QR Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
          <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 mb-2">
            {t.newInvoice.upiQrTitle}
          </h4>
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
            <img src={qrImageUrl} alt="UPI QR Code" className="w-32 h-32" />
          </div>
          <p className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-2">
            UPI ID: <span className="font-mono text-emerald-600">{business.upiId}</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Auto-fills amount ({formatPaise(calculatedTotals.grandTotalPaise)}) on customer scan
          </p>
        </div>
      </div>
    </div>
  );
}
