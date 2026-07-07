import type { KeyboardEvent, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    const isHidden = element.getAttribute("aria-hidden") === "true";
    const isFocusable = element.tabIndex !== -1;
    const isVisible =
      element.offsetWidth > 0 ||
      element.offsetHeight > 0 ||
      element.getClientRects().length > 0;

    return !isHidden && isFocusable && isVisible;
  });
}

interface UseDialogFocusOptions<T extends HTMLElement> {
  isOpen: boolean;
  dialogRef: RefObject<T | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export function useDialogFocus<T extends HTMLElement>({
  isOpen,
  dialogRef,
  initialFocusRef,
}: UseDialogFocusOptions<T>) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const timer = window.setTimeout(() => {
      const initialTarget =
        initialFocusRef?.current ??
        getFocusableElements(dialogRef.current)[0] ??
        dialogRef.current;

      initialTarget?.focus({ preventScroll: true });
    }, 0);

    return () => {
      window.clearTimeout(timer);
      previousFocusRef.current?.focus({ preventScroll: true });
      previousFocusRef.current = null;
    };
  }, [dialogRef, initialFocusRef, isOpen]);

  const handleDialogKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(dialogRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus({ preventScroll: true });
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === dialogRef.current) {
          event.preventDefault();
          lastElement.focus({ preventScroll: true });
        }
        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      }
    },
    [dialogRef],
  );

  return { handleDialogKeyDown };
}
