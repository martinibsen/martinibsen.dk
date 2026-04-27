# martinibsen.dk — Build Instructions

## What we're building
A personal website for Martin Ibsen — PM, product designer, and AI builder. The site has two page types: a front page with project cards and blog list, and individual blog post pages. Both have dark/light mode.

## Tech stack
- **Framework:** Astro (latest stable)
- **Styling:** Vanilla CSS with CSS custom properties (no Tailwind, no frameworks)
- **Blog:** Markdown files with frontmatter in `src/content/blog/`
- **Font:** Geist Sans via CDN: `https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.css`
- **Hosting:** Netlify (static output)
- **No JS frameworks** — vanilla JS only for theme toggle

## Project structure
```
martinibsen.dk/
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Shared head, theme toggle, footer
│   │   └── BlogPost.astro        # Blog post layout
│   ├── pages/
│   │   ├── index.astro           # Front page
│   │   └── blog/
│   │       └── [...slug].astro   # Dynamic blog post pages
│   ├── content/
│   │   └── blog/
│   │       └── den-nye-produkttrio.md
│   ├── styles/
│   │   └── global.css            # All CSS variables and styles
│   └── data/
│       └── projects.ts           # Project data as typed array
├── public/
│   └── images/                   # Project images (placeholders for now)
├── astro.config.mjs
├── package.json
└── CLAUDE.md
```

## Design system

### CSS Variables (dark mode = default)
```css
:root {
    --c-bg: #02050A;
    --c-bg-card: #02050A;
    --c-text: #ffffff;
    --c-text-70: rgba(255, 255, 255, 0.7);
    --c-text-30: rgba(255, 255, 255, 0.3);
    --c-text-15: rgba(255, 255, 255, 0.15);
    --c-text-05: rgba(255, 255, 255, 0.05);
    --c-card-hover: rgba(255, 255, 255, 0.02);
    --font: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
    --ease-cinematic: cubic-bezier(0.19, 1, 0.22, 1);
    --transition-fast: 0.3s ease;
}

[data-theme="light"] {
    --c-bg: #FAFAFA;
    --c-bg-card: #FAFAFA;
    --c-text: #1a1a1a;
    --c-text-70: rgba(26, 26, 26, 0.7);
    --c-text-30: rgba(26, 26, 26, 0.3);
    --c-text-15: rgba(26, 26, 26, 0.12);
    --c-text-05: rgba(26, 26, 26, 0.05);
    --c-card-hover: rgba(0, 0, 0, 0.02);
}
```

### Typography
- One font everywhere: Geist Sans
- Headings: weight 400, tight letter-spacing (-0.03em to -0.04em)
- Body: weight 400, 15px, line-height 1.8 for blog, 1.4 for UI
- NO uppercase text-transform anywhere
- NO mixed font weights in the same line
- NO serif fonts

