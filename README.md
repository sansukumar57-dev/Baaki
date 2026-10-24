# Baaki (बाक़ी / बाकी) — The Small Business Invoice Chase & Cash Flow Defender

> **The Problem**: Small Indian manufacturers supply goods on credit and get paid weeks or months later. Without dedicated accounts teams, business owners lose track of who owes what, hesitate to follow up firmly without damaging relationships, and discover a cash shortage only when payroll or supplier cheques bounce.  
> **Who it is for**: Small Indian enterprises, factories, packaging manufacturers, distributors, and retail businesses (Demonstrated for **Sharma Packaging**, Pune, Maharashtra — 8 employees, 12 business customers, 30-day credit).

---

## 🧭 What It Does (Screen by Screen)

1. **Dashboard (`/`)**: Displays real-time collections (`₹20,00,000+`), overdue ageing bar (1-30, 31-60, 61-90, 90+ days), bank balance, cash shortfall warnings, and top 5 priority invoices to chase today.
2. **Invoices (`/invoices`)**: Searchable, filterable ledger of 40 invoices across 4 months with full audit timelines, payment receipts, and quick links to print documents.
3. **New Invoice (`/new-invoice`)**: Generates GST-compliant invoices with live item calculations, auto CGST/SGST vs IGST detection, GSTIN check-digit verification, round-off, amount in Indian words, and instant UPI QR code.
4. **Customers (`/customers`)**: Directory of 12 business customers with 6-month payment track records, credit limits, average delays, and reliability grades (**Grade A, B, C**) with plain-English explanations.
5. **Today's Follow-ups (`/followups`)**: Actionable reminder queue determined by the escalation ladder against the current date, with 1-tap WhatsApp (`wa.me`), Email (`mailto`), SMS, Snooze, and "Promise to Pay" pausing.
6. **Escalation Ladder (`/ladder`)**: Visual 6-stage recovery pipeline (-3d, 0d, +7d, +15d, +30d, +45d) with multi-lingual template previews in English, Hindi (हिंदी), and Marathi (मराठी).
7. **Customer Pay Portal (`/pay/:token`)**: Zero-login, mobile-optimized customer portal to scan & pay via UPI, submit "I've Already Paid" UTR claims, or raise "Something's Wrong" billing disputes.
8. **Inbox (`/inbox`)**: Central queue for the business owner to review customer disputes and payment claims, with 1-click actions to accept (auto-reconcile or credit note) or reject and resume the ladder.
9. **Bank Reconciliation (`/reconciliation`)**: Automated statement matching engine for deposits against invoices across 6 distinct scenarios, including a 2% TDS deduction shortfall alert (Form 16A request).
10. **13-Week Cash Forecast (`/cash-forecast`)**: Predictive weekly cash flow projection factoring in customer delay patterns, scheduled fixed expenses (salaries on 1st, rent on 5th, electricity on 12th, GST on 20th), buffer alerts, interactive "What-If" switches, and gap-covering invoice recommendations.
11. **Chase These First (`/chase-first`)**: Prioritized ranking matrix scoring invoices based on amount, overdue duration, customer risk grade, and critical impact on bridging upcoming cash shortages.
12. **Evidence Pack (`/documents`)**: Chronological documentary dossier per invoice, exportable as a print-ready A4 legal/recovery evidence pack.
13. **AI Photo Scanner (`/scan`)**: OCR bill scanner simulating invoice photo/PDF capture, extracting line items, auditing GST math, and verifying GSTIN checksums.
14. **Settings (`/settings`)**: Company profile, Udyam registration toggle, safety buffer threshold, demo date fast-forward simulator, language switcher, and 1-click demo reset.

---

## ⚖️ The Money & Tax Rules

- **Whole Paise Integer Storage**: Every monetary figure is stored strictly as an integer in whole paise (`₹1,000.00` = `100000` paise). Decimal floating-point numbers are never used for financial storage.
- **Indian Numbering & Words**: Formatted using `Intl.NumberFormat('en-IN')` (e.g. `₹1,00,000`) and Indian English words (e.g. *"Rupees One Lakh Eighteen Thousand Only"*).
- **GST Calculation & State Codes**:
  - Line Item Taxable Value = `(quantity × ratePaise) - discountPaise`.
  - **Intrastate (Same State)**: When supplier state code (`27` - Maharashtra) matches customer state code (`27`), tax is split equally into **CGST** and **SGST** at half the rate, with each rounded to the nearest paisa separately.
  - **Interstate (Different State)**: When supplied outside Maharashtra (e.g. `24` - Gujarat Chemicals), **IGST** applies at the full rate.
  - Round-off line adjusts the grand total to the nearest whole rupee.
