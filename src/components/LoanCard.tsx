import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { parseISO, isBefore, startOfDay, format } from "date-fns";
import { formatCurrency } from "../lib/constants";
import { calculateBulletPayment } from "../lib/calculations";
import type { Loan, LoanStatus } from "../types";
import { StatusPill } from "./ui/StatusPill";
import { ProgressBar } from "./ui/ProgressBar";
import { PencilIcon, TrashIcon, PhoneIcon } from "./ui/Icon";

interface LoanCardProps {
  loan: Loan;
  nextDueDate?: string | null;
  onDelete?: (id: string) => void;
}

function getLoanStatus(loan: Loan, nextDueDate?: string | null): LoanStatus {
  if (loan.is_completed) return "completed";
  if (nextDueDate) {
    const today = startOfDay(new Date());
    const due = startOfDay(parseISO(nextDueDate));
    if (isBefore(due, today)) return "overdue";
  }
  return "active";
}

export function LoanCard({ loan, nextDueDate, onDelete }: LoanCardProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const status = getLoanStatus(loan, nextDueDate);
  const { totalAmount } = calculateBulletPayment(
    loan.principal_amount,
    loan.rate_of_interest,
    loan.tenure_months,
  );
  const progress = totalAmount > 0 ? loan.total_paid / totalAmount : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/loan/${loan.id}`)}
      className="relative bg-white rounded-[12px] border border-border p-4 cursor-pointer transition-all hover:shadow-card hover:-translate-y-0.5"
    >
      {/* Hover actions */}
      {hovered && onDelete ? (
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/loan/edit/${loan.id}`);
            }}
            className="w-8 h-8 rounded-full bg-white border border-border text-teal hover:bg-teal/10 flex items-center justify-center"
            aria-label="Edit"
          >
            <PencilIcon size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  `Delete the loan for ${loan.person_name}? This cannot be undone.`,
                )
              ) {
                onDelete(loan.id);
              }
            }}
            className="w-8 h-8 rounded-full bg-white border border-border text-overdue hover:bg-overdue/10 flex items-center justify-center"
            aria-label="Delete"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      ) : null}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3 pr-20">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-[16px] font-semibold text-navy truncate">
            {loan.person_name}
          </h3>
          {loan.person_phone ? (
            <a
              href={`tel:${loan.person_phone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-teal shrink-0"
              aria-label="Call"
            >
              <PhoneIcon size={14} />
            </a>
          ) : null}
        </div>
        <StatusPill status={status} />
      </div>

      {/* Three-column financial detail */}
      <div className="flex justify-between mb-4 text-currency">
        <div>
          <p className="text-[11px] text-muted uppercase tracking-wide font-semibold">
            Principal
          </p>
          <p className="text-[13px] text-navy font-medium">
            {formatCurrency(loan.principal_amount)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted uppercase tracking-wide font-semibold">
            Rate
          </p>
          <p className="text-[13px] text-navy font-medium">
            {loan.rate_of_interest}% / mo
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted uppercase tracking-wide font-semibold">
            Total Due
          </p>
          <p className="text-[13px] text-navy font-medium">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex justify-between mb-1.5 text-[12px] text-muted text-currency">
          <span>Remaining</span>
          <span className="font-medium text-navy">
            {formatCurrency(loan.remaining_amount)}
          </span>
        </div>
        <ProgressBar
          value={progress}
          variant={status === "overdue" ? "overdue" : "paid"}
        />
      </div>

      {/* Footer */}
      {nextDueDate && !loan.is_completed ? (
        <p className="text-[12px] text-muted mt-2">
          Next due: {format(parseISO(nextDueDate), "dd MMM yyyy")}
        </p>
      ) : null}

      <Link to={`/loan/${loan.id}`} className="sr-only">
        View loan
      </Link>
    </div>
  );
}
