export function formatMoney(amount: number, currencySymbol = "Bs") {
  try {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const fixed = (Math.round(amount * 100) / 100).toFixed(2);
    return `${currencySymbol} ${fixed}`;
  }
}
