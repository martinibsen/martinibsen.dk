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
                "sys-badge",
                variant === "filled" && "sys-badge--filled",
                className,
            )}
        >
            {children}
        </span>
    );
}
