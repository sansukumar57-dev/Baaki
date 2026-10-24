// Business Profile for Sharma Packaging, Pune

export const DEFAULT_BUSINESS = {
  name: 'Sharma Packaging',
  tradeName: 'Sharma Corrugated Packaging Works',
  ownerName: 'Rakesh Sharma',
  designation: 'Proprietor',
  employees: 8,
  industry: 'Corrugated Box & Carton Manufacturing',
  address: 'Plot No. 42, Phase-II, Hadapsar Industrial Estate, Pune, Maharashtra - 411013',
  city: 'Pune',
  state: 'Maharashtra',
  stateCode: '27',
  gstin: '27AABCS1234D1ZV', // Validated with modulo 36 check digit 'V'
  pan: 'AABCS1234D',
  registrationType: 'regular', // 'regular' (Tax Invoice) | 'composition' (Bill of Supply) | 'unregistered' (Plain Invoice)
  turnoverPaise: 2400000000, // ₹2.40 Crore (under ₹5 Crore threshold for mandatory e-invoicing)
  udyamRegistered: true,
  udyamNumber: 'UDYAM-MH-26-0034567',
  enterpriseType: 'Micro Enterprise (Manufacturing)',
  phone: '+91 98230 45678',
  email: 'rakesh@sharmapackaging.in',
  bankName: 'Bank of Maharashtra',
  bankBranch: 'Hadapsar Industrial Branch, Pune',
  accountNumber: '60234567890',
  accountType: 'Current Account',
  ifsc: 'MAHB0000452',
  upiId: 'sharmapackaging@icici',
  openingBankBalancePaise: 38500000 // ₹3,85,000 opening cash in bank
};
