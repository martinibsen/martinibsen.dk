import * as React from "react";
import { cn } from "./cn";

type InputProps = {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "error";
    label?: string;
    hint?: string;
    numericBadge?: string;
    display?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export function Input({
    size = "md",
    variant = "default",
    label,
    hint,
    numericBadge,
    display,
    className,
    id,
    ...props
}: InputProps) {
    const inputId = id ?? React.useId();
    return (
        <label className="hyp-field" htmlFor={inputId}>
            {label && <span className="hyp-field__label">{label}</span>}
            {numericBadge && <span className="hyp-badge-circle">{numericBadge}</span>}
            <input
                id={inputId}
                className={cn(
                    "hyp-input",
                    `hyp-input--${size}`,
                    variant === "error" && "hyp-input--error",
                    display && "hyp-input--display",
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
