// Sample bank statement data representing Bank of Maharashtra Current A/C transactions

export const SAMPLE_BANK_STATEMENT = [
  {
    id: 'TXN-001',
    date: '2026-10-21',
    narration: 'NEFT-BALAJI DAIRY-INV/26-27/0013-MAHB12345',
    reference: 'N295260012345',
    depositPaise: 4908800, // ₹49,088.00 (Exact match)
    caseType: 'exact',
    expectedCustomer: 'Balaji Dairy & Beverages',
    expectedInvoices: ['INV/26-27/0013']
  },
  {
    id: 'TXN-002',
    date: '2026-10-22',
    narration: 'IMPS-SACHIN PATIL MARATHA BAKERY-PART PAY INV 0024',
    reference: 'IMP2610229871',
    depositPaise: 2500000, // ₹25,000.00 (Part payment of ₹52,675)
    caseType: 'part_payment',
    expectedCustomer: 'Maratha Confectioneries & Bakery',
    expectedInvoices: ['INV/26-27/0024']
  },
  {
    id: 'TXN-003',
    date: '2026-10-23',
    narration: 'RTGS-POOJA ELECTRICALS-SETTLEMENT INV/26-27/0009 AND 0018',
    reference: 'R295260098765',
    depositPaise: 23824200, // ₹2,38,242.00 (Covers INV 0009 ₹1,01,952 + INV 0018 ₹1,36,290)
    caseType: 'multiple_invoices',
    expectedCustomer: 'Pooja Electricals & Appliances',
    expectedInvoices: ['INV/26-27/0009', 'INV/26-27/0018']
  },
  {
    id: 'TXN-004',
    date: '2026-10-23',
    narration: 'NEFT-GOYAL PHARMA-INV/26-27/0023-LESS 2 PCT TDS',
    reference: 'N295260033445',
    depositPaise: 10811200, // ₹1,08,112.00 (Grand Total ₹1,09,976 minus 2% TDS on ₹93,200 taxable = ₹1,864)
    caseType: 'tds_shortfall',
    expectedCustomer: 'Goyal Pharma Distributors',
    expectedInvoices: ['INV/26-27/0023'],
    tdsRate: 2
  },
  {
    id: 'TXN-005',
    date: '2026-10-24',
    narration: 'NEFT-SHREE GANESH PLASTICS-INV/26-27/0030',
    reference: 'N295260077889',
    depositPaise: 4500000, // ₹45,000.00 (Invoice is ₹41,418 -> Overpayment of ₹3,582)
    caseType: 'overpayment',
    expectedCustomer: 'Shree Ganesh Plastics & Molds',
    expectedInvoices: ['INV/26-27/0030']
  },
  {
    id: 'TXN-006',
    date: '2026-10-24',
    narration: 'UPI/202610231940/CR/UNKNOWN DEPOSIT/HDFC0001',
    reference: 'UPI4298104592',
    depositPaise: 1500000, // ₹15,000.00 (No match found)
    caseType: 'unmatched',
    expectedCustomer: null,
    expectedInvoices: []
  }
];
