import * as React from "react";
import { cn } from "./cn";

type TabsProps = {
    tabs: Array<{ id: string; label: string }>;
    activeId: string;
    onTabChange: (id: string) => void;
    className?: string;
};

export function Tabs({ tabs, activeId, onTabChange, className }: TabsProps) {
    return (
        <div role="tablist" className={cn("sys-tabs", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={tab.id === activeId}
                    type="button"
                    className={cn(
                        "sys-tabs__btn",
                        tab.id === activeId && "sys-tabs__btn--active",
                    )}
                    onClick={() => onTabChange(tab.id)}
                    onKeyDown={(e) => {
                        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                        e.preventDefault();
                        const idx = tabs.findIndex((t) => t.id === activeId);
                        const next =
                            e.key === "ArrowRight"
                                ? (idx + 1) % tabs.length
                                : (idx - 1 + tabs.length) % tabs.length;
                        onTabChange(tabs[next].id);
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
