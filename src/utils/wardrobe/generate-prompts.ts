// Component sources are inlined at build-time via Vite's ?raw imports so the
// install/system pages don't depend on filesystem layout in the bundled output.
import buttonSrc from "../../components/wardrobe/hyper/Button.tsx?raw";
import inputSrc from "../../components/wardrobe/hyper/Input.tsx?raw";
import textareaSrc from "../../components/wardrobe/hyper/Textarea.tsx?raw";
import selectSrc from "../../components/wardrobe/hyper/Select.tsx?raw";
import cardSrc from "../../components/wardrobe/hyper/Card.tsx?raw";
import badgeSrc from "../../components/wardrobe/hyper/Badge.tsx?raw";
import dialogSrc from "../../components/wardrobe/hyper/Dialog.tsx?raw";
import tabsSrc from "../../components/wardrobe/hyper/Tabs.tsx?raw";
import switchSrc from "../../components/wardrobe/hyper/Switch.tsx?raw";
import toastSrc from "../../components/wardrobe/hyper/Toast.tsx?raw";
import cnSrc from "../../components/wardrobe/hyper/cn.ts?raw";
import tokensCssSrc from "../../components/wardrobe/hyper/tokens.css?raw";
import globalsCssSrc from "../../components/wardrobe/hyper/globals.css?raw";

export type HyperComponentName =
    | "Button"
    | "Input"
    | "Textarea"
    | "Select"
    | "Card"
    | "Badge"
    | "Dialog"
    | "Tabs"
    | "Switch"
    | "Toast";

export const HYPER_COMPONENTS: HyperComponentName[] = [
    "Button",
    "Input",
    "Textarea",
    "Select",
    "Card",
    "Badge",
    "Dialog",
    "Tabs",
    "Switch",
    "Toast",
];

const SOURCES: Record<HyperComponentName, string> = {
    Button: buttonSrc,
    Input: inputSrc,
    Textarea: textareaSrc,
    Select: selectSrc,
    Card: cardSrc,
    Badge: badgeSrc,
    Dialog: dialogSrc,
    Tabs: tabsSrc,
    Switch: switchSrc,
    Toast: toastSrc,
};

export function getComponentCode(name: HyperComponentName): string {
    return SOURCES[name];
}

export function getTokensCss(): string {
    return tokensCssSrc;
}

export function getGlobalsCss(): string {
    return globalsCssSrc;
}

export function getCnUtility(): string {
    return cnSrc;
}

const TOKEN_VAR_HINTS: Partial<Record<HyperComponentName, string[]>> = {
    Button: ["--color-fg", "--color-bg", "--color-danger", "--font-display", "--radius-pill", "--shadow-hard", "--shadow-hard-sm", "--border", "--border-color"],
    Input: ["--color-surface", "--color-fg", "--font-display", "--font-body", "--radius-md", "--shadow-hard-sm", "--border"],
    Textarea: ["--color-surface", "--color-fg", "--font-body", "--radius-md", "--border"],
    Select: ["--color-surface", "--color-fg", "--font-display", "--radius-md", "--border"],
    Card: ["--color-surface", "--color-pink", "--color-blue", "--color-green", "--radius-md", "--border"],
    Badge: ["--color-surface", "--color-fg", "--color-bg", "--radius-pill", "--border"],
    Dialog: ["--color-surface", "--color-fg", "--font-display", "--radius-md", "--shadow-hard", "--border"],
    Tabs: ["--color-surface", "--color-fg", "--color-bg", "--font-display", "--radius-md", "--radius-sm", "--border"],
    Switch: ["--color-fg", "--color-bg", "--radius-pill", "--border"],
    Toast: ["--color-fg", "--color-bg", "--color-success", "--color-danger", "--font-display", "--radius-pill", "--shadow-hard-sm", "--border"],
};

export function generateComponentPrompt(name: HyperComponentName): string {
    const code = getComponentCode(name);
    const cnCode = getCnUtility();
    const tokens = TOKEN_VAR_HINTS[name] ?? [];
    const tokensList = tokens.length
        ? tokens.map((t) => `   ${t}`).join("\n")
        : "   --color-bg, --color-fg, --color-surface, --font-display, --font-body, --radius-md, --border";

    return `Add this Wardrobe Hyper ${name} to my project.

1. Create components/ui/wardrobe/${name}.tsx with the code below.
2. Make sure components/ui/wardrobe/cn.ts exists (utility shown at the bottom).
3. Add these CSS variables to your globals.css under [data-system="hyper"]:
${tokensList}
4. Import Anton font in globals.css:
   @import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
5. Wrap any section using this component with <div data-system="hyper">.

--- ${name}.tsx ---

${code}

--- cn.ts ---

${cnCode}
`;
}

export function generateThemeBlock(): string {
    return `${tokensCssSrc}\n@import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");\n`;
}

export type InstallTarget = "claude-code" | "v0" | "lovable";

const TARGET_INTRO: Record<InstallTarget, string> = {
    "claude-code":
        "Install the Wardrobe Hyper theme in my project. I'm using Claude Code / Cursor. Apply every step below as written.",
    v0: "Install the Wardrobe Hyper theme in this v0 project. Treat each step below as a concrete file or edit you must make.",
    lovable:
        "Install the Wardrobe Hyper theme in my Lovable project. Each step below maps to a specific file or change.",
};

export function generateFullInstallPrompt(target: InstallTarget): string {
    const intro = TARGET_INTRO[target];
    const componentBlocks = HYPER_COMPONENTS.map(
        (name) => `--- components/ui/wardrobe/${name}.tsx ---\n\n${SOURCES[name]}`,
    ).join("\n\n");

    return `${intro}

Step 1 — Add this to globals.css:

@import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");

${tokensCssSrc}

Step 2 — Create components/ui/wardrobe/cn.ts:

${cnSrc}

Step 3 — Create the following 10 component files in components/ui/wardrobe/:

${componentBlocks}

Step 4 — Add globals.css component styles. Append the following to globals.css below the tokens:

${stripCssImports(globalsCssSrc)}

Step 5 — Wrap the section/page you want themed with <div data-system="hyper">:

  <div data-system="hyper">
    <Button>HELLO HYPER</Button>
    <Card variant="pink">...</Card>
  </div>

Done. Now <Button>, <Input>, <Card>, <Badge>, <Dialog>, <Tabs>, <Switch>, <Toast>, <Select>, <Textarea> render in Hyper.
`;
}

function stripCssImports(css: string): string {
    return css
        .split("\n")
        .filter((line) => !line.trim().startsWith("@import"))
        .join("\n")
        .trim();
}
