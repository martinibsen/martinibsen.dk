import * as React from "react";
import { cn } from "./cn";

type SelectProps = {
    options: Array<{ value: string; label: string }>;
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    label?: string;
} & Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange" | "size"
>;

export function Select({
    options,
    value,
    onValueChange,
    placeholder,
    label,
    className,
    id,
    ...props
}: SelectProps) {
    const inputId = id ?? React.useId();
    return (
        <label className="hyp-field" htmlFor={inputId}>
            {label && <span className="hyp-field__label">{label}</span>}
            <select
                id={inputId}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className={cn("hyp-select", className)}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
