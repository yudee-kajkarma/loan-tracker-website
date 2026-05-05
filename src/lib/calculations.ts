import { format } from "date-fns";
import { MAX_PAYMENT_DAY } from "./constants";
import type { PaymentInsert } from "../types";

/**
 * Bullet-payment calculation.
 * total_interest = principal × monthly_rate × months / 100
 * total_amount   = principal + total_interest
 */
export function calculateBulletPayment(
  principal: number,
  monthlyRate: number,
  months: number,
): { totalInterest: number; totalAmount: number } {
  const totalInterest = (principal * monthlyRate * months) / 100;
  const totalAmount = principal + totalInterest;
  return {
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

/**
 * Generate a one-row payment schedule for a bullet-payment loan.
 * Due date = start_date + months months, on paymentDay (capped at 28).
 */
export function generateBulletPayment(
  loanId: string,
  userId: string,
  startDate: Date,
  paymentDay: number,
  months: number,
  totalAmount: number,
): PaymentInsert[] {
  const day = Math.min(paymentDay, MAX_PAYMENT_DAY);
  const dueDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + months,
    day,
  );

  return [
    {
      loan_id: loanId,
      user_id: userId,
      installment_number: 1,
      due_date: format(dueDate, "yyyy-MM-dd"),
      amount: totalAmount,
      is_paid: false,
    },
  ];
}
