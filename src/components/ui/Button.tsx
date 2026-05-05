import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "destructive" | "outline" | "ghost";
  size?: "md" | "sm";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal/30 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  const sizes = {
    md: "h-11 px-5 text-[14px]",
    sm: "h-9 px-3 text-[13px]",
  };
  const variants = {
    primary: "bg-teal text-white hover:opacity-90 active:scale-[0.98]",
    destructive: "bg-overdue text-white hover:opacity-90 active:scale-[0.98]",
    outline:
      "border border-teal text-teal bg-white hover:bg-teal/5 active:scale-[0.98]",
    ghost: "text-navy hover:bg-surface",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
