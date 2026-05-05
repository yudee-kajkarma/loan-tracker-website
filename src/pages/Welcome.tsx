import { Link, useNavigate } from "react-router-dom";
import {
  WalletIcon,
  SwapIcon,
  BellIcon,
  CalculatorIcon,
  ShieldCheckIcon,
} from "../components/ui/Icon";
import { Button } from "../components/ui/Button";

const FEATURES = [
  {
    icon: <SwapIcon size={20} />,
    title: "Credit & Debit, side by side",
    body: "Track loans you've taken and loans you've given in one place — no spreadsheets required.",
  },
  {
    icon: <BellIcon size={20} />,
    title: "Never miss a due date",
    body: "Email & in-app reminders nudge you a day before each due date.",
  },
  {
    icon: <CalculatorIcon size={20} />,
    title: "Auto interest & schedule",
    body: "Enter the principal, rate, and tenure — we generate the full payment plan for you.",
  },
  {
    icon: <ShieldCheckIcon size={20} />,
    title: "PIN-locked & private",
    body: "Your data is encrypted in transit, stored securely, and gated behind an optional 4-digit PIN.",
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Light topbar */}
      <header className="h-[64px] bg-white border-b border-border flex items-center px-6">
        <Link to="/welcome" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
            <WalletIcon size={18} />
          </div>
          <span className="font-bold text-navy text-[16px]">LoanTracker</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/login"
            className="text-[14px] font-medium text-navy hover:text-teal px-3 py-2"
          >
            Sign in
          </Link>
          <Button size="sm" onClick={() => navigate("/register")}>
            Create account
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-[720px] mx-auto px-4 py-12 md:py-16">
        {/* Hero */}
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-teal/10 text-teal mx-auto flex items-center justify-center mb-6">
            <WalletIcon size={48} />
          </div>
          <h1 className="text-[36px] font-bold text-navy leading-tight">
            LoanTracker
          </h1>
          <p className="text-[16px] text-muted mt-2 max-w-md mx-auto">
            The simple way to manage every rupee you've lent or borrowed.
          </p>
        </div>

        {/* Tagline card */}
        <div className="mt-10 rounded-[20px] bg-navy text-white p-8">
          <h2 className="text-[22px] font-semibold">
            Built for money lenders & borrowers.
          </h2>
          <p className="text-[14px] text-white/80 mt-2 leading-relaxed">
            Whether you're juggling a dozen monthly EMIs or keeping tabs on
            friends and family, LoanTracker keeps your numbers tidy and your
            reminders on time.
          </p>
        </div>

        {/* Features */}
        <h3 className="text-[18px] font-semibold text-navy mt-12 mb-4">
          Why LoanTracker
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-[12px] border border-border p-4 flex gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-teal/10 text-teal flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-navy">{f.title}</p>
                <p className="text-[13px] text-muted mt-0.5 leading-relaxed">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3">
          <Button fullWidth onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
          <p className="text-[11px] text-muted text-center mt-2 px-4">
            By continuing, you agree to keep your loan records accurate and
            private. No payments are processed through this app.
          </p>
        </div>
      </main>
    </div>
  );
}
