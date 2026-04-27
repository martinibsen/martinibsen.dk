import * as React from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select } from "./Select";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Dialog } from "./Dialog";
import { Tabs } from "./Tabs";
import { Switch } from "./Switch";
import { ToastProvider, useToast } from "./Toast";

export function ButtonDemo() {
    return (
        <>
            <Button variant="primary" size="md">
                INITIALIZE
            </Button>
            <Button variant="secondary" size="md">
                CANCEL
            </Button>
            <Button variant="mint" size="md">
                COMMIT
            </Button>
            <Button variant="destructive" size="md">
                DELETE
            </Button>
            <Button variant="primary" size="sm">
                SM
            </Button>
            <Button variant="primary" size="lg">
                COMMIT CYCLE TO DATABASE
            </Button>
        </>
    );
}

export function InputDemo() {
    const [val, setVal] = React.useState("");
    return (
        <div style={{ display: "grid", gap: 24, width: "100%", maxWidth: 420 }}>
            <Input
                label="Identifier"
                placeholder="e.g. 5AM Wake Up"
                value={val}
                onChange={(e) => setVal(e.target.value)}
            />
            <Input
                label="Hex ID"
                hint="Unrecognized format."
                variant="error"
                defaultValue="0xZZZZ"
            />
            <Input label="Streak" defaultValue="48" display />
        </div>
    );
}

export function TextareaDemo() {
    return (
        <div style={{ width: "100%", maxWidth: 420 }}>
            <Textarea
                label="System Notes"
                placeholder="One sentence on why you initialized this protocol."
                defaultValue=""
            />
        </div>
    );
}

export function SelectDemo() {
    const [v, setV] = React.useState("daily");
    return (
        <div style={{ width: "100%", maxWidth: 320 }}>
            <Select
                label="Cycle Window"
                value={v}
                onValueChange={setV}
                options={[
                    { value: "daily", label: "DAILY" },
                    { value: "weekly", label: "WEEKLY" },
                    { value: "monthly", label: "MONTHLY" },
                ]}
            />
        </div>
    );
}

export function CardDemo() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                width: "100%",
            }}
        >
            <Card codeTexture={"NULL\n00000\nEMPTY"}>
                <span className="sys-label-micro">Total Executions</span>
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 300,
                        fontSize: 42,
                        letterSpacing: "-1px",
                        marginTop: 8,
                        display: "block",
                    }}
                >
                    3,042
                </span>
            </Card>
            <Card variant="accent">
                <span className="sys-label-micro">Max Streak</span>
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 300,
                        fontSize: 42,
                        letterSpacing: "-1px",
                        marginTop: 8,
                        display: "block",
                    }}
                >
                    48
                    <span
                        style={{
                            fontSize: 14,
                            color: "#888",
                            marginLeft: 6,
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "1px",
                        }}
                    >
                        DAYS
                    </span>
                </span>
            </Card>
            <Card variant="dark" codeTexture={"SYS_VER: 2.0.4\nLOC: UTC-8\nMEM: 12.4GB"}>
                <span
                    className="sys-label-micro"
                    style={{ color: "#666" }}
                >
                    Protocol Analysis
                </span>
                <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "#AAA",
                        margin: "12px 0 0",
                    }}
                >
                    Status:{" "}
                    <span style={{ color: "#6CEFA0" }}>OPERATIONAL</span>
                    <span className="sys-cursor" />
                </p>
            </Card>
        </div>
    );
}

export function BadgeDemo() {
    return (
        <>
            <Badge>NEW</Badge>
            <Badge variant="filled">PASS</Badge>
            <Badge>v0.1</Badge>
            <Badge variant="filled">100%</Badge>
            <Badge>0x4492</Badge>
        </>
    );
}

export function DialogDemo() {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>OPEN DIALOG</Button>
            <Dialog
                open={open}
                onOpenChange={setOpen}
                title="Commit Cycle to Database"
            >
                <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "var(--color-fg-muted)",
                        marginTop: 8,
                    }}
                >
                    Closing Cycle 42. 5 protocols, 88/100 efficiency. Once committed
                    the data is locked and the next cycle is initialized.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                    <Button variant="mint" onClick={() => setOpen(false)}>
                        COMMIT
                    </Button>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        CANCEL
                    </Button>
                </div>
            </Dialog>
        </>
    );
}

export function TabsDemo() {
    const [tab, setTab] = React.useState("week");
    return (
        <Tabs
            tabs={[
                { id: "day", label: "DAY" },
                { id: "week", label: "WEEK" },
                { id: "cycle", label: "CYCLE" },
                { id: "all", label: "ALL" },
            ]}
            activeId={tab}
            onTabChange={setTab}
        />
    );
}

export function SwitchDemo() {
    const [a, setA] = React.useState(true);
    const [b, setB] = React.useState(false);
    const [c, setC] = React.useState(true);
    const [d, setD] = React.useState(false);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Switch checked={a} onCheckedChange={setA} label="STREAK_ALERTS" />
            <Switch checked={b} onCheckedChange={setB} label="SYSTEM_LOGS" />
            <div
                style={{
                    height: 1,
                    background: "#EEE",
                    margin: "4px 0",
                    width: 240,
                }}
            />
            <Switch checked={c} onCheckedChange={setC} label="STREAK_ALERTS" terminal />
            <Switch checked={d} onCheckedChange={setD} label="SYSTEM_LOGS" terminal />
        </div>
    );
}

function ToastDemoInner() {
    const { show } = useToast();
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Button
                variant="mint"
                onClick={() =>
                    show({
                        title: "STREAK_MILESTONE",
                        description: 'Protocol "Hydration" reached 50 days.',
                        variant: "success",
                    })
                }
            >
                MILESTONE
            </Button>
            <Button
                variant="destructive"
                onClick={() =>
                    show({
                        title: "ANOMALY_DETECTED",
                        description: "Cycle 42, protocol 03 dropped 14%.",
                        variant: "error",
                    })
                }
            >
                ANOMALY
            </Button>
            <Button
                variant="secondary"
                onClick={() =>
                    show({
                        title: "SYSTEM",
                        description: "Daily cycle MAR_28 initiated.",
                    })
                }
            >
                SYSTEM
            </Button>
        </div>
    );
}

export function ToastDemo() {
    return (
        <ToastProvider>
            <ToastDemoInner />
        </ToastProvider>
    );
}
