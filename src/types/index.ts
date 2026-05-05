export type LoanType = "credit" | "debit";

export type LoanStatus = "active" | "completed" | "overdue";

export interface Loan {
  id: string;
  user_id: string;
  type: LoanType;
  person_name: string;
  person_phone: string | null;
  principal_amount: number;
  rate_of_interest: number;
  payment_day_of_month: number;
  start_date: string;
  tenure_months: number;
  total_paid: number;
  remaining_amount: number;
  is_completed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoanInsert {
  type: LoanType;
  person_name: string;
  person_phone: string | null;
  principal_amount: number;
  rate_of_interest: number;
  payment_day_of_month: number;
  start_date: string;
  tenure_months: number;
  remaining_amount: number;
  notes: string | null;
}

export interface Payment {
  id: string;
  loan_id: string;
  user_id: string;
  installment_number: number;
  due_date: string;
  amount: number;
  is_paid: boolean;
  paid_at: string | null;
  notification_id: string | null;
  created_at: string;
}

export interface PaymentInsert {
  loan_id: string;
  user_id: string;
  installment_number: number;
  due_date: string;
  amount: number;
  is_paid: boolean;
}

export interface UserSettings {
  user_id: string;
  pin_hash: string | null;
  notification_enabled: boolean;
  reminder_days_before: number;
}
