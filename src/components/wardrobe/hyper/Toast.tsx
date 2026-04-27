import * as React from "react";
import { cn } from "./cn";

export type ToastVariant = "default" | "success" | "error";

export type ToastProps = {
    title: string;
    description?: string;
    variant?: ToastVariant;
};

type ToastEntry = ToastProps & { id: number };

type ToastContextValue = {
    show: (toast: ToastProps) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
    const idRef = React.useRef(0);

    const show = React.useCallback((toast: ToastProps) => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, { ...toast, id }]);
        window.setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div
                className="hyp-toast-region"
                role="region"
                aria-label="Notifications"
                aria-live="polite"
            >
                {toasts.map((t) => (
                    <Toast key={t.id} {...t} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function Toast({ title, description, variant = "default" }: ToastProps) {
    return (
        <div
            className={cn(
                "hyp-toast",
                variant === "success" && "hyp-toast--success",
                variant === "error" && "hyp-toast--error",
            )}
            role="status"
        >
            <span>{title}</span>
            {description && <span className="hyp-toast__desc">{description}</span>}
        </div>
    );
}
