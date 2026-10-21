// ─── Format Utilities ────────────────────────────────────────────────────────
// Consistent number and currency formatting to prevent SSR/CSR hydration mismatch.

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const sym = currency === 'INR' ? '₹' : '$';
  return `${sym}${formatNumber(amount)}`;
}
