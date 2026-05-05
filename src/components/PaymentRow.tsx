import { parseISO, isBefore, startOfDay, format } from "date-fns";
import { formatCurrency, Colors } from "../lib/constants";
import type { Payment } from "../types";
import { Button } from "./ui/Button";

interface PaymentRowProps {
  payment: Payment;
  onMarkPaid: (id: string) => void;
  onMarkUnpaid: (id: string) => void;
  isProcessing?: boolean;
}

export function PaymentRow({
  payment,
  onMarkPaid,
  onMarkUnpaid,
  isProcessing,
}: PaymentRowProps) {
  const today = startOfDay(new Date());
  const due = startOfDay(parseISO(payment.due_date));
  const isOverdue = !payment.is_paid && isBefore(due, today);
  const isDueToday = !payment.is_paid && due.getTime() === today.getTime();
  const canMarkPaid = !payment.is_paid && (isOverdue || isDueToday);

  const stripeColor = payment.is_paid
    ? Colors.paid
    : isOverdue
      ? Colors.overdue
      : Colors.teal;

  const statusLabel = payment.is_paid
    ? "Paid"
    : isOverdue
      ? "Overdue"
      : "Upcoming";

  const statusBg = payment.is_paid
    ? "bg-paid"
    : isOverdue
      ? "bg-overdue"
      : "bg-teal";

  return (
    <div
      className="bg-white rounded-[12px] border border-border overflow-hidden flex"
    >
      <div
        className="w-1 shrink-0"
        style={{ backgroundColor: stripeColor }}
      />
      <div className="flex-1 p-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="text-[12px] text-muted">
            Installment #{payment.installment_number}
          </p>
          <p className="text-[12px] text-muted">
            Due {format(parseISO(payment.due_date), "dd MMM yyyy")}
          </p>
        </div>
        <p className="text-[16px] font-semibold text-navy text-currency">
          {formatCurrency(payment.amount)}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize text-white ${statusBg}`}
          >
            {statusLabel}
          </span>
          {payment.is_paid ? (
            <Button
              variant="outline"
              size="sm"
              loading={isProcessing}
              onClick={() => onMarkUnpaid(payment.id)}
            >
              Mark Unpaid
            </Button>
          ) : canMarkPaid ? (
            <Button
              size="sm"
              loading={isProcessing}
              onClick={() => onMarkPaid(payment.id)}
            >
              Mark as Paid
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
