import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { LockIcon } from "../components/ui/Icon";
import { PIN_LENGTH } from "../lib/constants";

export default function PinPage() {
  const navigate = useNavigate();
  const verifyPin = useAuthStore((s) => s.verifyPin);
  const signOut = useAuthStore((s) => s.signOut);
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function setDigit(i: number, value: string) {
    const v = value.replace(/\D/g, "").slice(0, 1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setError(null);
    if (v && i < PIN_LENGTH - 1) refs.current[i + 1]?.focus();

    if (next.every((d) => d.length === 1)) {
      const pin = next.join("");
      const ok = verifyPin(pin);
      if (ok) {
        navigate("/");
      } else {
        setError("Incorrect PIN. Try again.");
        setDigits(Array(PIN_LENGTH).fill(""));
        setTimeout(() => refs.current[0]?.focus(), 0);
      }
    }
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 rounded-full bg-teal/10 text-teal flex items-center justify-center mb-5">
        <LockIcon size={32} />
      </div>
      <h1 className="text-[22px] font-semibold text-navy">Enter your PIN</h1>
      <p className="text-[14px] text-muted mt-1">
        4-digit PIN to unlock your dashboard.
      </p>

      <div className="flex gap-3 mt-8">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            type="password"
            inputMode="numeric"
            maxLength={1}
            className={`w-14 h-14 text-center text-[20px] font-semibold rounded-[12px] border bg-white transition-shadow focus:outline-none focus:ring-2 ${
              error
                ? "border-overdue focus:ring-overdue/20 focus:border-overdue"
                : "border-border focus:ring-teal/20 focus:border-teal"
            }`}
          />
        ))}
      </div>

      {error ? (
        <p className="text-overdue text-[13px] mt-4">{error}</p>
      ) : null}

      <button
        onClick={async () => {
          if (window.confirm("Sign out and reset your PIN?")) {
            await signOut();
            navigate("/welcome");
          }
        }}
        className="text-[13px] text-muted mt-8 hover:text-navy"
      >
        Forgot PIN?
      </button>
    </div>
  );
}