- **Invoice Types by Registration**:
  - Regular GST: Issues **Tax Invoice**.
  - Composition Scheme: Issues **Bill of Supply** with statutory header *"Composition taxable person, not eligible to collect tax on supplies"*.
  - Unregistered: Issues plain commercial invoice without GST.
- **GSTIN Validation**: All GSTINs pass a 15-character regular expression and a modulo-36 check-digit verification algorithm.
- **E-Invoicing**: Triggered when turnover exceeds ₹5 Crore in settings.

---

## 📜 The Payment Demand Letter & Statutory Clarity

- **Title**: Strictly titled **"Payment Demand Letter"**.
- **Mandatory Disclaimer**: Displayed prominently near the top of every letter:
  > *"This letter is from Sharma Packaging about money owed for the invoices listed below. It is not a notice from the GST department and not a legal notice from a lawyer."*
- **Contents**: Lists specific invoice numbers, dates, part payments, balance owed, a firm 7-day payment deadline, bank transfer coordinates, dispute contact details, and a scan-to-pay UPI QR code.
- **MSMED Act, 2006 Statutory Clause**: Because Sharma Packaging is Udyam-registered (UDYAM-MH-26-0034567), the letter incorporates Section 15 (mandatory payment within 45 days) and Section 16 (compound interest with monthly rests at 3× the RBI bank rate — 20.25% p.a.). Interest is displayed as a separate informational figure and is only added to the demanded amount if the owner explicitly ticks the checkbox.
- **45+ Days Escalation Advisory**: Prompts the owner to consult an advocate or file a reference on the **MSME Samadhaan portal** (`samadhaan.msme.gov.in`).

---

## 🔄 Bank Reconciliation & 6 Case Handling

The reconciliation engine processes `bank-statement.csv` and handles six real-world banking cases:
1. **Exact Match**: Direct narration match (`INV/26-27/0013`) and exact amount (`₹49,088.00`).
2. **Part Payment**: Identifies partial receipt (`₹25,000.00` against `₹52,675.00`), keeping the remaining balance open.
3. **Multiple Invoices Covered**: Matches a single RTGS transfer of `₹2,38,242.00` settling two distinct invoices (`INV/26-27/0009` and `INV/26-27/0018`).
4. **TDS Shortfall (Section 194C / 194Q)**: Automatically detects when a payment (`₹1,08,112.00`) is short by exactly 2% of the taxable value (`₹1,864.00`) and displays: *"Possibly TDS deducted: ask the customer for the TDS certificate (Form 16A)"*.
5. **Overpayment**: Flags an excess payment (`₹45,000.00` paid against `₹41,418.00`) and credits `₹3,582.00` to the customer's ledger.
6. **Unmatched Deposit**: Flags unrecognized UPI deposits for manual investigation without touching ledger balances.
> **Safety Rule**: Nothing is marked as paid without explicit owner confirmation.

---

## 📊 13-Week Cash Forecast & Smart Priority Score

- **Predictive Inflows**: Unpaid invoices are mapped to expected cash collection dates: `Expected Date = Due Date + Customer's Historical Delay Days`.
- **Scheduled Outflows**: Factory payroll on the 1st (`₹2,40,000`), facility rent on the 5th (`₹65,000`), electricity on the 12th (`₹48,000`), GSTR-3B liability on the 20th (`₹85,000`), and raw material kraft paper supplier bills.
- **Mathematical Integrity**: `Week N Closing Cash = Week N Opening Cash + Inflows - Outflows`. Each week's closing cash strictly equals the next week's opening cash.
- **Buffer Breach Detection**: Flags the earliest week where cash dips below the ₹2,00,000 safety buffer.
- **Priority Chase Score**: Computed from 4 balanced dimensions:
  `Score = Amount Weight (40%) + Overdue Duration (30%) + Customer Risk Grade (20%) + Cash Gap Recovery Impact (10%)`.

---

## 🚀 How to Run Locally

