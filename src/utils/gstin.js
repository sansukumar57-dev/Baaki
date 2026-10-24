// GSTIN validation, check digit calculation, and state lookup

export const GST_STATE_CODES = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra & Nagar Haveli and Daman & Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '36': 'Telangana',
  '37': 'Andhra Pradesh'
};

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Calculates the official 15th check digit for a 14-character GSTIN prefix.
 */
export function computeGstinCheckDigit(gstin14) {
  if (!gstin14 || gstin14.length !== 14) return null;
  const upper = gstin14.toUpperCase();
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const code = CHARS.indexOf(upper[i]);
    if (code === -1) return null;
    const factor = (i % 2 === 0) ? 1 : 2;
    const product = code * factor;
    sum += Math.floor(product / 36) + (product % 36);
  }
  const checkCode = (36 - (sum % 36)) % 36;
  return CHARS[checkCode];
}

/**
 * Validates full 15-character GSTIN format and check digit.
 */
export function validateGstin(gstin) {
  if (!gstin || typeof gstin !== 'string') {
    return { valid: false, error: 'GSTIN is required' };
  }
  const clean = gstin.trim().toUpperCase();
  if (clean.length !== 15) {
    return { valid: false, error: 'GSTIN must be exactly 15 characters' };
  }
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!regex.test(clean)) {
    return { valid: false, error: 'Invalid GSTIN pattern (State Code + PAN + Entity + Z + Check Digit)' };
  }
  const expectedCheck = computeGstinCheckDigit(clean.substring(0, 14));
  if (clean[14] !== expectedCheck) {
    return { valid: false, error: `Invalid check digit. Expected "${expectedCheck}", found "${clean[14]}"` };
  }
  const stateCode = clean.substring(0, 2);
  const stateName = GST_STATE_CODES[stateCode] || 'Unknown State';
  return { valid: true, stateCode, stateName, gstin: clean };
}

/**
 * Creates a valid 15-character GSTIN from a 14-character prefix.
 */
export function makeValidGstin(gstin14) {
  const cd = computeGstinCheckDigit(gstin14);
  return gstin14.toUpperCase() + cd;
}
