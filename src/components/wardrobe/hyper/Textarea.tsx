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
        <label className="hyp-field" htmlFor={inputId}>
            {label && <span className="hyp-field__label">{label}</span>}
            <textarea
                id={inputId}
                className={cn(
                    "hyp-textarea",
                    `hyp-input--${size}`,
                    variant === "error" && "hyp-textarea--error",
                    className,
                )}
                aria-invalid={variant === "error" || undefined}
                {...props}
            />
            {hint && (
                <span
                    className={cn(
                        "hyp-field__hint",
                        variant === "error" && "hyp-field__hint--error",
                    )}
                >
                    {hint}
                </span>
            )}
        </label>
    );
}
