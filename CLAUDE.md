# martinibsen.dk

Personal website for Martin Ibsen — PM, product designer, AI builder.

## Tech stack
- **Astro 5** (`output: 'static'`) with the Netlify adapter
- **Vanilla CSS** in `src/styles/global.css` — no Tailwind, no CSS-in-JS
- **No client framework** by default. Vanilla TS only. The `/stilnote` board uses `sortablejs` (vanilla DnD).
- **Fonts**: `Inter` + `Space Mono` (Google Fonts, loaded in `BaseLayout.astro`)
- **Hosting**: Netlify, domain `martinibsen.dk` (DNS via one.com)
- **Deployment**: push to `main` → Netlify auto-builds

## Design system (editorial, light-only)
CSS tokens in `src/styles/global.css`:
- `--bg: #e4e4e2`, `--bg-2: #dcdcda`
- `--fg: #1a1a1a`, `--muted: #888`
- `--line: rgba(26,26,26,0.14)`, `--line-strong: rgba(26,26,26,0.35)`
- `--font-display: 'Inter'`, `--font-mono: 'Space Mono'`
- `--transition-fast: 200ms ease`

**Conventions**:
- Hairline `0.5px` borders in `var(--line)` or `var(--line-strong)`
- Mono caps for UI chrome (nav, tags, buttons): 9–11 px, `letter-spacing: 0.05–0.08em`, `text-transform: uppercase`
- Inter for editorial copy: weight 400–500, tight letter-spacing on headings (`-0.02em`)
- Light theme only (no dark mode, no theme toggle)
- Monochrome — no accent colors except a single overdue red (`#b00020`) on `/stilnote`

## Structure
```
src/
├── layouts/BaseLayout.astro       # nav + head, supports `noindex` prop
├── layouts/BlogPost.astro
├── pages/
│   ├── index.astro                # front page
│   ├── om.astro                   # bio
│   ├── tanker.astro               # blog list
│   ├── ai-for-produktledere.astro # newsletter landing
│   ├── stilnote.astro             # internal Kanban (noindex)
│   ├── blog/[...slug].astro
│   └── api/
│       ├── subscribe.ts           # Loops newsletter signup
│       └── kanban.ts              # GET/PUT for /stilnote board
├── lib/
│   ├── kanban-types.ts            # shared Kanban types
│   └── kanban-storage.ts          # Netlify Blobs read/write (server)
├── scripts/
│   ├── kanban-client.ts           # main entry, state, DnD
│   ├── kanban-render.ts           # DOM rendering
│   ├── kanban-modal.ts            # create/edit dialog
│   └── kanban-api.ts              # client fetch wrapper
├── content/blog/                  # markdown posts (frontmatter: title, date, tags, subtitle, readTime)
├── content.config.ts
├── data/projects.ts               # typed project list shown on front page
└── styles/global.css              # all styles
```

## Internal Kanban (`/stilnote`)
- Private to-do board for Martin & Sophia. Public route, **no auth** — kept off Google with `<meta name="robots" content="noindex">`.
- Three columns: Backlog / To Do / Done. Cards have title, description, assignee (martin|sophia|none), due date.
- Storage: a single JSON document in **Netlify Blobs** (store `stilnote-kanban`, key `board`). No separate database.
- Last-write-wins on PUT. Acceptable for two users with manual refresh.
- Drag-and-drop on desktop via SortableJS. Mobile uses the column dropdown in the edit modal.
- **Local dev**: `astro dev` won't have Blobs context — run `netlify dev` to exercise the API locally. Production "just works".

## API endpoints
- `POST /api/subscribe` — Loops newsletter signup. Requires `LOOPS_API_KEY` env var.
- `GET  /api/kanban` — return current board.
- `PUT  /api/kanban` — replace board (body: `{ board }`). Validates and renumbers positions.

## Deployment
- `npm run build` → `dist/`
- Netlify reads `netlify.toml` (build command + 301 redirects for retired `/wardrobe`).
- Push to `main` triggers a deploy automatically.

## Conventions
- Site language is Danish (`lang="da"`). All UI copy in Danish, code/comments in English.
- TypeScript everywhere, no `any`.
- Data layer isolated in `src/lib/*` — never call Blobs / external services from `.astro` or component files.
- Keep client modules under ~150 lines. Split by responsibility (render / modal / dnd / api).
- Never overwrite or delete existing blog posts when adding new ones (see user memory).
