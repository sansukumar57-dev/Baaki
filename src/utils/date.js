// Date utilities for Indian Standard Time (IST) & Indian Financial Year

/**
 * Returns Indian Financial Year code string from date, e.g. "26-27"
 */
export function getFinancialYearCode(dateStringOrDate) {
  const d = dateStringOrDate ? new Date(dateStringOrDate) : new Date();
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-indexed: 0 = Jan, 3 = Apr
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;
  const sShort = String(startYear).slice(-2);
  const eShort = String(endYear).slice(-2);
  return `${sShort}-${eShort}`;
}

/**
 * Generates standardized consecutive invoice number: e.g. "INV/26-27/0001"
 */
export function formatInvoiceNumber(sequenceNumber, date) {
  const fy = getFinancialYearCode(date);
  const pad = String(sequenceNumber).padStart(4, '0');
  return `INV/${fy}/${pad}`;
}

/**
 * Computes difference in whole days: (targetDate - fromDate)
 * Positive if targetDate is in future, negative if in past.
 */
export function getDayDifference(dateStringA, dateStringB) {
  const [y1, m1, d1] = dateStringA.split('T')[0].split('-').map(Number);
  const [y2, m2, d2] = dateStringB.split('T')[0].split('-').map(Number);
  const dt1 = new Date(Date.UTC(y1, m1 - 1, d1));
  const dt2 = new Date(Date.UTC(y2, m2 - 1, d2));
  const diffMs = dt2.getTime() - dt1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Computes overdue days: (currentDemoDate - dueDate)
 * If currentDemoDate > dueDate, returns positive integer (overdue). Otherwise 0.
 */
export function getOverdueDays(dueDate, currentDemoDate) {
  const diff = getDayDifference(dueDate, currentDemoDate);
  return Math.max(0, diff);
}

/**
 * Formats YYYY-MM-DD into "24 Oct 2026" or "24/10/2026"
 */
export function formatDate(dateString, format = 'medium') {
  if (!dateString) return '—';
  const clean = dateString.split('T')[0];
  const [y, m, d] = clean.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);

  if (format === 'short') {
    return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * Adds days to a YYYY-MM-DD date string.
 */
export function addDays(dateString, days) {
  const [y, m, d] = dateString.split('T')[0].split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().split('T')[0];
}