### Design rules
- Monochrome only — no accent colors
- 1px separator lines using `var(--c-text-15)`
- Status dots on projects: green (#4ade80) for live, amber (#fbbf24) for building
- Subtle hover states: cards get `var(--c-card-hover)`, blog rows indent 16px left
- Cinematic easing on animations: `cubic-bezier(0.19, 1, 0.22, 1)`
- Fade-up entrance animation on hero elements
- Project images: slightly desaturated (`filter: grayscale(0.3)`), subtle zoom on hover

## Reference files
The `reference/` folder contains two HTML prototypes that define the exact design:
- `martinibsen.html` — Front page with project grid, blog list, newsletter signup
- `blog-post.html` — Blog post page with article layout and "more posts" section

**These are the source of truth for all styling.** Extract all CSS and structure from these files. Do not deviate from the design.

## Page: Front page (index.astro)
1. Theme toggle button (fixed top-right)
2. Hero section: name "Martin Ibsen" (weight 400), dot, intro paragraph, pill navigation (Projekter, Tanker, Nyhedsbrev, Kontakt)
3. Projects section: 2-column grid of cards, each with image, meta (number + status), name, description, footer with 3 metadata blocks
4. Blog section: list of blog rows with date, tag, title, hover arrow
5. Newsletter section: box with heading, text, email input + button
6. Footer: copyright + social links

## Page: Blog post ([...slug].astro)
1. Theme toggle (fixed top-right)
2. Back link "← Martin Ibsen" (fixed top-left)
3. Article header: meta line (date, tag, read time), title, subtitle
4. Horizontal divider
5. Article body: rendered from markdown, max-width 680px
6. Author footer with share links
7. "Flere tanker" section with other recent posts

## Blog content
Blog posts live as markdown files in `src/content/blog/` with this frontmatter:
```yaml
---
title: "Den nye produkttrio"
date: 2026-03-22
tags: ["product", "ai", "organisation"]
subtitle: "Den klassiske opdeling i designer, udvikler og PM giver ikke mening længere. Her er hvad der kommer i stedet."
readTime: "5 min"
---
```

## Project data
Projects are defined in `src/data/projects.ts`:
```typescript
export const projects = [
  {
    number: "01",
    name: "Knud",
    desc: "iOS-app der bruger AI til at kategorisere og organisere dine screenshots automatisk. Del et screenshot — Knud sorterer det i den rigtige mappe.",
    status: "Live",
    statusType: "live",
    role: "Idé → Ship",
    type: "iOS App",
    stack: "Swift, AI",
    url: "https://knud.app",
    image: "/images/knud.jpg"
  },
  {
    number: "02",
    name: "Stilnote",
    desc: "SaaS for danske indretningsdesignere. Erstatter manuelle Excel-ark med smukke, professionelle materialeplaner klar til kunden.",
    status: "Building",
    statusType: "building",
    role: "Idé → Ship",
    type: "B2B SaaS",
    stack: "Next.js, Supabase",
    url: null,
    image: "/images/stilnote.jpg"
  },
  {
    number: "03",
    name: "Super Yes",
    desc: "B2B SaaS der hjælper produktteams med struktureret product discovery. Byg hypoteser, definér outcomes og validér med eksisterende data.",
    status: "Building",
    statusType: "building",
    role: "Idé → Ship",
    type: "B2B SaaS",
    stack: "Next.js, Supabase",
    url: null,
    image: "/images/superyes.jpg"
  },
  {
    number: "04",
    name: "PM Consulting",
    desc: "Konsulentydelse der løfter PM-kompetencer i AI-drevne organisationer. Erfaring fra Norlys, Energinet og Hessen.",
    status: "Aktiv",
    statusType: "live",
    role: "Rådgiver",
    type: "B2B Service",
    stack: "AI, Discovery",
    url: null,
    image: "/images/consulting.jpg"
  }
];
```

## Deployment
- Output: static (`output: 'static'` in astro.config.mjs)
- Netlify adapter NOT needed for static
- Build command: `npm run build`
- Publish directory: `dist/`
- Domain: martinibsen.dk (DNS pointed from one.com)

## Important notes
- Theme preference stored in localStorage, applied before paint (inline script in head to avoid flash)
- All links in nav must scroll smoothly to correct sections
- Blog post "Flere tanker" section should list other posts dynamically
- Newsletter form is UI-only for now (will connect to Loops later)
- Project images are Unsplash placeholders — will be replaced with actual screenshots
- Site language is Danish (lang="da")

---

# Wardrobe — designsystem-showcase (sub-section under /wardrobe)

> **CRITICAL ISOLATION RULE:** Everything above this line describes the existing martinibsen.dk site. Do NOT modify anything above this line. Do NOT change the existing design system, fonts, theme, components, blog, project data, or any existing pages. Wardrobe is a separate sub-section that lives ONLY in /wardrobe/* routes and /src/components/wardrobe/* files. The existing site keeps its monochrome, Geist-only, vanilla-CSS rules.

## Wardrobe mission & positioning

Wardrobe er **personality for vibe-coded apps** — temaer til folk der bygger med Claude Code, Cursor, v0, Lovable.

Pitch til besøgende: *"Stop building purple-gradient apps. Drop one of these into your AI session and ship something with character."*

Wardrobe konkurrerer ikke med shadcn — det er et lag oven på shadcn. Vi sælger karakter, ikke komponenter.

Denne build dækker **kun det første tema: Hyper**. De øvrige 3 (TBD) tilføjes senere ved at gentage processen.

Mål for besøgende:
1. Se Hyper i sin naturlige habitat (Marathon Club demo)
2. Få Hyper ind i deres eget projekt på under 30 sekunder via en AI-prompt de paster i Claude Code/Cursor
3. Optionelt skrive sig op til "next theme drop"

**Voice & tone på Wardrobe-sider:** Direct, lowercase-friendly, peer-to-peer dev sprog. Ikke "professional design system". Ikke "elevate your product". Mere "stop shipping the same purple landing page", "drop this in your claude code session", "your shadcn but loud". Den her copy må gerne være lidt fræk.

---

## Wardrobe — house style — KRITISK LÆSEREGEL

Wardrobe-sub-sektionen har TO designsfærer. Bland dem aldrig.

### Sfære A — Wardrobe chrome (minimalistisk, kedeligt-elegant)

Gælder:
- `/wardrobe` (overview-side med 4 system-cards)
- Wrappers/headers/footers omkring system-sider
- Navigation mellem systemer
- Email-signup-form på overview
- Eventuelle "info"-sider

Krav til Wardrobe chrome:
- **Baggrund**: hvid (`#FFFFFF`) eller meget lys grå (`#FAFAFA`)
- **Tekst**: sort/mørk grå (`#0A0A0A` headings, `#525252` body)
- **Font**: system-ui stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`. Ingen Google Fonts importeret til chrome.
- **Ingen**: gradienter, shadows, ikoner ud over funktionelle (chevron, copy-icon, external-link), animations, farvede knapper, custom radius (kun 0 eller 8px max)
- **Knapper og links**: tekst-baserede underline-on-hover. Hvis en knap er nødvendig: sort fill + hvid tekst, 8px radius, intet andet.

Reference: Stripe Press, Linear changelog, Pirsch Analytics. "Boringly elegant."

**VIGTIG:** Wardrobe chrome er bevidst ANDERLEDES end martinibsen.dk's eksisterende dark/light monochrome theme. Wardrobe-overview-siden må ikke arve martinibsen.dk's CSS-variables (`--c-bg`, `--c-text`, etc.) — den skal være sin egen scoped lille verden i hvid baggrund. Det er en bevidst kontrast.

### Sfære B — Wardrobe system-rum (fuld karakter)

Gælder:
- `/wardrobe/hyper` (system-side med komponentliste)
- `/wardrobe/hyper/install` (one-prompt-side)
- `/wardrobe/hyper/marathon-club/*` (demo-sider)

Her er det HYPER, hele vejen ned. `<body data-system="hyper">` aktiverer alle tokens.

### Hvor bor martinibsen.dk's eksisterende navigation?

Wardrobe-sub-sektionen har sin EGEN navigation/header (en simpel "← back to martinibsen.dk" link øverst og intet andet). Den eksisterende martinibsen.dk-header (theme toggle, hero pill nav til Projekter/Tanker/Nyhedsbrev/Kontakt) skal IKKE rendres på /wardrobe-sider. Wardrobe-siderne bruger en separat layout fil (`src/layouts/WardrobeLayout.astro`) der er helt adskilt fra `BaseLayout.astro`.

---

## Wardrobe — Pre-flight setup (kør FØRST, før noget andet i Wardrobe-build)

### 1. Tjek og opret git

```bash
if [ ! -d .git ]; then
  git init
fi
```

### 2. Sikr .gitignore er korrekt

Opret eller opdatér `.gitignore` så den indeholder mindst:

```
node_modules/
dist/
.netlify/
.env
.env.*
!.env.example
.DS_Store
.vscode/
.idea/
*.log
.cache/
.astro/
wardrobe-references/
```

### 3. Verificér at ingen secrets er trackede

```bash
git ls-files .env
git ls-files | grep -i "secret\|api[_-]key\|token" | grep -v ".example"
```

Hvis enten returnerer noget, STOP og fortæl Martin før der pushes nogensteds.

### 4. Opret GitHub-repo (kun hvis ingen remote findes)

```bash
if ! git remote get-url origin 2>/dev/null; then
  gh repo create martinibsen.dk --public --source=. --remote=origin --push
fi
```

Hvis `gh` ikke er logget ind, fortæl Martin: *"Kør `gh auth login` først, så fortsætter jeg."*

### 5. Påmindelse til Martin

> "Når GitHub-repoet er oppe, kobl det til Netlify-sitet manuelt: Netlify dashboard → Site settings → Build & deploy → Link repository. Så får du auto-deploy ved push til main."

---

## Wardrobe — tech stack additions

Det eksisterende martinibsen.dk-projekt bruger Astro + vanilla CSS + Geist Sans. Wardrobe tilføjer (til /wardrobe-sub-sektionen, ikke til resten af sitet):

- **TypeScript + React** for komponenter (.tsx) — det er hvad vibe-coders bruger
- **Tailwind v4** for layout INDEN FOR /wardrobe — installer som scoped tilføjelse
- **Custom CSS** for Hyper-tokens
- **shiki** for syntax highlighting på copy-blocks

Hvis Tailwind v4 eller `@astrojs/react` ikke er installeret, installér dem. **Vigtigt:** Tailwind må ikke ændre stylingen af det eksisterende site — scope den til Wardrobe-komponenter via Tailwind's content-config og prefix om nødvendigt. Test efter installation at forsiden af martinibsen.dk stadig ser ud præcis som før.

---

## Wardrobe — file structure

Wardrobe-filer ligger ISOLERET. Tilføj følgende uden at røre andet:

```
src/
  components/
    wardrobe/
      hyper/
        Button.tsx
        Input.tsx
        Textarea.tsx
        Select.tsx
        Card.tsx
        Badge.tsx
        Dialog.tsx
        Tabs.tsx
        Switch.tsx
        Toast.tsx
        tokens.css
        globals.css
        cn.ts
      shared/
        CopyBlock.astro
        ComponentShowcase.astro
  layouts/
    WardrobeLayout.astro      (separat layout — IKKE BaseLayout.astro)
  pages/
    wardrobe/
      index.astro
      hyper/
        index.astro
        install.astro
        marathon-club/
          index.astro
          events.astro
          membership.astro
          leaderboard.astro
  utils/
    wardrobe/
      generate-prompts.ts
public/
  wardrobe/
    hyper/
      preview.png
wardrobe-references/         (gitignored — visuel reference fra Variant)
  hyper/
    *.html
```

**Eksisterende filer der må bruges som reference (kun læsning):** `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `astro.config.mjs`, `package.json`. Ingen af disse må modificeres ud over at tilføje React-integrationen og Tailwind-config i `astro.config.mjs` og `package.json` (afhængigheder).

---

## Wardrobe — Token system

Hvert system scoper tokens via `data-system`-attribute:

```css
:where([data-system="hyper"]) {
  --color-bg: #EFFF71;
  /* osv. */
}

