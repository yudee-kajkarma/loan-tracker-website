import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useLoanStore } from "../stores/loanStore";
import { LoanForm } from "../components/LoanForm";

export default function EditLoanPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const { currentLoan, fetchLoanDetail, updateLoan, deleteLoan } =
    useLoanStore();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchLoanDetail(id);
  }, [id, fetchLoanDetail]);

  if (!currentLoan) {
    return (
      <div className="flex justify-center py-20">
        <span className="inline-block w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <h1 className="text-[28px] font-bold text-navy mb-1">Edit Loan</h1>
      <p className="text-[14px] text-muted mb-6">
        Editing loan for{" "}
        <span className="font-medium text-navy">{currentLoan.person_name}</span>
        .
      </p>

      <div className="bg-white rounded-[12px] border border-border p-6">
        <LoanForm
          type={currentLoan.type}
          initialLoan={currentLoan}
          ctaLabel="Save Changes"
          submitting={submitting}
          serverError={error}
          onSubmit={async (data) => {
            if (!user || !id) return;
            setSubmitting(true);
            setError(null);
            try {
              await updateLoan(id, data, user.id);
              navigate(`/loan/${id}`);
            } catch (err: any) {
              setError(err?.message ?? "Failed to update loan");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </div>

      <div className="text-center mt-6">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            if (
              window.confirm(
                `Delete the loan for ${currentLoan.person_name}? This cannot be undone.`,
              )
            ) {
              deleteLoan(currentLoan.id).then(() =>
                navigate(currentLoan.type === "credit" ? "/credit" : "/debit"),
              );
            }
          }}
          className="text-[13px] text-overdue hover:underline"
        >
          Delete this loan
        </Link>
      </div>
    </div>
  );
}
