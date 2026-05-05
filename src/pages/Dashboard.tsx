import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  parseISO,
  startOfDay,
  isBefore,
  addDays,
  format,
} from "date-fns";
import { useLoanStore } from "../stores/loanStore";
import { supabase } from "../lib/supabase";
import { formatCurrency, Colors } from "../lib/constants";
import { calculateBulletPayment } from "../lib/calculations";
import {
  ChartBarIcon,
  CashIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  WalletIcon,
  AlertCircleIcon,
  CalendarIcon,
} from "../components/ui/Icon";

type LoanType = "credit" | "debit";

interface UpcomingPayment {
  id: string;
  loan_id: string;
  due_date: string;
  amount: number;
  person_name: string;
  type: LoanType;
}

export default function DashboardPage() {
  const { creditLoans, debitLoans, fetchLoans } = useLoanStore();
  const [selectedType, setSelectedType] = useState<LoanType | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingPayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  useEffect(() => {
    if (!selectedType) return;
    setPaymentsLoading(true);
    supabase
      .from("payments")
      .select(
        "id, loan_id, due_date, amount, loan:loans!inner(person_name, type)",
      )
      .eq("is_paid", false)
      .order("due_date", { ascending: true })
      .then(({ data }) => {
        const items: UpcomingPayment[] = (data ?? []).map((p: any) => ({
          id: p.id,
          loan_id: p.loan_id,
          due_date: p.due_date,
          amount: Number(p.amount),
          person_name: p.loan?.person_name ?? "—",
          type: p.loan?.type as LoanType,
        }));
        setUpcoming(items);
        setPaymentsLoading(false);
      });
  }, [selectedType, creditLoans, debitLoans]);

  const summary = useMemo(() => {
    if (!selectedType) return null;
    const loans = selectedType === "credit" ? creditLoans : debitLoans;
    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalRepayable = 0;
    let totalPaid = 0;
    let totalRemaining = 0;
    let active = 0;
    let completed = 0;
    for (const loan of loans) {
      const { totalAmount, totalInterest: interest } = calculateBulletPayment(
        loan.principal_amount,
        loan.rate_of_interest,
        loan.tenure_months,
      );
      totalPrincipal += loan.principal_amount;
      totalInterest += interest;
      totalRepayable += totalAmount;
      totalPaid += loan.total_paid;
      totalRemaining += loan.remaining_amount;
      if (loan.is_completed) completed++;
      else active++;
    }
    return {
      totalPrincipal,
      totalInterest,
      totalRepayable,
      totalPaid,
      totalRemaining,
      active,
      completed,
      total: loans.length,
    };
  }, [selectedType, creditLoans, debitLoans]);

  const today = startOfDay(new Date());
  const next30 = addDays(today, 30);
  const filtered = selectedType
    ? upcoming.filter((p) => p.type === selectedType)
    : [];
  const overduePayments = filtered.filter((p) =>
    isBefore(parseISO(p.due_date), today),
  );
  const dueNext30 = filtered.filter((p) => {
    const d = parseISO(p.due_date);
    return !isBefore(d, today) && isBefore(d, next30);
  });
  const overdueAmount = overduePayments.reduce((s, p) => s + p.amount, 0);

  const accent = selectedType === "credit" ? Colors.credit : Colors.debit;
  const isCredit = selectedType === "credit";

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-[28px] font-bold text-navy">Dashboard</h1>

        {/* Segmented selector */}
        <div className="inline-flex p-1.5 bg-white rounded-full border border-border">
          {(["credit", "debit"] as const).map((t) => {
            const sel = selectedType === t;
            const tColor = t === "credit" ? Colors.credit : Colors.debit;
            return (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold capitalize transition-colors ${
                  sel ? "text-white" : "text-navy hover:bg-surface"
                }`}
                style={{ backgroundColor: sel ? tColor : "transparent" }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {!selectedType ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-teal/10 text-teal flex items-center justify-center mb-5">
            <ChartBarIcon size={42} />
          </div>
          <p className="text-[18px] font-semibold text-navy">
            Choose a category
          </p>
          <p className="text-[14px] text-muted max-w-md mt-1">
            Pick Credit or Debit above to see a summary of your loans.
          </p>
        </div>
      ) : null}

      {selectedType && summary ? (
        <div className="grid grid-cols-12 gap-4">
          {/* Hero */}
          <div
            className="col-span-12 rounded-[16px] p-6 text-white"
            style={{ backgroundColor: accent }}
          >
            <p className="text-[13px] text-white/80">
              {isCredit ? "You owe" : "Owed to you"}
            </p>
            <p className="text-[36px] font-bold mt-1 text-currency">
              {formatCurrency(summary.totalRemaining)}
            </p>
            <p className="text-[12px] text-white/80 mt-2">
              across {summary.active} active{" "}
              {summary.active === 1 ? "loan" : "loans"}
              {summary.completed > 0 ? ` · ${summary.completed} completed` : ""}
            </p>
          </div>

          {/* Stats grid */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Total Principal"
              value={summary.totalPrincipal}
              icon={<CashIcon size={18} />}
            />
            <StatCard
              label="Total Interest"
              value={summary.totalInterest}
              icon={<TrendingUpIcon size={18} />}
            />
            <StatCard
              label={isCredit ? "Paid Off" : "Received"}
              value={summary.totalPaid}
              icon={<CheckCircleIcon size={18} />}
            />
            <StatCard
              label="Total Repayable"
              value={summary.totalRepayable}
              icon={<WalletIcon size={18} />}
            />
          </div>

          {/* Loan health */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-[12px] border border-border p-4">
            <p className="text-[14px] font-semibold text-navy mb-4">
              Loan Health
            </p>
            <div className="flex justify-between">
              <CountChip
                label="Active"
                value={summary.active}
                color={Colors.teal}
              />
              <CountChip
                label="Completed"
                value={summary.completed}
                color={Colors.paid}
              />
              <CountChip
                label="Overdue"
                value={overduePayments.length}
                color={Colors.overdue}
              />
            </div>
          </div>

          {/* Overdue alert */}
          {overduePayments.length > 0 ? (
            <div className="col-span-12 bg-red-50 border border-overdue rounded-[12px] p-4 flex items-center gap-3">
              <span className="text-overdue">
                <AlertCircleIcon size={24} />
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-overdue">
                  {overduePayments.length} overdue payment
                  {overduePayments.length === 1 ? "" : "s"}
                </p>
                <p className="text-[12px] text-overdue mt-0.5 text-currency">
                  {formatCurrency(overdueAmount)} past due
                </p>
              </div>
            </div>
          ) : null}

          {/* Upcoming */}
          <div className="col-span-12 bg-white rounded-[12px] border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-semibold text-navy">
                Upcoming (next 30 days)
              </p>
            </div>
            {paymentsLoading ? (
              <div className="py-6 flex justify-center">
                <span className="inline-block w-5 h-5 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
              </div>
            ) : dueNext30.length === 0 ? (
              <div className="py-8 flex flex-col items-center text-muted">
                <CalendarIcon size={32} />
                <p className="text-[14px] mt-2">
                  No payments due in the next 30 days
                </p>
              </div>
            ) : (
              <div>
                {dueNext30.slice(0, 5).map((p, idx) => (
                  <Link
                    key={p.id}
                    to={`/loan/${p.loan_id}`}
                    className={`flex items-center justify-between py-3 ${
                      idx > 0 ? "border-t border-border" : ""
                    } hover:bg-surface -mx-2 px-2 rounded-lg transition-colors`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-[14px] font-medium text-navy truncate">
                        {p.person_name}
                      </p>
                      <p className="text-[12px] text-muted">
                        Due {format(parseISO(p.due_date), "dd MMM yyyy")}
                      </p>
                    </div>
                    <p
                      className="text-[14px] font-semibold text-currency"
                      style={{ color: accent }}
                    >
                      {formatCurrency(p.amount)}
                    </p>
                  </Link>
                ))}
                {dueNext30.length > 5 ? (
                  <p className="text-[12px] text-muted text-center mt-2">
                    +{dueNext30.length - 5} more
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[12px] border border-border p-4">
      <div className="text-teal mb-2">{icon}</div>
      <p className="text-[12px] text-muted">{label}</p>
      <p className="text-[16px] font-bold text-navy mt-0.5 text-currency">
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function CountChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center flex-1">
      <p className="text-[24px] font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-[12px] text-muted mt-0.5">{label}</p>
    </div>
  );
}
