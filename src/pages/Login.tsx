import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await signIn(data.email, data.password);
      navigate("/");
    } catch (err: any) {
      setServerError(err?.message ?? "Sign in failed");
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
        <h1 className="text-[22px] font-semibold text-navy">Welcome back</h1>
        <p className="text-[14px] text-muted mt-1">
          Sign in to continue to LoanTracker.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
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
            placeholder="••••••••"
            error={errors.password?.message}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted hover:text-navy p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            }
            {...register("password")}
          />

          {serverError ? (
            <div className="bg-red-50 border border-overdue text-overdue rounded-[10px] px-3 py-2 text-[13px]">
              {serverError}
            </div>
          ) : null}

          <Button type="submit" fullWidth loading={submitting}>
            Sign In
          </Button>
        </form>

        <p className="text-[13px] text-muted text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