[data-system="hyper"] {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
}
```

Brug `:where()` for low-specificity. Komponenter må KUN referere CSS-variables — aldrig hex direkte.

---

## Wardrobe — Component contract (gælder alle systemer)

Alle 10 komponenter SKAL have identisk TypeScript-API på tværs af systemer.

```ts
type ButtonProps = {
  variant?: "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type InputProps = {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "error";
  label?: string;
  hint?: string;
  numericBadge?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

type CardProps = {
  variant?: "default" | "pink" | "blue" | "green";
  numericBadge?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

type BadgeProps = {
  variant?: "default" | "filled";
  children: React.ReactNode;
};

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
};

type TabsProps = {
  tabs: Array<{ id: string; label: string }>;
  activeId: string;
  onTabChange: (id: string) => void;
};

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
};

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
};

type SelectProps = {
  options: Array<{ value: string; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange">;

type TextareaProps = {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "error";
  label?: string;
  hint?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
```

### A11y baseline

- Synlig focus-ring på alle interaktive elementer
- Logisk tab-rækkefølge
- Dialogs trapper focus, lukkes med Escape
- Switches/Tabs er keyboard-navigerbare
- WCAG AA kontrast på almindelig brødtekst

---

## Hyper — system-specifikke tokens

`src/components/wardrobe/hyper/tokens.css`:

```css
:where([data-system="hyper"]) {
  /* Surface */
  --color-bg: #EFFF71;
  --color-fg: #3A1E1E;
  --color-surface: #FFFFFF;

  /* Pastels */
  --color-pink: #FFC1E3;
  --color-blue: #BCEFFF;
  --color-green: #C3FF8B;

  /* Status */
  --color-success: #C3FF8B;
  --color-warning: #FFC1E3;
  --color-danger: #FF4B4B;
  --color-info: #BCEFFF;

  /* Border */
  --border-width: 1px;
  --border-color: #3A1E1E;
  --border: var(--border-width) solid var(--border-color);

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 32px;
  --radius-full: 9999px;

  /* Typography */
  --font-display: "Anton", "Impact", "Arial Narrow", sans-serif;
  --font-body: "Georgia", serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Type scale */
  --text-xs: 10px;
  --text-sm: 12px;
  --text-base: 14px;
  --text-md: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  --text-4xl: 42px;
  --text-5xl: 56px;
  --text-6xl: 80px;
  --text-7xl: 120px;

  --display-line-height: 0.85;
  --display-letter-spacing: -0.02em;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Shadows */
  --shadow-hard: 4px 4px 0px var(--color-fg);
  --shadow-hard-sm: 2px 2px 0px var(--color-fg);
  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.1);

  /* Motion */
  --duration-fast: 100ms;
  --duration-base: 200ms;
  --duration-slow: 400ms;
  --easing: cubic-bezier(0.4, 0, 0.2, 1);
}

[data-system="hyper"] {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

I `globals.css`:

```css
@import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
```

### Visuel reference — KALIBRERINGS-INPUT

I mappen `wardrobe-references/hyper/` ligger 9 HTML-filer eksporteret fra Variant. **Læs mindst 3 af dem før du bygger komponenter.** De viser Hyper's faktiske karakter: spacing-rytme, hvordan komponenter relaterer sig til hinanden, hvilke proportioner der virker.

Tekst-spec'en ovenfor siger HVAD (tokens, patterns, twists). HTML-filerne viser HVORDAN — den levende ramme. Når der er tvivl om en detalje (præcis padding på et card, hvordan en input ser ud i kontekst, hvordan numeric badges placerer sig), gå tilbage til HTML-referencerne og kalibrér imod dem.

HTML-filerne er IKKE kode der skal kopieres direkte — de er reference-materiale.

---

## Hyper — 7 signature patterns

1. **Tynd brun border på alt**: `1px solid var(--color-fg)`. Aldrig shadows til afgrænsning.
2. **Hard offset shadow på active state**: `box-shadow: var(--shadow-hard)`. Aldrig soft shadows på interaktion.
3. **Numeric badges**: 24×24 hvide cirkler, brun border, `position: absolute; top: -10px; right: 20px;` — lapper over kant.
4. **Section titles med horizontal line via `::after`**.
5. **Display-tekst i ALL CAPS**, line-height 0.85, letter-spacing -0.02em, op til 120px. Anton.
6. **Periode efter heading-titel** ("STAY MOVING.", "MARATHON CLUB.").
7. **Bottom nav**: dark pille (32px radius), active item = acid-yellow cirkel.

---

## De 10 komponenter — Hyper twist

### 1. Button
- **Primary**: brun bg + acid text, 32px radius pill, Anton CAPS, letter-spacing 0.5px
- **Secondary**: white bg + brun border, 12px radius
- **Destructive**: rød bg + hvid text, 32px radius pill
- **:active**: `box-shadow: var(--shadow-hard); transform: translate(-2px, -2px);`
- Sizes: sm (32px), md (48px), lg (60px)

### 2. Input
- white bg, brun border, 12px radius, padding 12px 16px
- Label: small caps Anton over inputtet
- Numeric variant: Anton 56px display
- :focus: `box-shadow: var(--shadow-hard-sm);`
- numericBadge prop: badge top-right hvis sat

### 3. Textarea
Som Input men `min-height: 100px;`, body font

### 4. Select
- Custom dropdown, Anton CAPS for value display
- Open-state: hard offset shadow + dropdown-panel med thin dividers

### 5. Card
- white bg, brun border, 12px radius, padding 20px
- Variants: pink/blue/green skifter background
- numericBadge: absolute top:-10px right:20px

### 6. Badge
- Inline pille, white bg, brun border, font-size 10px Georgia
- Filled variant: brun bg, acid text

### 7. Dialog
- white bg, brun border, 12px radius, hard offset shadow
- Title: Anton CAPS + periode
- Backdrop: `rgba(58, 30, 30, 0.4);`
- Trap focus, Escape lukker

### 8. Tabs
- Segmented control, white bg, brun border
- Active: brun bg, acid text, Anton CAPS

### 9. Switch
- Pille 50×26, transparent bg, brun border, brun thumb
- Checked: brun bg, acid thumb

### 10. Toast
- Pille, brun bg, acid text, Anton CAPS, 32px radius
- Variants: success (acid bg, brun text), error (rød bg, hvid text)
- Auto-dismiss 4s, slide-in fra bunden

---

## Distribution: tre måder at få Hyper ind i sit projekt

Wardrobe distribuerer ikke via download. Vi distribuerer via **copy-paste der matcher hvordan vibe-coders rent faktisk arbejder**.

### Copy-block-komponent

`src/components/wardrobe/shared/CopyBlock.astro` — kopier-blok med 3 tabs øverst:

1. **Code** — råt TSX
2. **Prompt** — formuleret AI-prompt klar til paste i Claude Code/Cursor
3. **Theme** — bare CSS-variables (relevant for shadcn-folk der bare vil re-themes)

Visuelt: tabs i Hyper-stil (brun/acid), syntax-highlighted kode (shiki), "Copy" knap der skifter til "Copied ✓" i 2 sek.

### Prompt-format pr. komponent

```
Add this Wardrobe Hyper Button to my project.

1. Create components/ui/wardrobe/Button.tsx with the code below.
2. Add these CSS variables to your globals.css under [data-system="hyper"]:
   --color-bg: #EFFF71;
   --color-fg: #3A1E1E;
   --font-display: "Anton", sans-serif;
   --radius-pill: 32px;
   --shadow-hard: 4px 4px 0px var(--color-fg);
3. Import Anton: @import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
4. Wrap any section using this component with <div data-system="hyper">.

Component code:

[full TSX code]
```

Generér disse prompts ved build via `src/utils/wardrobe/generate-prompts.ts`.

### Theme-tab format

```css
[data-system="hyper"] {
  --color-bg: #EFFF71;
  --color-fg: #3A1E1E;
  /* ... alle hyper-tokens ... */
}

@import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
```

Caption: *"Already on shadcn? Drop this in globals.css and wrap your app in `<div data-system='hyper'>`. Done."*

---

## /wardrobe/hyper/install — one-prompt-install side

Dedikeret route. Indhold:

- Hero: "Install Hyper in 30 seconds"
- Tre tabs øverst:
  - **Claude Code / Cursor** (default)
  - **v0**
  - **Lovable**
- Hver tab har én kæmpe paste-prompt der installerer hele Hyper i ét hug:

```
Install the Wardrobe Hyper theme in my project.

Step 1 — Create these CSS variables in globals.css:
[full tokens.css block]

Step 2 — Add this Google Fonts import to globals.css:
@import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");

Step 3 — Create these 10 component files in components/ui/wardrobe/:
[Button.tsx, Input.tsx, ... alle 10 komponenter med fuld kode]

Step 4 — Create cn.ts utility:
[cn.ts code]

Step 5 — Wrap the section/page you want themed with <div data-system="hyper">.

Done. You can now use <Button>, <Input>, <Card>, etc. and they'll render in Hyper.
```

Én "Copy entire prompt" knap øverst. Generér prompten ved build-time fra de samme komponentfiler.

---

## /wardrobe/hyper/index.astro — system-side

**House style: HYPER.** `<body data-system="hyper">` så alle tokens er aktive.

### Indhold

- Header: "HYPER." (Anton, kæmpe)
- Subtitle: *"Acid yellow. Brown borders. CAPS forever. Stop building purple-gradient apps."*
- 3 CTA buttons:
  - "INSTALL IN 30 SEC →" (primary, link til /install)
  - "SEE IT LIVE →" (secondary, link til marathon-club)
  - "GITHUB" (tertiary, link til repo-mappen)

- Section "TOKENS." — visual grid: farver som chips, font-eksempler i Anton + Georgia, radius-eksempler, shadow-eksempler.

- Section "COMPONENTS." — for hver af de 10:
  - Live preview (komponenten i fuld karakter)
  - CopyBlock med 3 tabs (Code / Prompt / Theme)

- Section "INSTALL." — kort tease af `/install`-siden + en stor "BIG GREEN INSTALL BUTTON →".

- Section "MCP COMING SOON" — tease:
  > *"Wardrobe MCP server is in the works. Soon you'll just say 'install hyper' to your AI and it'll be done. Sign up below for the drop."*

- Email-signup (Loops): "GET THE MCP DROP"

- Section "SEE IT LIVE." — 3 thumbnail-cards til Marathon Club-demo-sider.

---

## /wardrobe — overview-side

`src/pages/wardrobe/index.astro`

**House style: helt neutral.** Sort/hvid, system-ui font, ingen acid, ingen Anton.

### Indhold

- Header: simpel "← back to martinibsen.dk" link øverst-venstre
- Hero (centreret):
  - H1: "Wardrobe"
  - Tagline: *"Themes for vibe-coded apps. Stop shipping the same purple landing page."*
  - Subtitle: *"Made by Martin Ibsen — 4 personalities, drop-in ready for Claude Code, Cursor, v0, Lovable, your shadcn project, whatever. Free. MIT."*

- Section "THEMES":
  - Grid med 4 cards
  - Hyper-card: live mini-preview + navn + 1-sætning vibe + "Try Hyper →"
  - 3 andre: "Coming soon" placeholders

- Section "HOW IT WORKS":
  - 3 steps: "Pick a theme" → "Copy the install-prompt" → "Paste in your AI session"

- Email-signup: "Get notified when next theme drops" (Loops)

- Footer: GitHub-repo, MIT-license, link til hovedsite

---

## Demo: Marathon Club

Habitat for Hyper. Fiktiv running club. Viser systemet i et website-format (ikke app).

### Brand

- Navn: **MARATHON CLUB.**
- Tagline: *"Every street is a track."*
- Etableringsår fiktion: 2019

### Sider (i `src/pages/wardrobe/hyper/marathon-club/`)

#### `index.astro` — homepage
- Header: "MARATHON / CLUB." (display, line-break mid-titel)
- Hero card (blue): "NEXT RUN. Sunday Apr 28 — Aarhus harbour 10K"
- Stats grid: "234 MEMBERS" (pink), "47 EVENTS YEAR" (green), "1,920 KM TOTAL" (blue)
- Section "UPCOMING.": 3 events som Cards
- Section "TOP RUNNERS THIS MONTH.": top 5 som Cards med numericBadge "01"–"05"
- CTA-knap: "JOIN THE CLUB →"
- Bottom nav: Home (active), Events, Members, Profile

#### `events.astro`
- Header: "EVENTS."
- Filter tabs: "All", "This Month", "Past"
- Events som Cards med varierende pastel-baggrunde
- Hver event: title, date, distance, signup-knap

#### `membership.astro`
- Header: "JOIN US."
- 3 medlemstier som Cards (pink/blue/green)
- Hver tier: pris, perks-liste, "PICK THIS." button
- Form nederst: Input (navn), Input (email), Select (tier), Switch (newsletter), Button (submit)

#### `leaderboard.astro`
- Header: "LEADERBOARD."
- Hero-card (blue): "MONTH SO FAR. 1,420km collective"
- Tabs: "Distance", "Pace", "Streak"
- 20 rows: rank-badge, navn, stat (Anton-display)

### Footer på alle Marathon Club-sider

```
MARATHON CLUB. — Every street is a track. © 2026
[Built with Wardrobe / Hyper] — link til /wardrobe/hyper
```

---

## Loops integration

`src/pages/api/wardrobe-signup.ts`:

```ts
export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
  }

  const res = await fetch("https://app.loops.so/api/v1/contacts/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.LOOPS_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      source: "wardrobe",
      mailingLists: { wardrobe: true },
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Loops error" }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
```

- `LOOPS_API_KEY` skal være i `.env`
- Print påmindelse: *"Husk at oprette mailing list 'wardrobe' i Loops dashboard før første signup."*

---

## PostHog events

| Event | Hvor | Properties |
|---|---|---|
| `wardrobe_view` | /wardrobe overview | – |
| `wardrobe_system_view` | /wardrobe/hyper | `system: "hyper"` |
| `wardrobe_install_view` | /wardrobe/hyper/install | `system: "hyper"` |
| `wardrobe_demo_view` | /wardrobe/hyper/marathon-club/* | `system: "hyper"`, `page` |
| `wardrobe_copy_code` | "Copy" i Code-tab | `component`, `system` |
| `wardrobe_copy_prompt` | "Copy" i Prompt-tab | `component`, `system` |
| `wardrobe_copy_theme` | "Copy" i Theme-tab | `system` |
| `wardrobe_copy_install_full` | "Copy entire install" på /install | `system`, `target: "claude-code" \| "cursor" \| "v0" \| "lovable"` |
| `wardrobe_signup` | Email signup | `source: "wardrobe"` |
| `wardrobe_github_click` | Klik på GitHub-link | `system` |

---

## Quality checks (efter Wardrobe-build, FØR commit)

1. **Eksisterende site uændret**: Åbn martinibsen.dk's forside. Ser præcis ud som før Wardrobe-build? Theme toggle virker stadig? Geist Sans loader stadig? Blog renderer stadig korrekt? Hvis noget på det eksisterende site er ændret, ROL TILBAGE og fortæl Martin.
2. **Wardrobe sammenhæng**: Scroll /wardrobe/hyper. Føles alle 10 komponenter som samme system?
3. **Differentiation**: Sammenlign med standard shadcn-knap. Mærkbart anderledes?
4. **A11y**: Tab gennem Marathon Club. Fuld keyboard-nav. Focus-ring synlig.
5. **Responsive**: 375 / 768 / 1280 px.
6. **Copy actually copies**: Test alle 3 copy-modes (code/prompt/theme) faktisk lægger korrekt indhold på clipboard.
7. **Install-prompt virker**: Smoke-test ved at åbne en tom Vite + React + Tailwind v4 sandbox, paste install-prompten i Claude Code, og se om Hyper renderer.
8. **Build**: `npm run build` skal gennemføre uden errors.

---

## License

MIT, gælder hele Wardrobe og alle 4 systemer. Tilføj `LICENSE`-fil i repo-root hvis ikke allerede tilstede:

```
MIT License

Copyright (c) 2026 Martin Ibsen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Når Wardrobe-build er færdig

Print til Martin:

> "Hyper er bygget. Tjek FØRST at martinibsen.dk's forside og blog ser uændret ud — det er det vigtigste check. Gå derefter til http://localhost:4321/wardrobe — overview. /wardrobe/hyper — system-side. /wardrobe/hyper/install — one-prompt install. /wardrobe/hyper/marathon-club — demoen."

Commit message: `feat(wardrobe): add Hyper theme + Marathon Club demo (isolated sub-section)`. Push til main.
