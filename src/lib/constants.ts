export const Colors = {
  navy: "#1a1a2e",
  teal: "#16a085",
  paid: "#27ae60",
  overdue: "#e74c3c",
  credit: "#c0392b",
  debit: "#27ae60",
  muted: "#7f8c8d",
  surface: "#f5f6fa",
  white: "#ffffff",
  text: "#2c3e50",
  border: "#e5e7eb",
  red50: "#fef2f2",
} as const;

export const PIN_LENGTH = 4;
export const MAX_PAYMENT_DAY = 28;
export const DEFAULT_REMINDER_DAYS = 1;

export const PAYMENT_MONTH_OPTIONS = [1, 2, 3] as const;
export type PaymentMonths = (typeof PAYMENT_MONTH_OPTIONS)[number];

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return inrFormatter.format(amount);
}
