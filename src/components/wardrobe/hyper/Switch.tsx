import * as React from "react";

type SwitchProps = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    id?: string;
};

export function Switch({ checked, onCheckedChange, label, id }: SwitchProps) {
    const inputId = id ?? React.useId();
    return (
        <label className="hyp-switch" htmlFor={inputId}>
            <input
                id={inputId}
                type="checkbox"
                role="switch"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className="hyp-switch__input"
            />
            <span className="hyp-switch__track">
                <span className="hyp-switch__thumb" />
            </span>
            {label && <span>{label}</span>}
        </label>
    );
}
