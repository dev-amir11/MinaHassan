"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => remove(id), 3800);
    },
    [remove]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (message) => toast(message, "success"),
      error: (message) => toast(message, "error"),
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto w-full max-w-sm rounded-[1rem] border px-4 py-3 text-sm shadow-[var(--shadow-lift)] backdrop-blur-md transition ${
              item.type === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                : item.type === "error"
                  ? "border-red-200 bg-red-50/95 text-red-900"
                  : "border-[var(--border)] bg-[var(--surface-elevated)]/95 text-[var(--foreground)]"
            }`}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="leading-relaxed">{item.message}</p>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="shrink-0 text-xs opacity-60 hover:opacity-100"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
