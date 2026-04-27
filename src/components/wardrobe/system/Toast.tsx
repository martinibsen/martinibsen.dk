import * as React from "react";
import { cn } from "./cn";

export type ToastVariant = "default" | "success" | "error";

export type ToastProps = {
    title: string;
    description?: string;
    variant?: ToastVariant;
};

type ToastEntry = ToastProps & { id: number; time: string };

type ToastContextValue = {
    show: (toast: ToastProps) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}

function timestamp(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ms = String(Math.floor(d.getMilliseconds() / 10)).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${ms}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
    const idRef = React.useRef(0);

    const show = React.useCallback((toast: ToastProps) => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, { ...toast, id, time: timestamp() }]);
        window.setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div
                className="sys-toast-region"
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

type ToastViewProps = ToastProps & { time?: string };

export function Toast({
    title,
    description,
    variant = "default",
    time,
}: ToastViewProps) {
    return (
        <div
            className={cn(
                "sys-toast",
                variant === "success" && "sys-toast--success",
                variant === "error" && "sys-toast--error",
                variant === "default" && "sys-toast--default",
            )}
            role="status"
        >
            <span className="sys-toast__title">{title}</span>
            {time && <span className="sys-toast__time">{time}</span>}
            {description && (
                <span className="sys-toast__desc">{description}</span>
            )}
        </div>
    );
}
