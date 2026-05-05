import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center text-teal mb-5">
        {icon}
      </div>
      <h3 className="text-[18px] font-semibold text-navy mb-1.5">{title}</h3>
      {subtitle ? (
        <p className="text-[14px] text-muted max-w-md mb-5">{subtitle}</p>
      ) : null}
      {action}
    </div>
  );
}
