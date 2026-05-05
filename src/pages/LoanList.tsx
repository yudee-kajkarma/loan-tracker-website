import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanStore } from "../stores/loanStore";
import { supabase } from "../lib/supabase";
import { LoanCard } from "../components/LoanCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import {
  PlusIcon,
  SearchIcon,
  FolderOpenIcon,
} from "../components/ui/Icon";
import type { LoanStatus, LoanType } from "../types";
import { parseISO, isBefore, startOfDay } from "date-fns";

interface LoanListProps {
  type: LoanType;
}

type StatusFilter = "all" | LoanStatus;
type SortKey = "recent" | "amount" | "due";

export function LoanList({ type }: LoanListProps) {
  const navigate = useNavigate();
  const { creditLoans, debitLoans, fetchLoans, deleteLoan } = useLoanStore();
  const loans = type === "credit" ? creditLoans : debitLoans;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [nextDueMap, setNextDueMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  // Fetch next-due dates for these loans
  useEffect(() => {
    if (loans.length === 0) return;
    const ids = loans.map((l) => l.id);
    supabase
      .from("payments")
      .select("loan_id, due_date, is_paid")
      .in("loan_id", ids)
      .eq("is_paid", false)
      .order("due_date", { ascending: true })
      .then(({ data }) => {
        const map: Record<string, string> = {};
        for (const row of data ?? []) {
          if (!map[row.loan_id]) map[row.loan_id] = row.due_date;
        }
        setNextDueMap(map);
      });
  }, [loans]);

  const filtered = useMemo(() => {
    const today = startOfDay(new Date());
    let list = loans;

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.person_name.toLowerCase().includes(q) ||
          (l.person_phone ?? "").toLowerCase().includes(q),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((l) => {
        const next = nextDueMap[l.id];
        const status: LoanStatus = l.is_completed
          ? "completed"
          : next && isBefore(parseISO(next), today)
            ? "overdue"
            : "active";
        return status === statusFilter;
      });
    }

    // Sort
    const sorted = [...list];
    if (sortBy === "amount") {
      sorted.sort((a, b) => b.remaining_amount - a.remaining_amount);
    } else if (sortBy === "due") {
      sorted.sort((a, b) => {
        const aDue = nextDueMap[a.id] ?? "9999-12-31";
        const bDue = nextDueMap[b.id] ?? "9999-12-31";
        return aDue.localeCompare(bDue);
      });
    } else {
      sorted.sort(
        (a, b) =>
          parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime(),
      );
    }

    return sorted;
  }, [loans, search, statusFilter, sortBy, nextDueMap]);

  const isCredit = type === "credit";
  const accentBg = isCredit ? "bg-credit" : "bg-debit";
  const title = isCredit ? "Credit Loans" : "Debit Loans";
  const newCta = isCredit ? "+ New Credit" : "+ New Debit";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h1 className="text-[28px] font-bold text-navy">{title}</h1>
        <button
          onClick={() => navigate(`/loan/add?type=${type}`)}
          className={`h-10 px-4 rounded-[10px] text-white text-[14px] font-semibold inline-flex items-center gap-1.5 hover:opacity-90 ${accentBg}`}
        >
          <PlusIcon size={16} />
          {newCta}
        </button>
      </div>

      {/* Search & filter */}
      <div className="bg-white rounded-[12px] border border-border p-3 mb-5 flex flex-wrap items-center gap-3 sticky top-[64px] z-20">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name or phone"
            leftIcon={<SearchIcon size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="h-11 px-3 bg-white border border-border rounded-[10px] text-[14px] text-navy focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
        >
          <option value="recent">Sort: Recent</option>
          <option value="amount">Sort: Amount</option>
          <option value="due">Sort: Due Date</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="h-11 px-3 bg-white border border-border rounded-[10px] text-[14px] text-navy focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
        >
          <option value="all">Status: All</option>
          <option value="active">Active</option>
          <option value="overdue">Overdue</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpenIcon size={36} />}
          title={
            loans.length === 0
              ? `No ${type} loans yet`
              : "No matches found"
          }
          subtitle={
            loans.length === 0
              ? "Add your first loan to start tracking."
              : "Try clearing filters or search."
          }
          action={
            loans.length === 0 ? (
              <Button onClick={() => navigate(`/loan/add?type=${type}`)}>
                <PlusIcon size={16} />
                Add your first loan
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              nextDueDate={nextDueMap[loan.id] ?? null}
              onDelete={(id) => {
                deleteLoan(id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CreditPage() {
  return <LoanList type="credit" />;
}

export function DebitPage() {
  return <LoanList type="debit" />;
}
