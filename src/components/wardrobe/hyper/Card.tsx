import * as React from "react";
import { cn } from "./cn";

type CardProps = {
    variant?: "default" | "pink" | "blue" | "green";
    numericBadge?: string;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({
    variant = "default",
    numericBadge,
    className,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "hyp-card",
                variant !== "default" && `hyp-card--${variant}`,
                className,
            )}
            {...props}
        >
            {numericBadge && <span className="hyp-badge-circle">{numericBadge}</span>}
            {children}
        </div>
    );
}
