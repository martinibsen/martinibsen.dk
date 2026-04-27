import * as React from "react";
import { cn } from "./cn";

type CardProps = {
    variant?: "default" | "dark" | "accent";
    size?: "default" | "lg";
    codeTexture?: string;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({
    variant = "default",
    size = "default",
    codeTexture,
    className,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "sys-card",
                variant !== "default" && `sys-card--${variant}`,
                size !== "default" && `sys-card--${size}`,
                className,
            )}
            {...props}
        >
            {codeTexture && (
                <span className="sys-card__code-texture">{codeTexture}</span>
            )}
            {children}
        </div>
    );
}
