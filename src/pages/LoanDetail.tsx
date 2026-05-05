import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { useLoanStore } from "../stores/loanStore";
import { calculateBulletPayment } from "../lib/calculations";
import { formatCurrency, Colors } from "../lib/constants";
import { Button } from "../components/ui/Button";
import { TypePill } from "../components/ui/StatusPill";
import { ProgressBar } from "../components/ui/ProgressBar";
import { PaymentRow } from "../components/PaymentRow";
import {
  PencilIcon,
  TrashIcon,
  PhoneIcon,
} from "../components/ui/Icon";

export default function LoanDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    currentLoan,
    payments,
    loading,
    fetchLoanDetail,
    deleteLoan,
    markPaymentPaid,
    markPaymentUnpaid,
    clearCurrent,
  } = useLoanStore();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchLoanDetail(id);
    return () => clearCurrent();
  }, [id, fetchLoanDetail, clearCurrent]);

  if (loading && !currentLoan) {
    return (
      <div className="flex justify-center py-20">
        <span className="inline-block w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
      </div>
    );
  }
  if (!currentLoan) return null;

  const { totalAmount } = calculateBulletPayment(
    currentLoan.principal_amount,
    currentLoan.rate_of_interest,
    currentLoan.tenure_months,
  );
  const progress = totalAmount > 0 ? currentLoan.total_paid / totalAmount : 0;

  const dueDate = (() => {
    const start = parseISO(currentLoan.start_date);
    return new Date(
      start.getFullYear(),
      start.getMonth() + currentLoan.tenure_months,
      currentLoan.payment_day_of_month,
    );
  })();

  const accent = currentLoan.type === "credit" ? Colors.credit : Colors.debit;

  const handleDelete = async () => {
    if (
      window.confirm(
        `Delete the loan for ${currentLoan.person_name}? This cannot be undone.`,
      )
    ) {
      await deleteLoan(currentLoan.id);
      navigate(currentLoan.type === "credit" ? "/credit" : "/debit");
    }
  };

  const handleMarkPaid = async (pid: string) => {
    setProcessingId(pid);
    await markPaymentPaid(pid);
    setProcessingId(null);
  };
  const handleMarkUnpaid = async (pid: string) => {
    setProcessingId(pid);
    await markPaymentUnpaid(pid);
    setProcessingId(null);
  };

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Left: loan info */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white rounded-[12px] border border-border p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-[22px] font-bold text-navy">
                {currentLoan.person_name}
              </h1>
              {currentLoan.person_phone ? (
                <a
                  href={`tel:${currentLoan.person_phone}`}
                  className="inline-flex items-center gap-1 text-[14px] text-muted hover:text-teal mt-1"
                >
                  <PhoneIcon size={14} />
                  {currentLoan.person_phone}
                </a>
              ) : null}
            </div>
            <TypePill type={currentLoan.type} />
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5 mb-5">
            <Stat label="Principal" value={formatCurrency(currentLoan.principal_amount)} />
            <Stat label="Monthly Rate" value={`${currentLoan.rate_of_interest}%`} />
            <Stat
              label="Total Repayable"
              value={formatCurrency(totalAmount)}
              highlight
            />
            <Stat
              label="Payment Month"
              value={`${currentLoan.tenure_months} ${
                currentLoan.tenure_months === 1 ? "Month" : "Months"
              }`}
            />
            <Stat
              label="Start Date"
              value={format(parseISO(currentLoan.start_date), "dd MMM yyyy")}
            />
            <Stat label="Due Date" value={format(dueDate, "dd MMM yyyy")} />
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-[12px] text-muted mb-1.5 text-currency">
              <span>Paid: {formatCurrency(currentLoan.total_paid)}</span>
              <span>
                Remaining: {formatCurrency(currentLoan.remaining_amount)}
              </span>
            </div>
            <ProgressBar value={progress} />
          </div>

          {currentLoan.notes ? (
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-[12px] text-muted mb-1">Notes</p>
              <p className="text-[14px] text-navy whitespace-pre-line">
                {currentLoan.notes}
              </p>
            </div>
          ) : null}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="primary"
            leftIcon={<PencilIcon size={16} />}
            onClick={() => navigate(`/loan/edit/${currentLoan.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            leftIcon={<TrashIcon size={16} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Right: schedule */}
      <div className="col-span-12 lg:col-span-4">
        <h2 className="text-[18px] font-semibold text-navy mb-3">Repayment</h2>
        <div className="flex flex-col gap-3">
          {payments.length === 0 ? (
            <p className="text-[14px] text-muted">No payments yet.</p>
          ) : (
            payments.map((p) => (
              <PaymentRow
                key={p.id}
                payment={p}
                onMarkPaid={handleMarkPaid}
                onMarkUnpaid={handleMarkUnpaid}
                isProcessing={processingId === p.id}
              />
            ))
          )}
        </div>

        <div
          className="mt-5 p-4 rounded-[12px] text-white"
          style={{ backgroundColor: accent }}
        >
          <p className="text-[12px] text-white/80">
            {currentLoan.type === "credit" ? "You owe" : "Owed to you"}
          </p>
          <p className="text-[24px] font-bold mt-1 text-currency">
            {formatCurrency(currentLoan.remaining_amount)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] text-muted uppercase tracking-wide font-semibold">
        {label}
      </p>
      <p
        className={`text-[14px] font-semibold mt-0.5 text-currency ${
          highlight ? "text-teal" : "text-navy"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