### 1-Click Launch (Windows)
Double-click `start-all.bat` or run:
```cmd
start-all.bat
```

### Manual Launch
```bash
npm install
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 🌐 Deploying to Vercel or Netlify (Zero 404 Configuration)

### On Vercel
1. Push this project to a GitHub repository.
2. In Vercel, click **Add New Project** and select the repository.
3. Keep default settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. The project includes [vercel.json](file:///C:/Users/prema/Downloads/baaki-mvp/vercel.json) configured with:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
   This ensures customer links like `/pay/:token` and print routes work on direct refresh without 404 errors.

### On Netlify
1. Connect repository to Netlify.
2. Build command: `npm run build`, Publish directory: `dist`.
3. The included [public/_redirects](file:///C:/Users/prema/Downloads/baaki-mvp/public/_redirects) file contains:
   ```
   /*    /index.html   200
   ```
   This routes all Single-Page App URLs cleanly to `index.html`.

---

## ⏱️ 3-Minute Hackathon Judge Demo Script

| Timestamp | Screen / Action | What to Say (Problem & Solution) |
|---|---|---|
| **0:00 - 0:30** | **Dashboard (`/`)** | *"Small business owners in India don't go bankrupt because they lack orders; they fail because money gets stuck in unpaid invoices. Here on the Baaki dashboard, Rakesh Sharma sees ₹20+ Lakhs in receivables and an instant warning that cash will breach the safety buffer in Week 5 due to payroll and raw material commitments."* |
| **0:30 - 0:55** | **13-Week Cash Forecast (`/cash-forecast`)** | *"Traditional accounting reports only look backwards. Baaki's 13-week cash forecast predicts cash shortages weeks before they happen by factoring in each customer's actual payment delay habits. What-if switches let the owner simulate what happens if their biggest customer delays 30 days, and highlights the exact overdue invoices that will bridge the shortfall."* |
| **0:55 - 1:25** | **Today's Follow-ups (`/followups`)** | *"Instead of awkward manual chasing, the escalation ladder gives the owner ready, culturally sensitive reminders in English, Hindi, or Marathi. One tap opens WhatsApp with the exact invoice details and UPI link ready to send."* |
| **1:25 - 1:55** | **Customer Portal (`/pay/:token`) & Inbox (`/inbox`)** | *"When a customer opens their link, they can pay instantly via UPI, submit proof of transfer, or raise a dispute. If they report an issue, the escalation ladder automatically pauses and notifies the owner's Inbox, preventing embarrassing automated messages to unhappy customers."* |
| **1:55 - 2:25** | **Bank Reconciliation (`/reconciliation`)** | *"Reconciling bank statements manually is painful. Baaki automatically detects part payments, dual invoice settlements, overpayments, and shortfalls. Notice this transaction: Baaki flags that the customer deducted exactly 2% TDS on taxable value, advising the owner to collect Form 16A rather than treating it as bad debt."* |
| **2:25 - 2:45** | **Tax Invoice & Demand Letter (`/print/...`)** | *"For legal safety, Baaki generates GST-compliant invoices with automatic CGST/SGST or IGST logic, and formal Payment Demand Letters that carry a strict statutory disclaimer distinguishing them from court legal notices, complete with MSMED Act 2006 interest calculations."* |
| **2:45 - 3:00** | **Demo Date Simulator & Marathi (`/settings`)** | *"Using the demo date simulator, judges can advance time by 7 or 30 days to watch overdue statuses, escalation stages, and cash forecasts update in real-time across English, Hindi, and Marathi."* |

---

## 🛡️ Potential Live Demo Pitfalls & How to Avoid Them

1. **Browser Pop-up Blockers on WhatsApp / Print Links**:
   - *Fix*: The app uses standard inline navigation and safe `target="_blank"` with direct links. Ensure pop-ups are allowed for `localhost` in browser settings.
2. **Accidental Corrupted Demo State**:
   - *Fix*: A single click on the red **"Reset Demo"** button in the top navigation immediately restores all 40 invoices, 12 customers, expenses, and bank transactions to the pristine sample state.
3. **Screen Size Variations on Demo Laptops**:
   - *Fix*: The layout is fully responsive, tested at both 360px mobile width and widescreen 1080p, with a built-in text size adjuster (`A`, `A+`, `A++`) in the top bar.
# Baaki
