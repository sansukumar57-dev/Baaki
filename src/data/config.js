// Baaki App Configuration & Legal/Regulatory Parameters

export const APP_CONFIG = {
  appName: 'Baaki',
  tagline: 'The Small Business Invoice Chase & Cash Flow Defender',
  version: '2.0.0',

  // GST Rates per line item (Note: check current GST rates and rules on cbic-gst.gov.in)
  // Main rates since 22 September 2025: 0%, 5%, 18%, plus 3% (precious goods) and 40% (sin/demerit goods).
  gstRates: [
    { rate: 0, label: '0% (Exempt / Nil Rated)' },
    { rate: 3, label: '3% (Special Goods)' },
    { rate: 5, label: '5% (Essential Packaging / Paperboard)' },
    { rate: 18, label: '18% (Standard Rate - Corrugated Boxes & Cartons)' },
    { rate: 40, label: '40% (Demerit / Special Cess)' }
  ],
  defaultGstRate: 18,

  // RBI Bank Rate (Note: check rbi.org.in - MSMED Act 2006 penalties are computed at 3x this rate)
  rbiBankRatePercent: 6.75, // MSMED compound interest rate: 3 x 6.75% = 20.25% p.a.

  // Cash Flow Safety Buffer in paise (₹2,00,000)
  defaultSafetyBufferPaise: 20000000,

  // Payment Demand Letter parameters
  demandLetterDeadlineDays: 7,

  // Escalation Ladder standard stages
  escalationLadderStages: [
    {
      id: 'heads_up',
      daysOffset: -3, // 3 days before due date
      title: 'Friendly Heads-up',
      titleHi: 'मित्रतापूर्ण पूर्व सूचना',
      titleMr: 'मैत्रीपूर्ण पूर्वसूचना',
      channel: 'whatsapp',
      autoAllowed: true,
      description: 'Polite advance reminder before payment deadline'
    },
    {
      id: 'due_date',
      daysOffset: 0, // On due date
      title: 'Due Date Reminder',
      titleHi: 'नियत तिथि अनुस्मारक',
      titleMr: 'देय दिनांक स्मरणपत्र',
      channel: 'whatsapp',
      autoAllowed: true,
      description: 'Polite reminder on the day payment is due'
    },
    {
      id: 'firm_reminder',
      daysOffset: 7, // 7 days overdue
      title: 'Firmer Reminder',
      titleHi: 'दृढ़ अनुस्मारक (7 दिन बाक़ी)',
      titleMr: 'ठोस स्मरणपत्र (७ दिवस थकीत)',
      channel: 'whatsapp',
      autoAllowed: false,
      description: 'Clear notice requesting immediate settlement'
    },
    {
      id: 'final_reminder',
      daysOffset: 15, // 15 days overdue
      title: 'Final Reminder + Call Prompt',
      titleHi: 'अंतिम अनुस्मारक + फ़ोन कॉल',
      titleMr: 'अंतिम स्मरणपत्र + फोन कॉल सूचना',
      channel: 'email',
      autoAllowed: false,
      description: 'Formal reminder prompting owner to call customer directly'
    },
    {
      id: 'demand_letter',
      daysOffset: 30, // 30 days overdue
      title: 'Payment Demand Letter',
      titleHi: 'भुगतान मांग पत्र (डिमांड लेटर)',
      titleMr: 'पेमेंट मागणी पत्र (डिमांड लेटर)',
      channel: 'letter',
      autoAllowed: false,
      description: 'Formal payment demand letter with MSMED clause (non-legal notice)'
    },
    {
      id: 'next_steps',
      daysOffset: 45, // 45 days overdue
      title: 'Legal Consult & MSME Samadhaan',
      titleHi: 'अगले क़दम: विधिक परामर्श व समाधान',
      titleMr: 'पुढील पावले: कायदेशीर सल्ला व समाधान',
      channel: 'internal',
      autoAllowed: false,
      description: 'Advisory workflow: call customer, consult lawyer, MSME Samadhaan portal'
    }
  ],

  // Default Demo Simulated Date (IST)
  defaultDemoDate: '2026-10-24'
};
