import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../stores/authStore";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
  WalletIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
} from "../components/ui/Icon";

const schema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Min 6 characters"),
    confirm: z.string().min(6, "Min 6 characters"),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const signUp = useAuthStore((s) => s.signUp);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await signUp(data.email, data.password);
      setSuccess(true);
    } catch (err: any) {
      setServerError(err?.message ?? "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <Link to="/welcome" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
          <WalletIcon size={20} />
        </div>
        <span className="font-bold text-navy text-[18px]">LoanTracker</span>
      </Link>

      <div className="w-full max-w-[420px] bg-white rounded-[16px] border border-border p-8 shadow-card">
        <h1 className="text-[22px] font-semibold text-navy">
          Create your account
        </h1>
        <p className="text-[14px] text-muted mt-1">It only takes a minute.</p>

        {success ? (
          <div className="mt-6 bg-paid/10 border border-paid text-paid rounded-[10px] px-3 py-3 text-[13px]">
            Account created. Check your email to confirm, then{" "}
            <Link to="/login" className="font-semibold underline">
              sign in
            </Link>
            .
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col gap-4"
          >
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<MailIcon size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              error={errors.password?.message}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted hover:text-navy p-1"
                >
                  {showPassword ? (
                    <EyeOffIcon size={16} />
                  ) : (
                    <EyeIcon size={16} />
                  )}
                </button>
              }
              {...register("password")}
            />
            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              error={errors.confirm?.message}
              {...register("confirm")}
            />

            {serverError ? (
              <div className="bg-red-50 border border-overdue text-overdue rounded-[10px] px-3 py-2 text-[13px]">
                {serverError}
              </div>
            ) : null}

            <Button type="submit" fullWidth loading={submitting}>
              Create Account
            </Button>
          </form>
        )}

        <p className="text-[13px] text-muted text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-teal font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
