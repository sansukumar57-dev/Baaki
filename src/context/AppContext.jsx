import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { APP_CONFIG } from '../data/config.js';
import { DEFAULT_BUSINESS } from '../data/business.js';
import { DEFAULT_CUSTOMERS } from '../data/customers.js';
import { DEFAULT_INVOICES } from '../data/invoices.js';
import { DEFAULT_EXPENSES } from '../data/expenses.js';
import { SAMPLE_BANK_STATEMENT } from '../data/bank-statement.js';
import { REMINDER_TEMPLATES } from '../data/templates.js';
import { getTranslation } from '../i18n/index.js';
import { getDayDifference, getOverdueDays, addDays, formatDate, getFinancialYearCode } from '../utils/date.js';
import { calculateInvoiceTotals, calculateMsmedInterest, formatPaise } from '../utils/money.js';

const AppContext = createContext();

const STORAGE_KEY_PREFIX = 'baaki_v2_';

function loadStorage(key, defaultVal) {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error('Error loading ' + key + ' from storage', e);
    return defaultVal;
  }
}

function saveStorage(key, val) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Error saving ' + key + ' to storage', e);
  }
}

export function AppProvider({ children }) {
  // Demo simulated date
  const [demoDate, setDemoDate] = useState(() => loadStorage('demoDate', APP_CONFIG.defaultDemoDate));

  // Language & UI Preferences
  const [language, setLanguage] = useState(() => loadStorage('language', 'en'));
  const [textSize, setTextSize] = useState(() => loadStorage('textSize', 'normal')); // 'normal' | 'large' | 'xl'

  // Core Data
  const [business, setBusiness] = useState(() => loadStorage('business', DEFAULT_BUSINESS));
  const [customers, setCustomers] = useState(() => loadStorage('customers', DEFAULT_CUSTOMERS));
  const [invoices, setInvoices] = useState(() => loadStorage('invoices', DEFAULT_INVOICES));
  const [expenses, setExpenses] = useState(() => loadStorage('expenses', DEFAULT_EXPENSES));
  const [bankTransactions, setBankTransactions] = useState(() => loadStorage('bankTransactions', SAMPLE_BANK_STATEMENT));
  
  // Inbox for disputes & already-paid claims
  const [inboxItems, setInboxItems] = useState(() => {
    const stored = loadStorage('inboxItems', null);
    if (stored) return stored;
    // Initial dispute from customer 9 (Sai Krupa)
    return [
      {
        id: 'INB-001',
        type: 'dispute',
        invoiceNumber: 'INV/26-27/0014',
        customerId: 'CUST-009',
        customerName: 'Sai Krupa Hardware & Tools',
        createdAt: '2026-09-15',
        status: 'pending', // 'pending' | 'resolved'
        amountPaise: 6796800,
        reason: 'Received 50 damaged corrugated cartons with crushed corner joints in batch #2; awaiting credit note of ₹12,000 before releasing balance payment.',
        contactPerson: 'Nitin Pardeshi (+91 98228 99001)'
      }
    ];
  });

  // What-If Switches for Cash Forecast
  const [whatIfCustomerDelay, setWhatIfCustomerDelay] = useState(false); // CUST-001 delays 30 days
  const [whatIfBigOrder, setWhatIfBigOrder] = useState(false); // New packaging order +₹2.5L
  const [whatIfSupplierDelay, setWhatIfSupplierDelay] = useState(false); // Supplier bill delayed 14 days

  // Configurable ladder
  const [ladderConfig, setLadderConfig] = useState(() => loadStorage('ladderConfig', APP_CONFIG.escalationLadderStages));
  const [safetyBufferPaise, setSafetyBufferPaise] = useState(() => loadStorage('safetyBufferPaise', APP_CONFIG.defaultSafetyBufferPaise));

  // Sync to localStorage
  useEffect(() => saveStorage('demoDate', demoDate), [demoDate]);
  useEffect(() => saveStorage('language', language), [language]);
  useEffect(() => saveStorage('textSize', textSize), [textSize]);
  useEffect(() => saveStorage('business', business), [business]);
  useEffect(() => saveStorage('customers', customers), [customers]);
  useEffect(() => saveStorage('invoices', invoices), [invoices]);
  useEffect(() => saveStorage('expenses', expenses), [expenses]);
  useEffect(() => saveStorage('bankTransactions', bankTransactions), [bankTransactions]);
  useEffect(() => saveStorage('inboxItems', inboxItems), [inboxItems]);
  useEffect(() => saveStorage('ladderConfig', ladderConfig), [ladderConfig]);
  useEffect(() => saveStorage('safetyBufferPaise', safetyBufferPaise), [safetyBufferPaise]);

  // Translation helper
  const t = useMemo(() => getTranslation(language), [language]);

  // Reset Demo to pristine defaults
  const resetDemo = () => {
    localStorage.clear();
    setDemoDate(APP_CONFIG.defaultDemoDate);
    setLanguage('en');
    setTextSize('normal');
    setBusiness(DEFAULT_BUSINESS);
    setCustomers(DEFAULT_CUSTOMERS);
    setInvoices(DEFAULT_INVOICES);
    setExpenses(DEFAULT_EXPENSES);
    setBankTransactions(SAMPLE_BANK_STATEMENT);
    setLadderConfig(APP_CONFIG.escalationLadderStages);
    setSafetyBufferPaise(APP_CONFIG.defaultSafetyBufferPaise);
    setWhatIfCustomerDelay(false);
    setWhatIfBigOrder(false);
    setWhatIfSupplierDelay(false);
    setInboxItems([
      {
        id: 'INB-001',
        type: 'dispute',
        invoiceNumber: 'INV/26-27/0014',
        customerId: 'CUST-009',
        customerName: 'Sai Krupa Hardware & Tools',
        createdAt: '2026-09-15',
        status: 'pending',
        amountPaise: 6796800,
        reason: 'Received 50 damaged corrugated cartons with crushed corner joints in batch #2; awaiting credit note of ₹12,000 before releasing balance payment.',
        contactPerson: 'Nitin Pardeshi (+91 98228 99001)'
      }
    ]);
  };

  // Re-evaluate Invoice Overdue Days and Status based on the Demo Date
  const processedInvoices = useMemo(() => {
    return invoices.map(inv => {
      const isPaid = inv.balancePaise <= 0;
      const isPartPaid = inv.paidPaise > 0 && inv.balancePaise > 0;
      const overdueDays = !isPaid ? getOverdueDays(inv.dueDate, demoDate) : 0;
      const daysUntilDue = !isPaid ? getDayDifference(demoDate, inv.dueDate) : 0;

      let computedStatus = inv.status;
      if (inv.dispute && inv.dispute.status === 'pending') {
        computedStatus = 'disputed';
      } else if (isPaid) {
        computedStatus = 'paid';
      } else if (isPartPaid) {
        computedStatus = overdueDays > 0 ? 'overdue' : 'part_paid';
      } else if (overdueDays > 0) {
        computedStatus = 'overdue';
      } else if (daysUntilDue <= 3 && daysUntilDue >= 0) {
        computedStatus = 'due_soon';
      } else if (inv.status === 'draft') {
        computedStatus = 'draft';
      } else {
        computedStatus = 'sent';
      }

      // Check if ladder is paused
      const isLadderPaused = (inv.dispute && inv.dispute.status === 'pending') ||
        (inv.promiseToPayDate && getDayDifference(demoDate, inv.promiseToPayDate) >= 0);

      // MSMED Interest computation (only for micro/small businesses)
      const msmedInterestPaise = business.udyamRegistered && overdueDays > 0
        ? calculateMsmedInterest(inv.balancePaise, overdueDays, APP_CONFIG.rbiBankRatePercent)
        : 0;

      return {
        ...inv,
        overdueDays,
        daysUntilDue,
        computedStatus,
        isLadderPaused,
        msmedInterestPaise
      };
    });
  }, [invoices, demoDate, business.udyamRegistered]);

  // Dashboard Aggregates & Aging Breakdown
  const dashboardStats = useMemo(() => {
    let toCollectPaise = 0;
    let overduePaise = 0;
    let expectedWeekPaise = 0;
    let expectedMonthPaise = 0;

    let notYetDuePaise = 0;
    let days1_30Paise = 0;
    let days31_60Paise = 0;
    let days61_90Paise = 0;
    let days90PlusPaise = 0;

    processedInvoices.forEach(inv => {
      if (inv.balancePaise > 0 && inv.computedStatus !== 'draft') {
        toCollectPaise += inv.balancePaise;

        if (inv.overdueDays > 0) {
          overduePaise += inv.balancePaise;
          if (inv.overdueDays <= 30) days1_30Paise += inv.balancePaise;
          else if (inv.overdueDays <= 60) days31_60Paise += inv.balancePaise;
          else if (inv.overdueDays <= 90) days61_90Paise += inv.balancePaise;
          else days90PlusPaise += inv.balancePaise;
        } else {
          notYetDuePaise += inv.balancePaise;
          if (inv.daysUntilDue <= 7) expectedWeekPaise += inv.balancePaise;
          if (inv.daysUntilDue <= 30) expectedMonthPaise += inv.balancePaise;
        }
      }
    });

    // Upcoming Expenses in next 30 days
    let upcomingBillsPaise = 0;
    expenses.forEach(exp => {
      upcomingBillsPaise += exp.amountPaise;
    });

    const bankCashPaise = business.openingBankBalancePaise;

    return {
      toCollectPaise,
      overduePaise,
      expectedWeekPaise,
      expectedMonthPaise,
      upcomingBillsPaise,
      bankCashPaise,
      ageing: {
        notYetDuePaise,
        days1_30Paise,
        days31_60Paise,
        days61_90Paise,
        days90PlusPaise
      }
    };
  }, [processedInvoices, expenses, business.openingBankBalancePaise]);

  // 13-Week Cash Forecast Engine
  const cashForecastData = useMemo(() => {
    const weeks = [];
    let currentOpening = business.openingBankBalancePaise;
    let firstShortfallWeek = null;
    let lowestCashPaise = currentOpening;

    // Build 13 consecutive weeks starting from demoDate
    for (let w = 1; w <= 13; w++) {
      const weekStartDate = addDays(demoDate, (w - 1) * 7);
      const weekEndDate = addDays(demoDate, w * 7 - 1);

      // Inflows: Unpaid invoices scheduled on (dueDate + customer's avgDelayDays)
      let expectedInflowPaise = 0;
      const matchingInvoices = [];

      processedInvoices.forEach(inv => {
        if (inv.balancePaise > 0 && inv.computedStatus !== 'draft' && inv.computedStatus !== 'disputed') {
          const cust = customers.find(c => c.id === inv.customerId);
          let delay = cust ? cust.avgDelayDays : 5;

          // Apply What-If: CUST-001 delays 30 days
          if (whatIfCustomerDelay && inv.customerId === 'CUST-001') {
            delay += 30;
          }

          const expectedPayDate = addDays(inv.dueDate, delay);
          if (expectedPayDate >= weekStartDate && expectedPayDate <= weekEndDate) {
            expectedInflowPaise += inv.balancePaise;
            matchingInvoices.push(inv);
          }
        }
      });

      // Apply What-If: Big Order in Week 5 (+₹2.5L)
      if (whatIfBigOrder && w === 5) {
        expectedInflowPaise += 25000000;
      }

      // Outflows: Salaries on 1st, Rent on 5th, Power on 12th, GST on 20th, Supplier bills
      let scheduledOutflowPaise = 0;
      const matchingExpenses = [];

      // Check dates within this 7-day window
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const curDate = addDays(weekStartDate, dayOffset);
        const dayOfMonth = Number(curDate.split('-')[2]);

        expenses.forEach(exp => {
          if (exp.frequency === 'monthly' && exp.dayOfMonth === dayOfMonth) {
            scheduledOutflowPaise += exp.amountPaise;
            matchingExpenses.push({ ...exp, date: curDate });
          } else if (exp.dueDate) {
            let actualDueDate = exp.dueDate;
            // Apply What-If: Supplier bill delayed 14 days
            if (whatIfSupplierDelay && exp.category === 'Raw Materials') {
              actualDueDate = addDays(exp.dueDate, 14);
            }
            if (actualDueDate === curDate) {
              scheduledOutflowPaise += exp.amountPaise;
              matchingExpenses.push({ ...exp, date: curDate });
            }
          }
        });
      }

      const closingCashPaise = currentOpening + expectedInflowPaise - scheduledOutflowPaise;
      if (closingCashPaise < lowestCashPaise) {
        lowestCashPaise = closingCashPaise;
      }

      const isBelowBuffer = closingCashPaise < safetyBufferPaise;
      const isDeficit = closingCashPaise < 0;

      if (isBelowBuffer && firstShortfallWeek === null) {
        firstShortfallWeek = w;
      }

      weeks.push({
        weekNumber: w,
        startDate: weekStartDate,
        endDate: weekEndDate,
        label: `W${w} (${formatDate(weekStartDate, 'short')})`,
        openingPaise: currentOpening,
        inflowPaise: expectedInflowPaise,
        outflowPaise: scheduledOutflowPaise,
        closingPaise: closingCashPaise,
        isBelowBuffer,
        isDeficit,
        inflowInvoices: matchingInvoices,
        outflowExpenses: matchingExpenses
      });

      // Crucial rule: Next week opening cash strictly equals this week's closing cash!
      currentOpening = closingCashPaise;
    }

    // Identify which overdue invoices would cover the gap if collected
    const gapShortfallPaise = firstShortfallWeek ? Math.max(0, safetyBufferPaise - weeks[firstShortfallWeek - 1].closingPaise) : 0;
    const overdueInvoices = processedInvoices
      .filter(i => i.overdueDays > 0 && i.balancePaise > 0 && i.computedStatus !== 'disputed')
      .sort((a, b) => b.balancePaise - a.balancePaise);

    const gapCoveringInvoices = overdueInvoices.filter(i => i.balancePaise >= (gapShortfallPaise > 0 ? gapShortfallPaise : 5000000));

    return {
      weeks,
      firstShortfallWeek,
      lowestCashPaise,
      gapShortfallPaise,
      gapCoveringInvoices
    };
  }, [business.openingBankBalancePaise, processedInvoices, customers, expenses, demoDate, safetyBufferPaise, whatIfCustomerDelay, whatIfBigOrder, whatIfSupplierDelay]);

  // "Chase These First" Prioritization Algorithm
  const chaseList = useMemo(() => {
    const overdueInvoices = processedInvoices.filter(i => i.overdueDays > 0 && i.balancePaise > 0 && i.computedStatus !== 'disputed');

    return overdueInvoices.map(inv => {
      const cust = customers.find(c => c.id === inv.customerId) || {};
      
      // Amount weight (1 to 40 pts)
      const amountScore = Math.min(40, (inv.balancePaise / 10000000) * 15);
      
      // Overdue days weight (1 to 30 pts)
      const overdueScore = Math.min(30, (inv.overdueDays / 45) * 30);
      
      // Customer unreliability weight (1 to 20 pts: Grade C gives 20, Grade B 10, Grade A 5)
      const reliabilityScore = cust.grade === 'C' ? 20 : (cust.grade === 'B' ? 10 : 5);
      
      // Impact on upcoming cash shortfall (10 pts if covers the shortfall)
      const coversShortfall = cashForecastData.firstShortfallWeek && inv.balancePaise >= cashForecastData.gapShortfallPaise;
      const shortfallScore = coversShortfall ? 10 : 0;

      const totalScore = Math.round(amountScore + overdueScore + reliabilityScore + shortfallScore);

      // Plain language explanation for the owner
      const amountStr = formatPaise(inv.balancePaise);
      const delayStr = cust.avgDelayDays ? `usually pays ${cust.avgDelayDays} days late` : 'unpredictable payment pattern';
      let shortfallNote = '';
      if (coversShortfall) {
        shortfallNote = `, covers the cash shortfall in week ${cashForecastData.firstShortfallWeek}`;
      }

      const reason = `${amountStr}, ${inv.overdueDays} days overdue, customer ${delayStr}${shortfallNote}.`;

      return {
        ...inv,
        customer: cust,
        score: totalScore,
        reason,
        coversShortfall
      };
    }).sort((a, b) => b.score - a.score);
  }, [processedInvoices, customers, cashForecastData]);

  // Today's Follow-ups Engine
  // Evaluates every invoice against the escalation ladder stages based on the current demoDate
  const todayFollowups = useMemo(() => {
    const followups = [];

    processedInvoices.forEach(inv => {
      if (inv.balancePaise <= 0 || inv.computedStatus === 'draft' || inv.computedStatus === 'paid') return;
      if (inv.isLadderPaused) return;

      const cust = customers.find(c => c.id === inv.customerId) || {};
      const custLang = cust.preferredLanguage || language || 'en';

      ladderConfig.forEach(stage => {
        let isStageDue = false;
        if (stage.daysOffset < 0) {
          // -3 days heads up
          isStageDue = inv.daysUntilDue === Math.abs(stage.daysOffset);
        } else if (stage.daysOffset === 0) {
          // On due date
          isStageDue = inv.daysUntilDue === 0 && inv.overdueDays === 0;
        } else {
          // Overdue stages: +7, +15, +30, +45 days
          isStageDue = inv.overdueDays >= stage.daysOffset;
        }

        // Check if this stage was already sent
        const alreadySent = (inv.remindersSent || []).some(r => r.stageId === stage.id);

        if (isStageDue && !alreadySent) {
          const tmpl = REMINDER_TEMPLATES[stage.id] || REMINDER_TEMPLATES.heads_up;
          const msgObj = tmpl[custLang] || tmpl.en;

          const payLink = `http://localhost:5173/pay/${inv.token}`;
          const placeholders = {
            '{customerName}': cust.contactPerson || inv.customerName,
            '{invoiceNumbers}': inv.invoiceNumber,
            '{amount}': formatPaise(inv.balancePaise),
            '{daysOverdue}': inv.overdueDays,
            '{dueDate}': formatDate(inv.dueDate),
            '{payLink}': payLink,
            '{businessName}': business.name,
            '{contactPerson}': business.ownerName,
            '{contactPhone}': business.phone
          };

          let whatsappText = msgObj.whatsapp;
          let emailSubject = msgObj.subject;
          let emailBody = msgObj.whatsapp;
          let smsText = msgObj.sms;

          Object.keys(placeholders).forEach(ph => {
            const val = String(placeholders[ph]);
            whatsappText = whatsappText.split(ph).join(val);
            emailSubject = emailSubject.split(ph).join(val);
            emailBody = emailBody.split(ph).join(val);
            smsText = smsText.split(ph).join(val);
          });

          followups.push({
            id: `FLW-${inv.id}-${stage.id}`,
            invoice: inv,
            customer: cust,
            stage,
            amountPaise: inv.balancePaise,
            overdueDays: inv.overdueDays,
            dueDate: inv.dueDate,
            payLink,
            whatsappText,
            emailSubject,
            emailBody,
            smsText,
            waLink: `https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`,
            mailLink: `mailto:${cust.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
            smsLink: `sms:${cust.phone.replace(/[^0-9]/g, '')}?body=${encodeURIComponent(smsText)}`
          });
        }
      });
    });

    return followups;
  }, [processedInvoices, customers, ladderConfig, demoDate, language, business]);

  // Actions
  const markReminderSent = (invoiceId, stageId, channel = 'whatsapp') => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const newReminder = {
        id: `REM-${Date.now()}`,
        stageId,
        date: demoDate,
        channel,
        sentTo: inv.customerName
      };
      const timelineEntry = {
        date: demoDate,
        event: `Follow-up sent (${stageId}) via ${channel}`
      };
      return {
        ...inv,
        remindersSent: [...(inv.remindersSent || []), newReminder],
        timeline: [...(inv.timeline || []), timelineEntry]
      };
    }));
  };

  const recordPromiseToPay = (invoiceId, promiseDate) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      return {
        ...inv,
        promiseToPayDate: promiseDate,
        timeline: [
          ...(inv.timeline || []),
          { date: demoDate, event: `Customer promised to pay on ${formatDate(promiseDate)}. Ladder paused until then.` }
        ]
      };
    }));
  };

  const addDispute = (invoiceNumber, reason, raisedBy = 'Customer') => {
    const inv = invoices.find(i => i.invoiceNumber === invoiceNumber);
    if (!inv) return;

    const newInbox = {
      id: `INB-${Date.now()}`,
      type: 'dispute',
      invoiceNumber,
      customerId: inv.customerId,
      customerName: inv.customerName,
      createdAt: demoDate,
      status: 'pending',
      amountPaise: inv.balancePaise,
      reason,
      contactPerson: raisedBy
    };

    setInboxItems(prev => [newInbox, ...prev]);

    setInvoices(prev => prev.map(i => {
      if (i.invoiceNumber !== invoiceNumber) return i;
      return {
        ...i,
        dispute: {
          raisedAt: demoDate,
          raisedBy,
          reason,
          status: 'pending'
        },
        timeline: [
          ...(i.timeline || []),
          { date: demoDate, event: `Customer raised dispute: ${reason}. Escalation ladder paused.` }
        ]
      };
    }));
  };

  const addAlreadyPaidClaim = (invoiceNumber, utrReference, payDate, amountPaise, notes = '') => {
    const inv = invoices.find(i => i.invoiceNumber === invoiceNumber);
    if (!inv) return;

    const newInbox = {
      id: `INB-${Date.now()}`,
      type: 'already_paid',
      invoiceNumber,
      customerId: inv.customerId,
      customerName: inv.customerName,
      createdAt: demoDate,
      status: 'pending',
      amountPaise: amountPaise || inv.balancePaise,
      utrReference,
      payDate,
      notes,
      contactPerson: inv.customerName
    };

    setInboxItems(prev => [newInbox, ...prev]);

    setInvoices(prev => prev.map(i => {
      if (i.invoiceNumber !== invoiceNumber) return i;
      return {
        ...i,
        timeline: [
          ...(i.timeline || []),
          { date: demoDate, event: `Customer reported payment already made (Ref: ${utrReference}, Date: ${payDate}). Ladder paused pending verification.` }
        ]
      };
    }));
  };

  const resolveInboxItem = (itemId, action, resolutionNote = '') => {
    const item = inboxItems.find(i => i.id === itemId);
    if (!item) return;

    setInboxItems(prev => prev.map(i => i.id === itemId ? { ...i, status: 'resolved', actionTaken: action, resolutionNote } : i));

    if (item.type === 'already_paid') {
      if (action === 'accept') {
        // Mark invoice as paid
        setInvoices(prev => prev.map(inv => {
          if (inv.invoiceNumber !== item.invoiceNumber) return inv;
          const newPayment = {
            id: `PAY-${Date.now()}`,
            date: item.payDate || demoDate,
            amountPaise: item.amountPaise,
            method: 'UPI/Bank Transfer',
            reference: item.utrReference || 'UTR-VERIFIED'
          };
          const newPaid = inv.paidPaise + item.amountPaise;
          return {
            ...inv,
            paidPaise: newPaid,
            balancePaise: Math.max(0, inv.grandTotalPaise - newPaid),
            status: inv.grandTotalPaise - newPaid <= 0 ? 'paid' : 'part_paid',
            payments: [...(inv.payments || []), newPayment],
            timeline: [
              ...(inv.timeline || []),
              { date: demoDate, event: `Payment claim verified and accepted: ₹${formatPaise(item.amountPaise)} credited.` }
            ]
          };
        }));
      }
    } else if (item.type === 'dispute') {
      setInvoices(prev => prev.map(inv => {
        if (inv.invoiceNumber !== item.invoiceNumber) return inv;
        return {
          ...inv,
          dispute: {
            ...inv.dispute,
            status: 'resolved',
            resolution: resolutionNote || action
          },
          timeline: [
            ...(inv.timeline || []),
            { date: demoDate, event: `Dispute resolved (${action}): ${resolutionNote || 'Resuming standard billing cycle'}` }
          ]
        };
      }));
    }
  };

  const createInvoice = (invoiceData) => {
    const nextSeq = invoices.length + 1;
    const fy = getFinancialYearCode(invoiceData.invoiceDate);
    const invoiceNumber = `INV/${fy}/${String(nextSeq).padStart(4, '0')}`;

    const newInvoice = {
      ...invoiceData,
      id: `INV-${String(nextSeq).padStart(4, '0')}`,
      sequenceNumber: nextSeq,
      invoiceNumber,
      paidPaise: 0,
      balancePaise: invoiceData.grandTotalPaise,
      payments: [],
      remindersSent: [],
      token: `tok_${Math.random().toString(36).substring(2, 10)}_${nextSeq}`,
      timeline: [
        { date: invoiceData.invoiceDate, event: `${business.registrationType === 'regular' ? 'Tax Invoice' : 'Bill of Supply'} created and issued.` }
      ]
    };

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const confirmBankMatch = (txnId) => {
    const txn = bankTransactions.find(t => t.id === txnId);
    if (!txn || txn.confirmed) return;

    setBankTransactions(prev => prev.map(t => t.id === txnId ? { ...t, confirmed: true } : t));

    // Update the matched invoices
    if (txn.expectedInvoices && txn.expectedInvoices.length > 0) {
      setInvoices(prev => prev.map(inv => {
        if (!txn.expectedInvoices.includes(inv.invoiceNumber)) return inv;

        let applyPaise = 0;
        if (txn.caseType === 'exact') {
          applyPaise = inv.balancePaise;
        } else if (txn.caseType === 'part_payment') {
          applyPaise = txn.depositPaise;
        } else if (txn.caseType === 'tds_shortfall') {
          // In TDS, customer deducted 2% (₹1,864). So net payment was ₹1,08,112.
          // In accounting, gross amount ₹1,09,976 is cleared: cash received + TDS credit!
          applyPaise = inv.balancePaise;
        } else if (txn.caseType === 'multiple_invoices') {
          applyPaise = inv.balancePaise;
        } else if (txn.caseType === 'overpayment') {
          applyPaise = inv.balancePaise;
        }

        const newPaid = inv.paidPaise + applyPaise;
        const newBalance = Math.max(0, inv.grandTotalPaise - newPaid);

        return {
          ...inv,
          paidPaise: newPaid,
          balancePaise: newBalance,
          status: newBalance <= 0 ? 'paid' : 'part_paid',
          payments: [
            ...(inv.payments || []),
            {
              id: `PAY-BNK-${txn.id}`,
              date: txn.date,
              amountPaise: applyPaise,
              method: 'Bank NEFT/RTGS',
              reference: txn.reference
            }
          ],
          timeline: [
            ...(inv.timeline || []),
            { date: demoDate, event: `Payment of ${formatPaise(applyPaise)} confirmed from bank narration (${txn.narration})` }
          ]
        };
      }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        t,
        language,
        setLanguage,
        textSize,
        setTextSize,
        demoDate,
        setDemoDate,
        business,
        setBusiness,
        customers,
        setCustomers,
        invoices: processedInvoices,
        setInvoices,
        expenses,
        setExpenses,
        bankTransactions,
        setBankTransactions,
        inboxItems,
        ladderConfig,
        setLadderConfig,
        safetyBufferPaise,
        setSafetyBufferPaise,
        dashboardStats,
        cashForecastData,
        chaseList,
        todayFollowups,
        // What-If Switches
        whatIfCustomerDelay,
        setWhatIfCustomerDelay,
        whatIfBigOrder,
        setWhatIfBigOrder,
        whatIfSupplierDelay,
        setWhatIfSupplierDelay,
        // Actions
        resetDemo,
        createInvoice,
        markReminderSent,
        recordPromiseToPay,
        addDispute,
        addAlreadyPaidClaim,
        resolveInboxItem,
        confirmBankMatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
