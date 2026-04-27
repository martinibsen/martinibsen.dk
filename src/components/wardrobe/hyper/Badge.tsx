import * as React from "react";
import { cn } from "./cn";

type BadgeProps = {
    variant?: "default" | "filled";
    children: React.ReactNode;
    className?: string;
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "hyp-badge",
                variant === "filled" && "hyp-badge--filled",
                className,
            )}
        >
            {children}
        </span>
    );
}
