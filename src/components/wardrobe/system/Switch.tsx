import * as React from "react";
import { cn } from "./cn";

type SwitchProps = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    id?: string;
    terminal?: boolean;
};

export function Switch({
    checked,
    onCheckedChange,
    label,
    id,
    terminal,
}: SwitchProps) {
    const inputId = id ?? React.useId();
    return (
        <label
            className={cn("sys-switch", terminal && "sys-switch--terminal")}
            htmlFor={inputId}
        >
            <input
                id={inputId}
                type="checkbox"
                role="switch"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className="sys-switch__input"
            />
            {terminal ? (
                <>
                    <span className="sys-switch__bracket">
                        {checked ? "[X]" : "[ ]"}
                    </span>
                    {label && <span>{label}</span>}
                </>
            ) : (
                <>
                    <span className="sys-switch__box">
                        <svg
                            className="sys-switch__check"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <polyline points="2 6 5 9 10 3" />
                        </svg>
                    </span>
                    {label && <span>{label}</span>}
                </>
            )}
        </label>
    );
}
