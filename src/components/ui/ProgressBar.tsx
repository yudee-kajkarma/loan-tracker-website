interface ProgressBarProps {
  value: number; // 0..1
  variant?: "paid" | "overdue";
  className?: string;
}

export function ProgressBar({
  value,
  variant = "paid",
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(Math.max(value, 0), 1) * 100;
  const fill = variant === "overdue" ? "bg-overdue" : "bg-paid";
  return (
    <div
      className={`h-2 bg-surface rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`h-full ${fill} rounded-full transition-[width]`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
