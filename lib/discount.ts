const rawMode = (process.env.NEXT_PUBLIC_GLOBAL_DISCOUNT_MODE ??
  process.env.NEXT_PUBLIC_GLOBAL_DISCOUNT_ENABLED ??
  "ON")
  .toString()
  .trim()
  .toUpperCase();

export const GLOBAL_DISCOUNT_MODE = ["OFF", "FALSE", "0", "NO"].includes(rawMode)
  ? "OFF"
  : "ON";

const rawRate = Number(process.env.NEXT_PUBLIC_GLOBAL_DISCOUNT_RATE ?? "0.15");
export const GLOBAL_DISCOUNT_RATE = Number.isFinite(rawRate)
  ? Math.min(Math.max(rawRate, 0), 0.95)
  : 0.15;

const computedPercent = Math.round(GLOBAL_DISCOUNT_RATE * 100);
export const GLOBAL_DISCOUNT_LABEL =
  process.env.NEXT_PUBLIC_GLOBAL_DISCOUNT_LABEL?.trim() ||
  `follow+like+comenta=${computedPercent}%`;

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function isGlobalDiscountEnabled() {
  return GLOBAL_DISCOUNT_MODE === "ON" && GLOBAL_DISCOUNT_RATE > 0;
}

export function getDiscountedPrice(price: number) {
  return isGlobalDiscountEnabled() ? roundMoney(price * (1 - GLOBAL_DISCOUNT_RATE)) : price;
}

export function getOriginalSubtotal(items: { product: { price: number }; qty: number }[]) {
  return roundMoney(items.reduce((sum, item) => sum + item.product.price * item.qty, 0));
}

export function getDiscountedSubtotal(items: { product: { price: number }; qty: number }[]) {
  return roundMoney(items.reduce((sum, item) => sum + getDiscountedPrice(item.product.price) * item.qty, 0));
}

export function getDiscountPercentLabel() {
  return `${Math.round(GLOBAL_DISCOUNT_RATE * 100)}% OFF`;
}

export function getDiscountCaption() {
  return `(${GLOBAL_DISCOUNT_LABEL})`;
}
