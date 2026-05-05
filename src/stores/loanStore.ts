import { create } from "zustand";
import { parseISO } from "date-fns";
import { supabase } from "../lib/supabase";
import {
  calculateBulletPayment,
  generateBulletPayment,
} from "../lib/calculations";
import type { Loan, LoanInsert, Payment } from "../types";

interface LoanState {
  creditLoans: Loan[];
  debitLoans: Loan[];
  currentLoan: Loan | null;
  payments: Payment[];
  loading: boolean;
  actionLoading: boolean;

  fetchLoans: () => Promise<void>;
  fetchLoanDetail: (loanId: string) => Promise<void>;
  addLoan: (data: LoanInsert, userId: string) => Promise<void>;
  updateLoan: (
    loanId: string,
    data: Partial<LoanInsert>,
    userId: string,
  ) => Promise<void>;
  deleteLoan: (loanId: string) => Promise<void>;
  markPaymentPaid: (paymentId: string) => Promise<void>;
  markPaymentUnpaid: (paymentId: string) => Promise<void>;
  clearCurrent: () => void;
}

export const useLoanStore = create<LoanState>()((set, get) => ({
  creditLoans: [],
  debitLoans: [],
  currentLoan: null,
  payments: [],
  loading: false,
  actionLoading: false,

  fetchLoans: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from("loans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const loans = (data as Loan[]) ?? [];

      set({
        creditLoans: loans.filter((l) => l.type === "credit"),
        debitLoans: loans.filter((l) => l.type === "debit"),
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchLoanDetail: async (loanId) => {
    set({ loading: true });
    try {
      const [loanRes, paymentsRes] = await Promise.all([
        supabase.from("loans").select("*").eq("id", loanId).single(),
        supabase
          .from("payments")
          .select("*")
          .eq("loan_id", loanId)
          .order("due_date", { ascending: true }),
      ]);

      if (loanRes.error) throw loanRes.error;
      if (paymentsRes.error) throw paymentsRes.error;

      set({
        currentLoan: loanRes.data as Loan,
        payments: (paymentsRes.data as Payment[]) ?? [],
      });
    } finally {
      set({ loading: false });
    }
  },

  addLoan: async (data, userId) => {
    set({ actionLoading: true });
    try {
      // 1. Insert loan
      const { data: loanData, error: loanError } = await supabase
        .from("loans")
        .insert({ ...data, user_id: userId })
        .select()
        .single();

      if (loanError) throw loanError;
      const loan = loanData as Loan;

      // 2. Compute bullet total + build single-row schedule
      const { totalAmount } = calculateBulletPayment(
        data.principal_amount,
        data.rate_of_interest,
        data.tenure_months,
      );

      const schedule = generateBulletPayment(
        loan.id,
        userId,
        parseISO(data.start_date),
        data.payment_day_of_month,
        data.tenure_months,
        totalAmount,
      );

      // 3. Insert payment row
      const { error: payError } = await supabase
        .from("payments")
        .insert(schedule);

      if (payError) throw payError;

      // 4. Refresh
      await get().fetchLoans();
    } finally {
      set({ actionLoading: false });
    }
  },

  updateLoan: async (loanId, data, userId) => {
    set({ actionLoading: true });
    try {
      const { error: updateError } = await supabase
        .from("loans")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", loanId);

      if (updateError) throw updateError;

      // If anything affecting the schedule changed, regenerate unpaid payment
      const scheduleAffected =
        data.principal_amount !== undefined ||
        data.rate_of_interest !== undefined ||
        data.tenure_months !== undefined ||
        data.start_date !== undefined ||
        data.payment_day_of_month !== undefined;

      if (scheduleAffected) {
        const { data: freshLoan } = await supabase
          .from("loans")
          .select("*")
          .eq("id", loanId)
          .single();

        if (freshLoan) {
          const loan = freshLoan as Loan;

          await supabase
            .from("payments")
            .delete()
            .eq("loan_id", loanId)
            .eq("is_paid", false);

          const { count } = await supabase
            .from("payments")
            .select("*", { count: "exact", head: true })
            .eq("loan_id", loanId)
            .eq("is_paid", true);

          const paidCount = count ?? 0;

          if (paidCount === 0) {
            const { totalAmount } = calculateBulletPayment(
              loan.principal_amount,
              loan.rate_of_interest,
              loan.tenure_months,
            );

            const schedule = generateBulletPayment(
              loanId,
              userId,
              parseISO(loan.start_date),
              loan.payment_day_of_month,
              loan.tenure_months,
              totalAmount,
            );

            await supabase.from("payments").insert(schedule);
            await supabase
              .from("loans")
              .update({ remaining_amount: totalAmount - loan.total_paid })
              .eq("id", loanId);
          }
        }
      }

      await get().fetchLoans();
      await get().fetchLoanDetail(loanId);
    } finally {
      set({ actionLoading: false });
    }
  },

  deleteLoan: async (loanId) => {
    set({ actionLoading: true });
    try {
      const { error } = await supabase
        .from("loans")
        .delete()
        .eq("id", loanId);

      if (error) throw error;
      await get().fetchLoans();
    } finally {
      set({ actionLoading: false });
    }
  },

  markPaymentPaid: async (paymentId) => {
    set({ actionLoading: true });
    try {
      const { data, error } = await supabase
        .from("payments")
        .update({
          is_paid: true,
          paid_at: new Date().toISOString(),
        })
        .eq("id", paymentId)
        .select()
        .single();

      if (error) throw error;
      const payment = data as Payment;
      if (payment.loan_id) {
        await get().fetchLoanDetail(payment.loan_id);
        await get().fetchLoans();
      }
    } finally {
      set({ actionLoading: false });
    }
  },

  markPaymentUnpaid: async (paymentId) => {
    set({ actionLoading: true });
    try {
      const { data, error } = await supabase
        .from("payments")
        .update({ is_paid: false, paid_at: null })
        .eq("id", paymentId)
        .select()
        .single();

      if (error) throw error;
      const payment = data as Payment;
      if (payment.loan_id) {
        await get().fetchLoanDetail(payment.loan_id);
        await get().fetchLoans();
      }
    } finally {
      set({ actionLoading: false });
    }
  },

  clearCurrent: () => set({ currentLoan: null, payments: [] }),
}));
