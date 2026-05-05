import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useLoanStore } from "../stores/loanStore";
import { LoanForm } from "../components/LoanForm";
import type { LoanType } from "../types";

export default function AddLoanPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = (params.get("type") as LoanType) ?? "credit";

  const user = useAuthStore((s) => s.user);
  const addLoan = useLoanStore((s) => s.addLoan);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-[720px] mx-auto">
      <h1 className="text-[28px] font-bold text-navy mb-1">Add Loan</h1>
      <p className="text-[14px] text-muted mb-6">
        Fill in the details to create a new {type} loan.
      </p>

      <div className="bg-white rounded-[12px] border border-border p-6">
        <LoanForm
          type={type}
          ctaLabel="Add Loan"
          submitting={submitting}
          serverError={error}
          onSubmit={async (data) => {
            if (!user) return;
            setSubmitting(true);
            setError(null);
            try {
              await addLoan(data, user.id);
              navigate(type === "credit" ? "/credit" : "/debit");
            } catch (err: any) {
              setError(err?.message ?? "Failed to add loan");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </div>
    </div>
  );
}
