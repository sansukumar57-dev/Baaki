// Money and GST calculations strictly in whole paise (integers)

const indianFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const indianNumberFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

/**
 * Format paise integer into Indian currency string, e.g. 10000000 -> ₹1,00,000.00
 * Or showNoPaise: true -> ₹1,00,000
 */
export function formatPaise(paise, showPaise = false) {
  if (paise === null || paise === undefined || isNaN(paise)) return '₹0';
  const rupees = paise / 100;
  if (!showPaise && paise % 100 === 0) {
    return '₹' + indianNumberFormatter.format(rupees);
  }
  return indianFormatter.format(rupees);
}

/**
 * Convert user input rupees string to integer paise, safely handling 2 decimal places.
 */
export function rupeesToPaise(rupeesInput) {
  if (typeof rupeesInput === 'number') {
    return Math.round(rupeesInput * 100);
  }
  if (!rupeesInput) return 0;
  const clean = String(rupeesInput).replace(/[^0-9.-]/g, '');
  const num = parseFloat(clean);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

/**
 * Convert integer paise to decimal rupees string for input forms.
 */
export function paiseToRupees(paise) {
  if (paise === null || paise === undefined || isNaN(paise)) return '0';
  const r = (paise / 100);
  return Number.isInteger(r) ? r.toString() : r.toFixed(2);
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertChunk(num) {
  let str = '';
  if (num >= 100) {
    str += ONES[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 20) {
    str += TENS[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  if (num > 0) {
    str += ONES[num] + ' ';
  }
  return str.trim();
}

/**
 * Converts whole paise into Indian English words:
 * e.g. 1180000 -> "Rupees Eleven Thousand Eight Hundred Only"
 * e.g. 10000000 -> "Rupees One Lakh Only"
 */
export function rupeesToWordsIndian(paise) {
  if (!paise || paise <= 0) return 'Rupees Zero Only';
  let rupees = Math.floor(paise / 100);
  const remainingPaise = Math.round(paise % 100);

  if (rupees === 0 && remainingPaise > 0) {
    return `${convertChunk(remainingPaise)} Paise Only`;
  }

  const crore = Math.floor(rupees / 10000000);
  rupees %= 10000000;
  const lakh = Math.floor(rupees / 100000);
  rupees %= 100000;
  const thousand = Math.floor(rupees / 1000);
  rupees %= 1000;
  const hundredAndRest = rupees;

  let parts = [];
  if (crore > 0) parts.push(convertChunk(crore) + ' Crore');
  if (lakh > 0) parts.push(convertChunk(lakh) + ' Lakh');
  if (thousand > 0) parts.push(convertChunk(thousand) + ' Thousand');
  if (hundredAndRest > 0) parts.push(convertChunk(hundredAndRest));

  let words = 'Rupees ' + parts.join(' ').trim();
  if (remainingPaise > 0) {
    words += ' and ' + convertChunk(remainingPaise) + ' Paise';
  }
  return words + ' Only';
}

/**
 * Calculates line-item GST and invoice totals in whole paise.
 * @param {Array} items - [{ quantity, ratePaise, discountPaise, gstRate }]
 * @param {string} supplierStateCode - e.g. "27"
 * @param {string} placeOfSupplyStateCode - e.g. "27" (Maharashtra) or "24" (Gujarat)
 * @param {string} registrationType - 'regular' | 'composition' | 'unregistered'
 */
export function calculateInvoiceTotals(items, supplierStateCode, placeOfSupplyStateCode, registrationType = 'regular') {
  const isSameState = String(supplierStateCode) === String(placeOfSupplyStateCode);
  const isGstEligible = registrationType === 'regular';

  let totalTaxablePaise = 0;
  let totalCgstPaise = 0;
  let totalSgstPaise = 0;
  let totalIgstPaise = 0;

  const calculatedItems = (items || []).map(item => {
    const qty = Number(item.quantity) || 1;
    const ratePaise = Number(item.ratePaise) || 0;
    const discountPaise = Number(item.discountPaise) || 0;
    
    // Taxable value = qty * rate - discount (in paise)
    const lineGrossPaise = Math.round(qty * ratePaise);
    const taxablePaise = Math.max(0, lineGrossPaise - discountPaise);
    totalTaxablePaise += taxablePaise;

    const gstRatePercent = isGstEligible ? (Number(item.gstRate) || 0) : 0;

    let cgstRate = 0;
    let sgstRate = 0;
    let igstRate = 0;
    let cgstPaise = 0;
    let sgstPaise = 0;
    let igstPaise = 0;

    if (isGstEligible && gstRatePercent > 0) {
      if (isSameState) {
        cgstRate = gstRatePercent / 2;
        sgstRate = gstRatePercent / 2;
        // CGST & SGST rounded separately to the paisa
        cgstPaise = Math.round((taxablePaise * cgstRate) / 100);
        sgstPaise = Math.round((taxablePaise * sgstRate) / 100);
        totalCgstPaise += cgstPaise;
        totalSgstPaise += sgstPaise;
      } else {
        igstRate = gstRatePercent;
        igstPaise = Math.round((taxablePaise * igstRate) / 100);
        totalIgstPaise += igstPaise;
      }
    }

    const lineTotalPaise = taxablePaise + cgstPaise + sgstPaise + igstPaise;

    return {
      ...item,
      quantity: qty,
      ratePaise,
      discountPaise,
      taxablePaise,
      gstRate: gstRatePercent,
      cgstRate,
      sgstRate,
      igstRate,
      cgstPaise,
      sgstPaise,
      igstPaise,
      lineTotalPaise
    };
  });

  const totalTaxPaise = totalCgstPaise + totalSgstPaise + totalIgstPaise;
  const unroundedTotalPaise = totalTaxablePaise + totalTaxPaise;

  // Round to nearest Rupee (nearest 100 paise)
  const grandTotalPaise = Math.round(unroundedTotalPaise / 100) * 100;
  const roundOffPaise = grandTotalPaise - unroundedTotalPaise;

  return {
    items: calculatedItems,
    isSameState,
    totalTaxablePaise,
    totalCgstPaise,
    totalSgstPaise,
    totalIgstPaise,
    totalTaxPaise,
    unroundedTotalPaise,
    roundOffPaise,
    grandTotalPaise,
    totalInWords: rupeesToWordsIndian(grandTotalPaise)
  };
}

/**
 * Calculates compound interest with monthly rests under MSMED Act Section 16
 * Rate: 3 times the RBI bank rate per annum.
 * Compounded monthly on whole paise.
 */
export function calculateMsmedInterest(principalPaise, overdueDays, annualBankRatePercent = 6.75) {
  if (overdueDays <= 0 || principalPaise <= 0) return 0;
  const penaltyRatePercent = annualBankRatePercent * 3; // e.g. 6.75 * 3 = 20.25%
  const monthlyRate = (penaltyRatePercent / 100) / 12;
  const months = overdueDays / 30.4375; // average month length
  const compoundMultiplier = Math.pow(1 + monthlyRate, months);
  const totalAmountWithInterest = Math.round(principalPaise * compoundMultiplier);
  return Math.max(0, totalAmountWithInterest - principalPaise);
}
