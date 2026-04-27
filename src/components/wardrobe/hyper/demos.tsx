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
import { Toast, ToastProvider, useToast } from "./Toast";

export function ButtonDemo() {
    return (
        <>
            <Button variant="primary" size="md">
                PRIMARY.
            </Button>
            <Button variant="secondary" size="md">
                SECONDARY.
            </Button>
            <Button variant="destructive" size="md">
                DELETE.
            </Button>
            <Button variant="primary" size="sm">
                SMALL.
            </Button>
            <Button variant="primary" size="lg">
                BIG ONE.
            </Button>
        </>
    );
}

export function InputDemo() {
    const [val, setVal] = React.useState("");
    return (
        <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 420 }}>
            <Input
                label="EMAIL"
                placeholder="you@vibe.coded"
                value={val}
                onChange={(e) => setVal(e.target.value)}
            />
            <Input
                label="DISTANCE"
                hint="Looks wrong, friend."
                variant="error"
                defaultValue="not a number"
            />
            <Input label="STREAK" numericBadge="07" defaultValue="42" display />
        </div>
    );
}

export function TextareaDemo() {
    return (
        <div style={{ width: "100%", maxWidth: 420 }}>
            <Textarea
                label="WHY YOU JOIN"
                placeholder="Tell the club. Be brief, be honest."
                defaultValue=""
            />
        </div>
    );
}

export function SelectDemo() {
    const [v, setV] = React.useState("monthly");
    return (
        <div style={{ width: "100%", maxWidth: 320 }}>
            <Select
                label="MEMBERSHIP"
                value={v}
                onValueChange={setV}
                options={[
                    { value: "weekly", label: "WEEKLY" },
                    { value: "monthly", label: "MONTHLY" },
                    { value: "yearly", label: "YEARLY" },
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
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                width: "100%",
            }}
        >
            <Card variant="pink" numericBadge="01">
                <div style={{ fontSize: 13, opacity: 0.85 }}>Members</div>
                <div
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 56,
                        lineHeight: 0.85,
                        marginTop: 8,
                        textTransform: "uppercase",
                    }}
                >
                    234
                </div>
            </Card>
            <Card variant="blue" numericBadge="02">
                <div style={{ fontSize: 13, opacity: 0.85 }}>Events year</div>
                <div
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 56,
                        lineHeight: 0.85,
                        marginTop: 8,
                        textTransform: "uppercase",
                    }}
                >
                    47
                </div>
            </Card>
            <Card variant="green" numericBadge="03">
                <div style={{ fontSize: 13, opacity: 0.85 }}>Total km</div>
                <div
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 56,
                        lineHeight: 0.85,
                        marginTop: 8,
                        textTransform: "uppercase",
                    }}
                >
                    1,920
                </div>
            </Card>
        </div>
    );
}

export function BadgeDemo() {
    return (
        <>
            <Badge>NEW</Badge>
            <Badge variant="filled">LIVE</Badge>
            <Badge>v0.1</Badge>
            <Badge variant="filled">HYPER</Badge>
        </>
    );
}

export function DialogDemo() {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>OPEN DIALOG</Button>
            <Dialog open={open} onOpenChange={setOpen} title="JOIN THE CLUB">
                <p style={{ marginTop: 0, lineHeight: 1.55 }}>
                    Confirm membership. You'll get a confirmation, the route map, and
                    one strong opinion about hill repeats.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                    <Button onClick={() => setOpen(false)}>CONFIRM.</Button>
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
                { id: "week", label: "WEEK" },
                { id: "month", label: "MONTH" },
                { id: "year", label: "YEAR" },
            ]}
            activeId={tab}
            onTabChange={setTab}
        />
    );
}

export function SwitchDemo() {
    const [a, setA] = React.useState(true);
    const [b, setB] = React.useState(false);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Switch checked={a} onCheckedChange={setA} label="Newsletter" />
            <Switch checked={b} onCheckedChange={setB} label="SMS reminders" />
        </div>
    );
}

function ToastDemoInner() {
    const { show } = useToast();
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Button onClick={() => show({ title: "SAVED.", variant: "success" })}>
                SUCCESS
            </Button>
            <Button
                variant="destructive"
                onClick={() =>
                    show({
                        title: "FAILED.",
                        description: "Try again in a moment.",
                        variant: "error",
                    })
                }
            >
                ERROR
            </Button>
            <Button
                variant="secondary"
                onClick={() => show({ title: "LET'S GO." })}
            >
                DEFAULT
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

export { Toast };
