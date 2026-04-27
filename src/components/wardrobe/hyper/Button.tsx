import * as React from "react";
import { cn } from "./cn";

type ButtonProps = {
    variant?: "primary" | "secondary" | "destructive";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn("hyp-btn", `hyp-btn--${variant}`, `hyp-btn--${size}`, className)}
            {...props}
        >
            {children}
        </button>
    );
}
