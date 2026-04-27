import * as React from "react";

type DialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const previousFocus = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
        if (!open) return;

        previousFocus.current = document.activeElement as HTMLElement;
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        focusable?.[0]?.focus();

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                e.preventDefault();
                onOpenChange(false);
                return;
            }
            if (e.key !== "Tab" || !focusable || focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            previousFocus.current?.focus();
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div
            className="hyp-dialog-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) onOpenChange(false);
            }}
        >
            <div
                ref={dialogRef}
                className="hyp-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="hyp-dialog-title"
            >
                <button
                    type="button"
                    className="hyp-dialog__close"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 id="hyp-dialog-title" className="hyp-dialog__title">
                    {title}.
                </h2>
                {children}
            </div>
        </div>
    );
}
