import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoanStore } from "../stores/loanStore";
import { formatCurrency } from "../lib/constants";
import { FolderOpenIcon, CheckCircleIcon } from "./ui/Icon";
import type { Loan, LoanType } from "../types";

type Tab = "all" | LoanType;

interface SearchDropdownProps {
  query: string;
  onSelect: () => void;
  onClose: () => void;
}

export function SearchDropdown({ query, onSelect }: SearchDropdownProps) {
  const navigate = useNavigate();
  const { creditLoans, debitLoans } = useLoanStore();
  const [tab, setTab] = useState<Tab>("all");

  const all: Loan[] = [...creditLoans, ...debitLoans];

  const results = useMemo(() => {
    const pool =
      tab === "credit" ? creditLoans : tab === "debit" ? debitLoans : all;
    const q = query.trim().toLowerCase();
    if (!q) return pool.slice(0, 20);
    return pool.filter((l) => {
      return (
        l.person_name.toLowerCase().includes(q) ||
        (l.person_phone ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, tab, creditLoans, debitLoans, all]);

  return (
    <div className="absolute top-[calc(100%+8px)] left-0 right-0 md:right-auto md:w-[560px] bg-white rounded-[12px] border border-border shadow-card overflow-hidden z-50">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["all", "credit", "debit"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-[13px] font-medium capitalize transition-colors ${
              tab === t
                ? "text-teal border-b-2 border-teal"
                : "text-muted hover:text-navy"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="max-h-[400px] overflow-y-auto">
        {results.length === 0 ? (
          <div className="py-10 px-6 flex flex-col items-center text-center text-muted">
            <FolderOpenIcon size={36} />
            <p className="text-[14px] mt-2">
              {all.length === 0
                ? "No loans yet"
                : "No matches found"}
            </p>
          </div>
        ) : (
          <ul>
            {results.map((loan) => {
              const accent = loan.type === "credit" ? "text-credit" : "text-debit";
              return (
                <li key={loan.id}>
                  <button
                    onClick={() => {
                      onSelect();
                      navigate(`/loan/${loan.id}`);
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-surface transition-colors border-b border-border last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-navy truncate">
                        {loan.person_name}
                      </p>
                      {loan.person_phone ? (
                        <p className="text-[12px] text-muted truncate">
                          {loan.person_phone}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right shrink-0">
                      {loan.is_completed ? (
                        <div className="flex items-center gap-1 text-paid">
                          <CheckCircleIcon size={14} />
                          <span className="text-[12px] font-medium">
                            Paid off
                          </span>
                        </div>
                      ) : (
                        <>
                          <p className={`text-[14px] font-semibold ${accent}`}>
                            {formatCurrency(loan.remaining_amount)}
                          </p>
                          <p className="text-[11px] text-muted">remaining</p>
                        </>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
