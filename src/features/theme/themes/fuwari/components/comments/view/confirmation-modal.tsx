import { ClientOnly } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import type React from "react";
import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useDialogFocus } from "@/hooks/use-dialog-focus";
import { m } from "@/paraglide/messages";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

const ConfirmationModalInternal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = m.common_confirm(),
  isDanger = false,
  isLoading = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const messageId = useId();
  const { handleDialogKeyDown } = useDialogFocus({
    isOpen,
    dialogRef,
    initialFocusRef: closeButtonRef,
  });

  return createPortal(
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 transition-all duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label={m.common_close()}
        disabled={isLoading}
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={isLoading ? undefined : () => onClose()}
      />

      {/* Modal Content */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
        className={`
          relative w-full max-w-md fuwari-card-base p-0
          flex flex-col transform transition-all duration-300
          ${isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}
        `}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <h2 id={titleId} className="text-lg font-bold fuwari-text-90">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => onClose()}
            disabled={isLoading}
            aria-label={m.common_close()}
            className="p-1 -mr-1 fuwari-text-30 hover:fuwari-text-75 transition-colors disabled:opacity-50"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-4">
          <p id={messageId} className="text-sm fuwari-text-50 leading-relaxed">
            {message}
          </p>

          {isDanger && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 text-xs text-red-500 dark:text-red-400">
              {m.common_irreversible()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose()}
            disabled={isLoading}
            className="h-9 px-4 text-sm fuwari-text-50 hover:fuwari-text-75 transition-colors disabled:opacity-50 rounded-lg"
          >
            {m.common_cancel()}
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            disabled={isLoading}
            className={`
              h-9 px-5 text-sm rounded-lg flex items-center gap-2 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed
              ${
                isDanger
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "fuwari-btn-primary"
              }
            `}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            <span>{isLoading ? m.common_processing() : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default function FuwariConfirmationModal(props: ConfirmationModalProps) {
  return (
    <ClientOnly>
      <ConfirmationModalInternal {...props} />
    </ClientOnly>
  );
}
