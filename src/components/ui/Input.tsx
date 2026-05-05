import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, leftIcon, rightSlot, className = "", id, ...rest },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-[14px] font-medium text-navy mb-1.5"
          >
            {label}
          </label>
        ) : null}
        <div
          className={`flex items-center bg-white border rounded-[10px] transition-shadow ${
            error
              ? "border-overdue focus-within:ring-2 focus-within:ring-overdue/20 focus-within:border-overdue"
              : "border-border focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20"
          }`}
        >
          {leftIcon ? (
            <span className="pl-3 text-muted flex items-center">{leftIcon}</span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            className={`flex-1 bg-transparent h-11 px-3 text-[14px] text-navy placeholder:text-muted focus:outline-none ${className}`}
            {...rest}
          />
          {rightSlot ? <div className="pr-2 flex items-center">{rightSlot}</div> : null}
        </div>
        {error ? (
          <p className="text-[12px] text-overdue mt-1">{error}</p>
        ) : hint ? (
          <p className="text-[12px] text-muted mt-1">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...rest
}: TextareaProps) {
  const inputId = id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-[14px] font-medium text-navy mb-1.5"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={`w-full bg-white border rounded-[10px] px-3 py-2.5 text-[14px] text-navy placeholder:text-muted focus:outline-none transition-shadow min-h-[88px] resize-y ${
          error
            ? "border-overdue focus:ring-2 focus:ring-overdue/20 focus:border-overdue"
            : "border-border focus:border-teal focus:ring-2 focus:ring-teal/20"
        } ${className}`}
        {...rest}
      />
      {error ? <p className="text-[12px] text-overdue mt-1">{error}</p> : null}
    </div>
  );
}
