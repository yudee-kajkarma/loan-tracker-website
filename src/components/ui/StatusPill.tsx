import type { LoanStatus } from "../../types";

const colorMap: Record<LoanStatus, string> = {
  active: "bg-teal",
  completed: "bg-paid",
  overdue: "bg-overdue",
};

export function StatusPill({ status }: { status: LoanStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize text-white tracking-wide ${colorMap[status]}`}
    >
      {status}
    </span>
  );
}

export function TypePill({ type }: { type: "credit" | "debit" }) {
  const isCredit = type === "credit";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize text-white tracking-wide ${
        isCredit ? "bg-credit" : "bg-debit"
      }`}
    >
      {type}
    </span>
  );
}
