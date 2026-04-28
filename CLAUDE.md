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

