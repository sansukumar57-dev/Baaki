// Recurring and Scheduled Operating Expenses for Sharma Packaging (in whole paise)

export const DEFAULT_EXPENSES = [
  // Recurring Monthly Fixed Expenses
  {
    id: 'EXP-FIXED-01',
    category: 'Salaries',
    title: 'Staff Salaries (8 Factory & Office Employees)',
    payee: 'Factory Staff & Machine Operators',
    dayOfMonth: 1,
    amountPaise: 24000000, // ₹2,40,000 per month on 1st
    frequency: 'monthly',
    isMandatory: true,
    description: '8 staff members wages: 4 machine operators, 2 helpers, 1 dispatcher, 1 accountant'
  },
  {
    id: 'EXP-FIXED-02',
    category: 'Rent',
    title: 'Factory Shed & Office Lease',
    payee: 'Hadapsar Industrial Estate Co-op Society',
    dayOfMonth: 5,
    amountPaise: 6500000, // ₹65,000 per month on 5th
    frequency: 'monthly',
    isMandatory: true,
    description: 'Monthly lease for 4,500 sq.ft covered manufacturing shed'
  },
  {
    id: 'EXP-FIXED-03',
    category: 'Electricity',
    title: 'MSEDCL Industrial High-Tension Power Bill',
    payee: 'Maharashtra State Electricity Distribution Co.',
    dayOfMonth: 12,
    amountPaise: 4800000, // ₹48,000 per month on 12th
    frequency: 'monthly',
    isMandatory: true,
    description: 'Industrial 3-phase power for corrugator & rotary die-cut machines'
  },
  {
    id: 'EXP-FIXED-04',
    category: 'GST Tax',
    title: 'Monthly GSTR-3B Tax Liability Payment',
    payee: 'Government of India (GST Portal)',
    dayOfMonth: 20,
    amountPaise: 8500000, // ₹85,000 per month on 20th
    frequency: 'monthly',
    isMandatory: true,
    description: 'Net monthly GST tax payable after input tax credit (ITC) offset'
  },

  // Scheduled Raw Material Supplier Bills
  {
    id: 'EXP-SUPP-101',
    category: 'Raw Materials',
    title: 'West Coast Paper Mills - Virgin Kraft Paper Reels (140 GSM)',
    payee: 'West Coast Paper Mills Ltd, Dandeli',
    dueDate: '2026-10-28',
    amountPaise: 18500000, // ₹1,85,000
    status: 'pending',
    isMandatory: true,
    description: '12 Metric Tonnes Golden Virgin Kraft paper reels for corrugated fluting'
  },
  {
    id: 'EXP-SUPP-102',
    category: 'Raw Materials',
    title: 'Deccan Chemicals - Modified Corn Starch Gum Powder',
    payee: 'Deccan Chemical & Starch Industries, Kolhapur',
    dueDate: '2026-11-04',
    amountPaise: 5400000, // ₹54,000
    status: 'pending',
    isMandatory: true,
    description: 'Adhesive corrugation gum powder - 40 bags (50kg each)'
  },
  {
    id: 'EXP-SUPP-103',
    category: 'Raw Materials',
    title: 'Shree Sai Wire Products - High Tensile Box Stitching Wire',
    payee: 'Shree Sai Wire Products, Pimpri',
    dueDate: '2026-11-12',
    amountPaise: 3200000, // ₹32,000
    status: 'pending',
    isMandatory: false,
    description: 'Copper coated flat carton stitching wire coils (250 kg)'
  },
  {
    id: 'EXP-SUPP-104',
    category: 'Raw Materials',
    title: 'Bhilosa Printing Inks - Flexographic Water-Based Packaging Inks',
    payee: 'Bhilosa Inks & Coatings Pvt Ltd, Mumbai',
    dueDate: '2026-11-22',
    amountPaise: 4200000, // ₹42,000
    status: 'pending',
    isMandatory: false,
    description: 'Black, Blue and Red flexo printing inks for outer carton branding'
  },
  {
    id: 'EXP-SUPP-105',
    category: 'Raw Materials',
    title: 'Pudumjee Paper - Recycled Fluting Medium Paper Reels',
    payee: 'Pudumjee Paper Products Ltd, Thergaon',
    dueDate: '2026-12-05',
    amountPaise: 16000000, // ₹1,60,000
    status: 'pending',
    isMandatory: true,
    description: '10 MT 120 GSM recycled fluting paper for 3-ply carton inner corrugation'
  }
];
