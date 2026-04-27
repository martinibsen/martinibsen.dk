import * as React from "react";
import { cn } from "./cn";

type TextareaProps = {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "error";
    label?: string;
    hint?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;

export function Textarea({
    size = "md",
    variant = "default",
    label,
    hint,
    className,
    id,
    ...props
}: TextareaProps) {
    const inputId = id ?? React.useId();
    return (
        <label className="sys-field" htmlFor={inputId}>
            {label && <span className="sys-field__label">{label}</span>}
            <textarea
                id={inputId}
                className={cn(
                    "sys-textarea",
                    `sys-input--${size}`,
                    variant === "error" && "sys-textarea--error",
                    className,
                )}
                aria-invalid={variant === "error" || undefined}
                {...props}
            />
            {hint && (
                <span
                    className={cn(
                        "sys-field__hint",
                        variant === "error" && "sys-field__hint--error",
                    )}
                >
                    {hint}
                </span>
            )}
        </label>
    );
}
