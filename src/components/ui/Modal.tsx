import { useEffect } from "react";
import type { ReactNode } from "react";
import { XIcon } from "./Icon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = 480,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-[20px] shadow-card w-full"
        style={{ maxWidth: width }}
      >
        {title ? (
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border">
            <h3 className="text-[18px] font-semibold text-navy">{title}</h3>
            <button
              onClick={onClose}
              className="text-muted hover:text-navy"
              aria-label="Close"
            >
              <XIcon size={20} />
            </button>
          </div>
        ) : null}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
