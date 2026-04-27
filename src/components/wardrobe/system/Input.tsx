import * as React from "react";
import { cn } from "./cn";

type InputProps = {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "error";
    label?: string;
    hint?: string;
    display?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export function Input({
    size = "md",
    variant = "default",
    label,
    hint,
    display,
    className,
    id,
    ...props
}: InputProps) {
    const inputId = id ?? React.useId();
    return (
        <label className="sys-field" htmlFor={inputId}>
            {label && <span className="sys-field__label">{label}</span>}
            <input
                id={inputId}
                className={cn(
                    "sys-input",
                    `sys-input--${size}`,
                    variant === "error" && "sys-input--error",
                    display && "sys-input--display",
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
