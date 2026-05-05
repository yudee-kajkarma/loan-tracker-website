import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import {
  MAX_PAYMENT_DAY,
  PAYMENT_MONTH_OPTIONS,
  formatCurrency,
} from "../lib/constants";
import { calculateBulletPayment } from "../lib/calculations";
import { Input, Textarea } from "./ui/Input";
import { Button } from "./ui/Button";
import { TypePill } from "./ui/StatusPill";
import type { Loan, LoanInsert, LoanType } from "../types";

const schema = z.object({
  person_name: z.string().min(1, "Name is required"),
  person_phone: z.string().optional(),
  principal_amount: z
    .string()
    .min(1, "Amount is required")
    .refine((s) => Number(s) > 0, "Must be greater than 0"),
  rate_of_interest: z
    .string()
    .min(1, "Rate is required")
    .refine((s) => {
      const n = Number(s);
      return n >= 0 && n <= 100;
    }, "Rate must be 0–100%"),
  tenure_months: z
    .number()
    .int()
    .refine((n) => (PAYMENT_MONTH_OPTIONS as readonly number[]).includes(n), {
      message: "Choose a payment month",
    }),
  start_date: z.string().min(1, "Pick a start date"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface LoanFormProps {
  type: LoanType;
  initialLoan?: Loan;
  submitting?: boolean;
  serverError?: string | null;
  ctaLabel: string;
  onSubmit: (data: LoanInsert) => Promise<void>;
}

export function LoanForm({
  type,
  initialLoan,
  submitting,
  serverError,
  ctaLabel,
  onSubmit,
}: LoanFormProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      person_name: "",
      person_phone: "",
      principal_amount: "",
      rate_of_interest: "",
      tenure_months: undefined as unknown as number,
      start_date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    },
  });

  // Pre-fill when editing
  useEffect(() => {
    if (!initialLoan) return;
    const tenureClamp = (
      PAYMENT_MONTH_OPTIONS as readonly number[]
    ).includes(initialLoan.tenure_months)
      ? initialLoan.tenure_months
      : 1;
    reset({
      person_name: initialLoan.person_name,
      person_phone: initialLoan.person_phone ?? "",
      principal_amount: String(initialLoan.principal_amount),
      rate_of_interest: String(initialLoan.rate_of_interest),
      tenure_months: tenureClamp,
      start_date: initialLoan.start_date,
      notes: initialLoan.notes ?? "",
    });
  }, [initialLoan, reset]);

  // Live preview
  const watchPrincipal = watch("principal_amount");
  const watchRate = watch("rate_of_interest");
  const watchTenure = watch("tenure_months");
  const watchStart = watch("start_date");

  const preview = (() => {
    const p = Number(watchPrincipal) || 0;
    const r = Number(watchRate) || 0;
    const m = Number(watchTenure) || 0;
    if (p > 0 && m > 0 && watchStart) {
      const result = calculateBulletPayment(p, r, m);
      const start = parseISO(watchStart);
      const dueDate = new Date(
        start.getFullYear(),
        start.getMonth() + m,
        Math.min(start.getDate(), MAX_PAYMENT_DAY),
      );
      return { ...result, dueDate };
    }
    return null;
  })();

  const submit = async (data: FormData) => {
    setLocalError(null);
    try {
      const principal = Number(data.principal_amount);
      const rate = Number(data.rate_of_interest);
      const start = parseISO(data.start_date);
      const paymentDay = Math.min(start.getDate(), MAX_PAYMENT_DAY);
      const { totalAmount } = calculateBulletPayment(
        principal,
        rate,
        data.tenure_months,
      );
      const insert: LoanInsert = {
        type,
        person_name: data.person_name,
        person_phone: data.person_phone || null,
        principal_amount: principal,
        rate_of_interest: rate,
        payment_day_of_month: paymentDay,
        start_date: data.start_date,
        tenure_months: data.tenure_months,
        remaining_amount: initialLoan
          ? totalAmount - initialLoan.total_paid
          : totalAmount,
        notes: data.notes || null,
      };
      await onSubmit(insert);
    } catch (err: any) {
      setLocalError(err?.message ?? "Failed to save");
    }
  };

  const error = serverError ?? localError;

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <div>
        <TypePill type={type} />
      </div>

      <Input
        label="Person Name"
        placeholder="Who is this loan with?"
        error={errors.person_name?.message}
        {...register("person_name")}
      />
      <Input
        label="Phone Number (optional)"
        placeholder="+91 98765 43210"
        type="tel"
        error={errors.person_phone?.message}
        {...register("person_phone")}
      />
      <Input
        label="Principal Amount (₹)"
        placeholder="e.g. 50000"
        type="number"
        inputMode="decimal"
        error={errors.principal_amount?.message as string}
        {...register("principal_amount")}
      />
      <Input
        label="Monthly Interest Rate (%)"
        placeholder="e.g. 10"
        type="number"
        inputMode="decimal"
        error={errors.rate_of_interest?.message as string}
        {...register("rate_of_interest")}
      />

      {/* Payment Month segmented */}
      <div>
        <label className="block text-[14px] font-medium text-navy mb-1.5">
          Payment Month
        </label>
        <Controller
          control={control}
          name="tenure_months"
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-2">
              {PAYMENT_MONTH_OPTIONS.map((m) => {
                const selected = value === m;
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => onChange(m)}
                    className={`flex-1 h-11 rounded-[10px] border text-[14px] font-semibold transition-colors ${
                      selected
                        ? "bg-teal border-teal text-white"
                        : "bg-white border-border text-navy hover:bg-surface"
                    }`}
                  >
                    {m} {m === 1 ? "Month" : "Months"}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.tenure_months ? (
          <p className="text-[12px] text-overdue mt-1">
            {errors.tenure_months.message as string}
          </p>
        ) : null}
      </div>

      <Input
        label="Start Date"
        type="date"
        error={errors.start_date?.message}
        {...register("start_date")}
      />

      <Textarea
        label="Notes (optional)"
        placeholder="Any additional details…"
        error={errors.notes?.message as string}
        {...register("notes")}
      />

      {/* Live preview */}
      {preview ? (
        <div className="bg-white rounded-[12px] border border-border p-4">
          <p className="text-[14px] font-semibold text-navy mb-2">
            Loan Summary
          </p>
          <div className="flex justify-between text-[13px] text-currency mb-1.5">
            <span className="text-muted">Total Interest</span>
            <span className="text-navy">
              {formatCurrency(preview.totalInterest)}
            </span>
          </div>
          <div className="flex justify-between text-[14px] text-currency mb-1.5">
            <span className="text-muted">Total Repayable</span>
            <span className="text-teal font-bold">
              {formatCurrency(preview.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-muted">Due on</span>
            <span className="text-navy">
              {format(preview.dueDate, "dd MMM yyyy")}
            </span>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="bg-red-50 border border-overdue text-overdue rounded-[10px] px-3 py-2 text-[13px]">
          {error}
        </div>
      ) : null}

      <Button type="submit" fullWidth loading={submitting}>
        {ctaLabel}
      </Button>
    </form>
  );
}
