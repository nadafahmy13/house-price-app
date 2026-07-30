export function formatIndianPrice(amount: number): string {
  const rupees = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(amount));

  if (amount >= 1e7) {
    return `₹ ${(amount / 1e7).toFixed(2)} Cr`;
  }
  if (amount >= 1e5) {
    return `₹ ${(amount / 1e5).toFixed(2)} Lac`;
  }
  return `₹ ${rupees}`;
}
