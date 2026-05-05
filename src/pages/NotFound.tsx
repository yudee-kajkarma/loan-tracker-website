import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import {
  WalletIcon,
  AlertCircleIcon,
  ChevronRightIcon,
} from "../components/ui/Icon";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const homePath = user ? "/" : "/welcome";

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Light topbar */}
      <header className="h-[64px] bg-white border-b border-border flex items-center px-6">
        <Link to={homePath} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
            <WalletIcon size={18} />
          </div>
          <span className="font-bold text-navy text-[16px]">LoanTracker</span>
        </Link>
      </header>

      <main className="flex-1 max-w-[560px] w-full mx-auto px-4 py-12 md:py-16 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-teal/10 text-teal flex items-center justify-center mb-6">
          <AlertCircleIcon size={48} />
        </div>

        {/* 404 headline */}
        <p className="text-[88px] md:text-[112px] font-bold text-navy leading-none tracking-tight">
          4<span className="text-teal">0</span>4
        </p>
        <h1 className="text-[22px] font-semibold text-navy mt-2">
          Page not found
        </h1>
        <p className="text-[14px] text-muted mt-2 max-w-md leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to tracking your loans.
        </p>

        {/* Suggestion card */}
        <div className="mt-8 w-full rounded-[20px] bg-navy text-white p-6 text-left">
          <p className="text-[13px] text-white/70 uppercase tracking-wider font-semibold">
            Try one of these
          </p>
          <div className="mt-3 flex flex-col divide-y divide-white/10">
            <Link
              to={homePath}
              className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity"
            >
              <span className="text-[14px] font-medium">
                {user ? "Dashboard" : "Welcome"}
              </span>
              <ChevronRightIcon size={18} className="text-white/60" />
            </Link>
            {user ? (
              <>
                <Link
                  to="/credit"
                  className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity"
                >
                  <span className="text-[14px] font-medium">Credit loans</span>
                  <ChevronRightIcon size={18} className="text-white/60" />
                </Link>
                <Link
                  to="/debit"
                  className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity"
                >
                  <span className="text-[14px] font-medium">Debit loans</span>
                  <ChevronRightIcon size={18} className="text-white/60" />
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity"
              >
                <span className="text-[14px] font-medium">Sign in</span>
                <ChevronRightIcon size={18} className="text-white/60" />
              </Link>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 w-full flex flex-col sm:flex-row gap-3">
          <Button fullWidth onClick={() => navigate(homePath)}>
            Go to {user ? "Dashboard" : "Home"}
          </Button>
          <Button fullWidth variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </main>
    </div>
  );
}
