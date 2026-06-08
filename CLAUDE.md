# CLAUDE.md — AI Assistant Guide for viktordemydov.com

This document describes the codebase structure, development workflows, and conventions for AI assistants working on this project.

---

## Project Overview

**viktordemydov.com** is a personal portfolio static website for Viktor Demydov, a Senior Product Designer & Design Engineer. It is built with [Eleventy (11ty)](https://www.11ty.dev/) v3.1.5.

- **Type:** Static site generator (no backend, no database)
- **URL:** https://viktordemydov.com
- **GitHub:** https://github.com/VicD129/viktordemydov.com
- **License:** MIT

---

## Tech Stack

| Layer | Technology |
|---|---|
| Static Site Generator | Eleventy (11ty) v3.1.5 |
| Templating | Liquid (default), Nunjucks also supported |
| Styling | Plain CSS (no preprocessor) |
| Fonts | DM Sans (self-hosted WOFF2) |
| Images | WebP or AVIF |
| PWA | Web App Manifest only (no service worker — `sw.js` is a self-destruct kill switch) |
| SEO | JSON-LD structured data, Open Graph, Twitter Card |
| JavaScript | Inline IIFE only (starfield background in `layout.html`) |

---

## Repository Structure

```
viktordemydov.com/
├── index.html                  # Home page (front matter + content)
├── 404.html                    # Custom error page
├── eleventy.config.mjs         # Eleventy build configuration
├── package.json                # npm scripts and single dependency
├── manifest.json               # PWA manifest
├── sw.js                       # Self-destruct service worker (NOT registered — kill switch only)
├── robots.txt                  # SEO directives
├── sitemap.liquid              # Sitemap template — /sitemap.xml is generated every build
│
├── _data/
│   └── assets.js               # Global data — cssVersion (style.css mtime) for cache-busting
│
├── _includes/
│   ├── layout.html             # Master layout — all pages inherit this
│   ├── icon-arrow-up-right.html # Shared SVG partials — use via {% include %}
│   ├── icon-arrow-right.html
│   ├── icon-arrow-left.html
│   └── icon-download.html      # download glyph — used by the hero "Download CV" button
│
├── css/
│   └── style.css               # All styles (single file, no preprocessor)
│
├── fonts/                      # Self-hosted DM Sans WOFF2 files
│   ├── DMSans-ExtraLight.woff2 # weight 200
│   ├── DMSans-Regular.woff2    # weight 400
│   ├── DMSans-Medium.woff2     # weight 500
│   └── DMSans-SemiBold.woff2   # weight 600
│
├── img/                        # All images in WebP or AVIF format
│
├── projects/                   # One .html file per portfolio project
│   ├── clockworx-comeback.html
│   ├── clockworx.html
│   ├── mvr.html                # "Motor Vehicle Services" project — the mvr slug/file/--mvr-color/.mvr-bg keep the legacy abbreviation (orig. "Motor Vehicle Registration"); don't rename them (URL/SEO stability). The internal "Motor Vehicle Registration" sub-service in the page log is a distinct service name — leave it.
│   ├── myabiportal.html
│   └── tourhunter.html
│
├── cv/                         # Résumé PDF source (excluded from build via .eleventyignore)
│   └── cv.html                 # rendered to /Viktor-Demydov-CV.pdf via `npm run build:cv`
│
├── Viktor-Demydov-CV.pdf       # Built résumé — served at the site root (hero "Download CV")
│
└── _site/                      # BUILD OUTPUT — auto-generated, never edit manually
```

---

## Development Workflow

### Prerequisites

- Node.js (any recent LTS version)
- npm

### Install Dependencies

```bash
npm install
```

### Common Commands

| Command | Description |
|---|---|
| `npm start` | Start dev server with live reload |
| `npm run serve` | Same as start |
| `npm run watch` | Watch for changes, rebuild without serving |
| `npm run build` | One-time production build into `_site/` |
| `npm run debug` | Verbose debug mode (`DEBUG=* eleventy`) |
| `npm run build:cv` | Render `cv/cv.html` → `Viktor-Demydov-CV.pdf` via headless Chrome (see [CV / Résumé PDF](#cv--résumé-pdf)) |

### Development Server

`npm start` launches a local server (default: `http://localhost:8080`) with live reload. Changes to `css/` trigger automatic reload via Eleventy's watch targets.

---

## Eleventy Configuration (`eleventy.config.mjs`)

Key settings:

- **Input:** `.` (repo root)
- **Output:** `_site/`
- **Includes:** `_includes/`
- **Template formats:** `html`, `md`, `njk`, `liquid`
- **Default HTML engine:** Liquid
- **Pass-through copies:** `fonts/`, `css/`, `img/`, `manifest.json`, `sw.js`, `robots.txt`, `*.png`, `*.ico`, `*.xml`, `*.pdf` (the latter serves the root-level `Viktor-Demydov-CV.pdf`)
- **Watch targets:** `css/` (triggers live reload)
- **Custom filter:** `fileMtime` — returns a template's source mtime as `YYYY-MM-DD`; used by `sitemap.liquid` for `<lastmod>`
- **`.eleventyignore`:** excludes `CLAUDE.md`, `README.md`, `docs/`, and `cv/` from the build so internal docs and the CV source are neither published as routes nor leaked into the generated sitemap
- **Sitemap:** `/sitemap.xml` is generated from `sitemap.liquid` (loops `collections.all`) on every build — never hand-edit it

---

## Adding Pages

### New Portfolio Project

1. Create `projects/your-project-name.html` with YAML front matter:

```html
---
title: "Project Title | Viktor Demydov"
description: "Short page description for SEO."
layout: layout.html
---

<!-- page content here -->
```

2. Add a project card to `index.html` in the "Top Projects" section — insert it as a direct child of `div.projects-grid`, **before** the LinkedIn CTA card (last item). Use the icon partials (`{% include "icon-arrow-right.html" %}`) — do not paste raw SVG.
3. Add a brand color variable to `css/style.css` if needed (see Color Conventions below).

The sitemap needs no manual update — `sitemap.liquid` regenerates `/sitemap.xml`
from `collections.all` on every build.

---

## CSS Conventions

**Single file:** All styles live in `css/style.css`. Do not create additional CSS files.

### CSS Custom Properties

Defined at `:root` — always use variables, never hardcode values:

```css
/* spacing — 8-point grid */
--space-1:  0.25rem; /*   4px */
--space-2:  0.5rem;  /*   8px */
--space-3:  1rem;    /*  16px */
--space-4:  1.5rem;  /*  24px */
--space-5:  2rem;    /*  32px */
--space-6:  3rem;    /*  48px */
--space-7:  5rem;    /*  80px */
--space-8:  10rem;   /* 160px */
--space-9:  12rem;   /* 192px */
--space-10: 15rem;   /* 240px — used for inter-section gaps on the home page */

/* brand colors */
--brand-color: #E8A820;         /* site-wide brand yellow (mirror in cv/cv.html --brand + --rule) */

/* project accent colors */
--pegasus-color: #9b3831;       /* Clockworx accent (class: pegasus-bg) */
--abi-color: #f26d1f;
--mvr-color: #f6de41;
--tourhunter-color: #5095e8;

/* theme (dark-mode only) */
--bg-color: #0d0d0d;            /* page background */
--bg-overlay: rgba(13,13,13,0.85); /* translucent dark surface — shared by the fixed nav and the non-glass OUTCOMES statement blocks */
--text-color: #e9e9e9;          /* body text */
--link-color: #e9e9e9;
--link-hover-color: #242424;
--status-color: #4ade80;        /* "Open to work" green */
--text-secondary: #6c757d;      /* muted text — ticker dot separators, .text-secondary util */

/* corner radius */
--radius-pill: 50rem;           /* fully rounded capsule — buttons (.btn/.hero-cv) */
--radius-lg: 1.25rem;           /* 20px — iOS-style soft corners for cards, glass panels, chat bubbles */

/* layout */
--content-wide: 1200px;         /* wide cap for the .section-wide popout helper (see Layout below) */
```

### Spacing

Use the **8-point grid system**. Spacing values must be multiples of 8px. Use CSS custom property variables (e.g., `var(--space-3)`) rather than arbitrary pixel values.

### Theming

- **Dark mode only.** The site renders a single dark palette regardless of OS preference. Use the named theme variables — `--bg-color` (`#0d0d0d`), `--text-color` (`#e9e9e9`), `--link-color`, `--link-hover-color`, `--status-color`, `--text-secondary` — rather than hardcoding hex values. They live in `:root` in `css/style.css`.
- Do **not** add `@media (prefers-color-scheme: ...)` blocks or a light theme — light mode was intentionally removed. Use the `:root` theme variables for all colors.

### Corner radius

Two radius tokens drive all rounding — never hardcode a `border-radius`:

- **`--radius-pill` (`50rem`)** — fully rounded capsule. Used by the shared button
  rule (`.btn, .hero-cv`). The nav links are **not** pills — they read as
  plain text (no hover chip; see Site nav below). The skills ticker is **not** a pill
  either — its glass strip is squared and edge-faded (see Skills ticker below).
- **`--radius-lg` (`1.25rem` / 20px)** — iOS-style soft corners. Used by `.card`
  (with `overflow: hidden` so the flush top image clips to the shape), the padded
  project glass panels (`.bg-glass.p-3`), and `.chat-bubble`. `.chat-avatar` is a full
  circle (`border-radius: 50%`).

The global `a:hover`/`a:focus` keeps its own small `0.125rem` brand-yellow fill chip — the
nav links override it to plain brand-yellow text (no fill, no radius). Don't pill-round
inline content images.

### Class Naming

BEM-like naming convention:

```
card               → block
card-body          → element
card-title         → element
card--featured     → modifier (when needed)
```

Utility classes follow a short-hand pattern: `mb-*` (margin-bottom), `mt-*`, `ms-*`, `p-*`.

### Class inventory

A quick map of the class families in `style.css` so existing classes get reused instead
of reinvented (not an exhaustive per-rule reference — read the file for specifics):

- **Typography:** `.display-1`, `.display-hero`, `.section-label`, `.fw-bold` (the single weight-600 helper — `.fw-semibold`/`.text-bold`/`.font-weight-bold` aliases were removed; markup uses `.fw-bold`) / `.fw-medium` / `.fw-normal` / `.fw-extralight`, `.text-center` / `.text-right` / `.text-italic` / `.text-secondary`, `.small`
- **Layout:** `.container-fluid`, `.row`, `.col` / `.col-sm-6` / `.col-md-6` / `.col-md-12`, `.content`, `.footer`, `.section-wide` (the **only** width-popout helper — lets one block break out of the 900px reading column up to `--content-wide` (1200px), capped at `94vw` and auto-centered via a negative `margin-left`; collapses to a normal in-column block on narrow screens. Relies on no ancestor — `.content`/`.work`/`.work-item` — clipping overflow; used on the OVERVIEW screenshot panel of every project page)
- **Spacing utilities:** a **sparse** subset of `.mb-*` / `.mt-*` (only the steps actually used — e.g. `.mb-6`, `.mt-7`, `.mt-9`, `.p-0` were dropped as unused), plus `.ms-3`, `.p-3`, `.px-4`, `.pr-4` — all map to the `--space-*` scale. (Note: `.mb-5` maps to `--space-6`, an intentional off-by-one kept for back-compat — add new steps by their `--space-N` value, not by index.)
- **Sections:** `.work`, `.work-item`, `.work-header`, `.contacts`, `.work-meta` (the project-page metadata block — Role/Skills/Period/Contractor/Website — inside `.work-header`. Authored as `<div class="bg-overlay p-3 work-meta">` so it reads as a solid dark `.bg-overlay` card. `.work-meta` left-aligns it (overriding `.work-header`'s centered default), makes each `<p>` a `display:flex` label/value row, and gives the `.text-secondary` label span a fixed `flex: 0 0 6rem` column — `6rem` fits the longest label, "Contractor:" — so every value starts at the same x and long values hang-indent under the value column; it also resets the `margin-left` the broader `.work-header span` rule would add. No `mb-5` on the inner rows — `.work-header`'s own `margin-bottom` spaces the card from the next section.)
- **Site nav:** `.site-nav` (fixed bar), `.site-nav__inner` (constrained inner row), `.site-nav__left` (left flex group: the home link, plus the availability badge on project pages — see below), `.site-nav__home` (text-only brand link — "Viktor Demydov", `color: var(--text-color)`, no padding), `.site-nav__brand`, `.site-nav__links` (right-side icon group), `.site-nav__icon-link` (icon-only nav link, `color: var(--text-color)`). The home + icon links read as plain text: white by default, and on hover they override the global `a:hover` to brand-yellow text with no background fill and no chip radius (no btn-like padding). There is **no** avatar image in the nav (and no `@media (max-width: 575px)` brand-hiding rule) — the brand text shows at every breakpoint. **Availability badge:** `.site-nav__status` (the green "● Open to work" badge — `inline-flex`, `0.85rem`, `color: var(--status-color)`, mirroring the hero's `.hero-status`) holds a `.site-nav__status-dot` (an 8px `var(--space-2)` green circle) + the plain text "Open to work" (**no** "(Remote)" suffix — the parenthetical is only on the home hero's `.hero-status`). It is rendered in `layout.html` **only on project pages** (`{% if page.url contains "/projects/" %}`), where the hero — which carries this badge elsewhere — is hidden (see Project Page Structure / Layout Template). Under the existing `@media (max-width: 575px)` block the nav's horizontal padding trims to `var(--space-3)` so the one-row nav (`Viktor Demydov · ● Open to work · [in][gh]`) fits small phones.
- **Buttons:** `.btn` and `.hero-cv` share **one** rule (`inline-flex`, `gap: var(--space-2)`, `--radius-pill`, brand-yellow `:hover/:focus` fill). **Pair with `.bg-glass`** in markup for the surface. Reused by the hero "Download CV" button, the project page bottom "Back" link (`.btn.bg-glass` wrapping the `icon-arrow-left` partial + "Back" text), and the footer "Follow me" links (`.btn.bg-glass` with the `icon-linkedin`/`icon-github` brand glyph before the label + the `icon-arrow-up-right` after). Don't re-add a standalone `.hero-cv` block — edit the shared rule. **Icon-only round variant:** `.btn-icon` sizes the pill into a fixed `var(--space-6)` (48px) square so a single glyph with **no text** reads as a circle (`--radius-pill`), `font-size: 1.25rem`, `padding: 0`. Used by the **project-page top-left back link** — `<a class="btn btn-icon bg-glass work-back" aria-label="Back to home">` (icon-only, so it carries an `aria-label`) placed as the first child of `.work-item`, before `.work-header`. `.work-back` makes it block-level `display: flex` (overriding `.btn`'s inline-flex) so it owns its own row at the top-left, with `margin-bottom: var(--space-4)` down to the centered header. Every project page thus has **two** back affordances: this top-left icon button and the original text "Back" button after the content.
- **Hero:** the whole `<header class="header">` block (subtitle + `.hero-status` + skills ticker + Download CV) renders on **every page except project pages** — in `layout.html` it is wrapped in `{% unless page.url contains "/projects/" %}` (project pages lead with their own `.work-header` instead and surface availability via the nav `.site-nav__status` badge). `.hero-status` — "Open to work (Remote)" badge below the hero subtitle (color `var(--status-color)`); `.hero-cv` — the "Download CV" button below it (see Buttons above).
- **Skills ticker:** an animated scrolling single-line marquee in the **hero** (in `layout.html`, between the `.hero-status` badge and the `.hero-cv` button, so it shows on **every page except project pages** — the hero block is hidden on `/projects/*`). Markup nests three elements: `.skills-ticker.bg-glass` (the glass strip — **squared, not pilled**; owns the left/right edge-fade `mask-image` so the panel's fill, blur **and** border dissolve at the ends, no hard side borders/corners) > `.skills-viewport` (clips the scrolling overflow) > `.skills-track` (the flex track that scrolls). `.skill` is now **plain text** (no pill surface); skills are joined by a muted `·` dot via `.skill::after` (`content: "\00B7"`, color `var(--text-secondary)`) — the dot also bridges the loop seam, and `.skill:last-child::after { content: none }` drops the trailing dot. The skill list is a single Liquid `{% assign skills = "…" | split: "," %}` array in `layout.html`, looped **twice** into the track (the second copy `aria-hidden="true"`) so the `skills-scroll` keyframe can translate `-50%` for a seamless loop. **`.bg-glass` is now safe here** (unlike the old per-pill design): one **static** glass panel = a single `backdrop-filter` blur, not ~36 moving ones, so the starfield no longer re-blurs every frame. Pauses on hover; under `prefers-reduced-motion` the duplicate pills hide, the mask/overflow reset, the track becomes a static centered wrap, and a `:has(+ .skill[aria-hidden="true"])::after { content: none }` rule suppresses the now-dangling trailing dot. Scroll speed = the `40s` duration on `.skills-track`. The strip caps at `max-width: 900px` (the layout width — matching `.content` and `.site-nav__inner`), centered via `margin: … auto`. Keep the list in sync with the CV skills in `cv/cv.html` (see the CV section). (Remote availability is signalled by the hero `.hero-status` badge — "Open to work (Remote)".)
- **Chat recommendations:** `.chat-thread`, `.chat-sender`, `.chat-avatar` (full circle, `border-radius: 50%`), `.chat-sender-info` / `.chat-sender-name` / `.chat-sender-role`, `.chat-bubble` (`--radius-lg` soft corners; pair with `.bg-glass` for the surface — see below)
- **Card brand modifiers:** `.abi-bg`, `.pegasus-bg`, `.mvr-bg`, `.tourhunter-bg`, `.brand-bg`
- **Project tags:** `.project-tags` (flex/wrap row) > `.tag` (muted quick-scan labels — three per project: Domain · Audience · Type). Plain dot-separated text reusing the `.skill` pattern (`.tag::after` is a `·` in `var(--text-secondary)`; `.tag:last-child::after { content: none }`) — **not** pills, no JS. Authored inline on the 5 home-grid project cards (after `.card-title`) **and** on each project page (after the `<h1>` in `.work-header`). Not on the LinkedIn CTA or certification cards. Do **not** reuse the `.skill` class itself (it is white + carries ticker semantics). On **cards** the tags inherit the link's hover color (`.card a:hover .tag`) so they stay legible on the colored hover fill (white on dark-accent cards, dark on the light `mvr-bg`). On **project pages** the tags read as white labels (`.work-header .tag` sets `color: var(--text-color)` plus a `margin-left: 0` / `font-weight: 400` reset that neutralizes the broader `.work-header span` rule — `font-weight: 300; margin-left: var(--space-3)`, meant for the h1 accent + metadata label spans — which would otherwise leak a stray indent and extra-light weight onto the tags; the muted `·` dot separators stay, mirroring the skills ticker) rather than the muted grey used on cards, and the spacing is CSS-owned, not utility-class-owned: the work-header `<h1>` carries **no** `mb-5` — `.work-header h1` gives a tight `--space-2` gap to the tags and `.work-header .project-tags` (centered) carries the `--space-6` gap down to the next block (the distance the title's old `mb-5` used to provide).

### Project / Certification grid (`.projects-grid`)

`.projects-grid` is a CSS Grid class used on the home page for both the "Top Projects" cards and the "Latest Certifications" cards. It produces a two-column layout with equal horizontal and vertical gap (`var(--space-3)`), collapsing to a single full-width column below 576px.

- Use `.projects-grid` as the direct parent of `.card` elements — do **not** wrap cards in `col-sm-6` or any other column div.
- The 6th card in the projects grid is the LinkedIn CTA. Its `.card-body` carries `.card-body--end` to pin the text to the card bottom.
- The certifications section follows the same structure: `h2` as a direct `<main>` child, then `div.container-fluid > div.projects-grid > cards`.

### `.card-body--end` modifier

Pins a `.card-body`'s content to the bottom by overriding `justify-content` to `flex-end`. Works because `.card-body` sets `display: flex; flex-direction: column`. The rule must appear **after** `.card-body` in `style.css` — it relies on source order, not extra specificity.

### Fixed nav and scroll offsets

`body { padding-top: var(--space-7) }` (80px) reserves space for the fixed `.site-nav` bar on every page. Do not remove it.

**Project-page lead-in spacing.** The shared `.content` (`margin-top: var(--space-7)`) and `.work-item` (`margin-top: var(--space-6)`) top margins were sized to sit below the hero. On project pages the hero is gone, so that stacked margin becomes dead space under the fixed nav. `layout.html` tags those pages with `<body class="page-project">` (`{% if page.url contains "/projects/" %}`) and `style.css` collapses the gap: `body.page-project .content { margin-top: 0 }` + `body.page-project .work-item { margin-top: var(--space-4) }`, so the top-left back link / header sit a comfortable ~`--space-4` below the nav (the body still reserves the `--space-7` nav clearance). Keep these overrides if you re-tune project-page top spacing — don't touch the shared `.content`/`.work-item` margins (those still serve the hero on the home page).

Any `<h2 id="…">` used as an anchor target must have `scroll-margin-top: var(--space-7)` so the heading clears the fixed bar when jumped to. This is handled by the rule `h2[id], footer[id] { scroll-margin-top: var(--space-7) }` in `style.css` — extend it if new anchor targets are added at other element types.

The `.site-nav` uses its own dark glass styles (`var(--bg-overlay)` — `rgba(13,13,13,0.85)` — + blur) rather than the `.bg-glass` utility, so its surface can be tuned independently. The OUTCOMES statement blocks reuse the same `--bg-overlay` fill (without the blur, so they stay non-glass).

### Frosted-glass surface (`.bg-glass`)

`.bg-glass` is the single source of truth for the frosted-glass panel surface
(semi-transparent fill + `backdrop-filter: blur()` with `-webkit-` prefix + subtle
border) layered over the starfield. There is no `.bg-dark` — it was replaced by
`.bg-glass`.

Its **non-glass sibling is `.bg-overlay`** — a solid-reading dark surface that paints
`var(--bg-overlay)` (the fixed nav's `rgba(13,13,13,0.85)` fill) with `--radius-lg`
corners and white text, but **no blur**. Use it for cards that should sit opaque over
the starfield rather than frosted. Pair with `.p-3` for padding. Used by the project
stat cards (e.g. the "AB InBev #1 / SoftServe #2" blocks on `myabiportal.html`) and
mirrored by the OUTCOMES statement blocks (which set the same fill/radius inline on
`.bg-glass.p-3 li`).

- Add `bg-glass` in markup to any block that should read as a glass panel.
- `.chat-bubble` carries **only** layout/typography. To give a chat bubble the glass
  surface, add `bg-glass` alongside it: `class="chat-bubble bg-glass"`. Do **not**
  put surface/background styles back on `.chat-bubble`.
- Keep `backdrop-filter` and `-webkit-backdrop-filter` together so Safari renders the blur.
- **Bullet lists inside a padded panel** use scoped rules: `.bg-glass.p-3 ul`
  sets `list-style: none`, no gutter (`padding-left: 0`; the per-bullet icon sits
  in each card's own left pad — see below) plus a `--space-3` top gap, and lays the
  items out as a **responsive two-column card grid** — `display: grid;
  grid-template-columns: repeat(2, 1fr); gap: var(--space-4)` on desktop, collapsing
  to one column under `575px` (mirroring `.projects-grid`). The `gap` provides the
  inter-card spacing, so there is **no** `li + li` margin rule. A
  bold lead-in (`.bg-glass.p-3 li .fw-bold`) renders `display: block` at `1.25rem`
  (the h5/`.section-label` modular-scale step) with a `--space-1` gap to its
  description, so each item reads as a sub-label + payoff. The `.p-3` qualifier
  is deliberate — it keeps the rules off the `.skills-ticker` `ul` (which is
  `.bg-glass` but **not** `.p-3`). Drives the OUTCOMES panels on every project page.
- **OUTCOMES statement blocks + bullet icons** — inside the glass panel the `ul`
  has `list-style: none` and no gutter (`padding-left: 0`); each `<li>` is its own
  **non-glass dark card** — `background: var(--bg-overlay)` (the same
  `rgba(13,13,13,0.85)` fill as the fixed nav, but with no blur),
  `--radius-lg` soft corners, `padding: var(--space-4) var(--space-4) var(--space-4)
  var(--space-7)` (the wide left pad is the icon gutter). The cards are arranged in a
  two-column grid (one column on phones) via the parent `.bg-glass.p-3 ul` rule, and
  spaced by its `gap: var(--space-4)` (no per-`li` margin). Every `<li>` opens with
  `<span class="outcome-icon">{% include "icon-X.html" %}</span>` before the
  `.fw-bold` lead-in, giving each statement a **distinct** Bootstrap Icon. The icon
  is `position: absolute; left: var(--space-4); top: 0; bottom: 0; display: flex;
  align-items: center` so it sits in the gutter **vertically centered** against the
  full card height, `font-size: 1.5rem`, `color: var(--brand-color)` (brand-yellow).
  The partials are `bi`-style (16×16, `currentColor`) like the rest of `_includes/`;
  the closing "Impact" bullet on every page reuses `icon-graph-up-arrow.html`. When
  adding a new OUTCOMES bullet, pick (or add) a fitting `icon-*` partial — never an
  inline `<svg>`.

### Custom cursor

The site replaces the OS pointer with a custom SVG arrow, defined as two static
`cursor: url(...)` data-URI rules in `css/style.css`:

- `html { cursor: ... default }` — near-white (`#e9e9e9`) arrow, black stroke (the idle/default state).
- `a, button, [role="button"], label[for], select, summary { cursor: ... pointer }` — black arrow, white stroke (links/controls).

**Animated gradient wave:** the **default** arrow plays a brand-yellow (`#E8A820`)
gradient wave sweeping across its fill every **5s** (~1.6s sweep, then idle). Because a CSS
`cursor` image is a frozen raster (CSS/SVG animation inside the data-URI does **not**
run), this is driven by a small **inline IIFE in `layout.html`** (after the starfield
script) that rebuilds the arrow's SVG data-URI frame-by-frame (`requestAnimationFrame`,
~30fps-throttled) and assigns it to `document.documentElement.style.cursor`, resetting to
`''` after each sweep so the stylesheet rule takes back over. Only the **default** state
animates — the link/button `pointer` rule wins on those elements, so the wave shows only
over non-link areas. The IIFE is gated off under `prefers-reduced-motion: reduce`, on
non-fine/hover pointers (touch), and while the tab is hidden. The brand hex `#E8A820` is
**hardcoded** in the JS-built SVG (a cursor data-URI can't read `var(--brand-color)`) —
keep it in sync with `--brand-color` if the brand color changes. Like the starfield, this
JS is **inline-only** by design; don't split it into a `.js` file.

---

## HTML / Templating Conventions

- All pages use YAML **front matter** with `layout: layout.html`
- Templating engine: **Liquid** (default for `.html` files)
- Use **semantic HTML5** — proper heading hierarchy (h1 → h2 → h3)
- All images must have descriptive `alt` text
- Use `loading="lazy"` on non-hero images
- Use `fetchpriority="high"` on hero/LCP images
- Prefer WebP or AVIF for all images

### Icon partials

The SVG glyphs live in `_includes/`: the arrows `icon-arrow-up-right.html`,
`icon-arrow-right.html`, `icon-arrow-left.html`; `icon-download.html` (the hero
"Download CV" button); the social glyphs `icon-linkedin.html` and `icon-github.html`;
and the **OUTCOMES bullet icons** (`icon-magic`, `icon-person-workspace`,
`icon-grid-3x3-gap`, `icon-cpu`, `icon-signpost-split`, `icon-lightning-charge`,
`icon-palette`, `icon-arrow-repeat`, `icon-rocket-takeoff`, `icon-box-seam`,
`icon-emoji-smile`, `icon-search`, `icon-layers`, `icon-code-slash`,
`icon-bounding-box`, `icon-graph-up-arrow` — see `.outcome-icon` in CSS Conventions).
All are Bootstrap Icons (`bi`, 16×16, `fill="currentColor"`, `1em` sized). Insert them
with `{% include "icon-arrow-up-right.html" %}` (etc.). **Never paste raw `<svg>` markup
into a page** — reuse the partial so a single edit propagates everywhere.

### Front Matter Fields

```yaml
---
title: "Page Title | Viktor Demydov"   # Used in <title> and OG tags
description: "Page description."       # Used in meta description and OG
layout: layout.html                    # Always this value
---
```

---

## Layout Template (`_includes/layout.html`)

The master layout handles:

- HTML5 document structure
- `<head>` meta tags (SEO, Open Graph, Twitter Card, viewport)
- JSON-LD structured data (schema.org `Person`)
- CSS and font preloads for performance
- Fixed site-wide nav bar (`<nav class="site-nav">`) — left side: name only ("Viktor Demydov", home link, no avatar image) plus, **on project pages only**, the green "● Open to work" `.site-nav__status` badge (no "(Remote)" suffix — that stays on the home hero); right side: icon-only links (LinkedIn, GitHub); constrained to 900px via `.site-nav__inner`
- Site-wide header (hero subtitle + "Open to work (Remote)" status badge + the animated `.skills-ticker` skills marquee + a "Download CV" button — `.hero-cv.bg-glass`, linking to `/Viktor-Demydov-CV.pdf` with the `download` attribute), rendered on every page **except project pages** — wrapped in `{% unless page.url contains "/projects/" %}` so project pages start clean under the nav (availability moves to the nav `.site-nav__status` badge instead)
- `{{ content }}` Liquid placeholder for page-specific content
- Footer ("Follow me" — LinkedIn and GitHub links styled as `.btn.bg-glass` pill buttons, each with its brand glyph before the label; the `<h3>` of buttons gets `mt-3` for the title→content gap matching the home-page sections) plus a `.colophon` credit line ("This site is designed and coded by me — view the source on GitHub", linking to the repo with the up-right arrow partial), a `.privacy` line ("This site sets no cookies of its own and uses no analytics or tracking." — scoped to the site's own code, which self-hosts fonts and ships zero trackers/cookies/storage; wording is deliberately scoped because the Cloudflare Pages edge can set strictly-necessary security cookies and offers an optional Web Analytics beacon — keep that toggle off, or revise this line, if either changes) and, at the very bottom, a `.copyright` line (`© {year} Viktor Demydov`) where the year is rendered at build time via Liquid `{{ "now" | date: "%Y" }}` so it never goes stale. `.colophon`, `.privacy`, and `.copyright` are all utility-only hooks (no dedicated CSS rule — they lean on `.small` / `.text-secondary` / `.ms-3` / `.mt-3`); the copyright text is intentionally minimal (no "all rights reserved").
- Starfield background canvas (`<canvas id="bg-canvas">`) and its IIFE script

**Do not duplicate** any of the above in individual page files — put it in the layout only.

---

## Project Page Structure

Each project page follows a consistent pattern. Pages lead with an **OUTCOMES**
bullet panel followed by an **OVERVIEW** screenshot — there is **no** `CHALLENGE`,
`PROJECT DESCRIPTION`, or `DESIGN PROCESS` section (these were removed across all
project pages; don't re-add them). The header is **clean** (title + tags +
metadata only) — the hero screenshot lives in the OVERVIEW panel, not the header.

```html
<!-- Work section -->
<section class="work">
  <div class="work-item">
    <!-- Top-left icon-only back link (see .btn-icon / .work-back in Buttons) -->
    <a href="/" class="btn btn-icon bg-glass work-back" aria-label="Back to home">
      {% include "icon-arrow-left.html" %}
    </a>
    <!-- Header: title + tags + metadata only (NO hero image) -->
    <div class="work-header">
      <h1>Title with <span style="color: var(--project-color)">accent</span></h1>
      <p class="project-tags"> … three .tag spans … </p>
      <!-- Right-aligned metadata: role, skills, period, links -->
    </div>

    <!-- OUTCOMES: lead line + claim/payoff bullet list (see .bg-glass.p-3 ul) -->
    <h2 class="section-label brand-color text-center fw-bold">OUTCOMES</h2>
    <div class="text-white bg-glass p-3 mt-6">
      <p>One-line summary.</p>
      <ul>
        <li>
          <span class="outcome-icon">{% include "icon-X.html" %}</span>
          <span class="fw-bold">Claim.</span> Short payoff.
        </li>
        <!-- … last bullet is the product/company impact (icon-graph-up-arrow) … -->
      </ul>
    </div>

    <!-- OVERVIEW: the hero screenshot, popped out via .section-wide -->
    <h2 class="section-label brand-color text-center fw-bold mt-5">OVERVIEW</h2>
    <div class="text-white bg-glass p-3 mt-6 section-wide text-center">
      <img class="img-fluid" src="/img/..." alt="..." loading="lazy">
      <p class="text-center mt-2">Caption</p>
    </div>

    <!-- Year-by-year log with glass panels and recommendation bubbles -->
  </div>
</section>
```

**OUTCOMES copy convention:** first-person, scannable **claim → short payoff**
bullets; the bold lead-in (`.fw-bold`) sits on its own line (one modular-scale
step up — see the `.bg-glass.p-3 ul`/`li` rules) and is **at most three words**
(hyphenated/slashed terms like `UI/UX` count as one word). Close the list with a
short product/company impact bullet — e.g. "Product, company impact." or "Real
product impact." (the old longer "Impact on product and company" wording was
trimmed to fit the 3-word cap).

---

## SEO & Performance Checklist

When adding or updating pages:

- [ ] Unique `<title>` tag (format: `"Page Title | Viktor Demydov"`)
- [ ] Unique `<meta name="description">` (150–160 characters)
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- [ ] Twitter Card tags
- [ ] JSON-LD Person schema (managed in `layout.html` — update if personal info changes)
- [ ] Add URL to `sitemap.xml` with `<lastmod>` and `<priority>`
- [ ] All images in WebP or AVIF format with meaningful `alt` text
- [ ] Hero image has `fetchpriority="high"`; secondary images have `loading="lazy"`

---

## Assets

### Images

- Format: **WebP or AVIF**
- Location: `img/`
- Naming: descriptive kebab-case (e.g., `photo_me.webp`, `certificate-1.webp`)
- Every `src="/img/..."` must reference a file that actually exists in `img/`.
  Broken references ship silently — verify the file is present (or produce it)
  before pointing markup at it; prefer AVIF/WebP rather than leaving a stray PNG.
- Deleted images are recoverable from git history:
  `git show <rev>^:img/<file> > img/<file>`

### Fonts

- Format: **WOFF2 only**
- Location: `fonts/`
- Naming: `FontFamily-Weight.woff2` (e.g., `DMSans-Medium.woff2`)
- Declared in `css/style.css` via `@font-face` with `font-display: swap`
- Preloaded in `_includes/layout.html` for performance

---

## CV / Résumé PDF

The downloadable résumé (`Viktor-Demydov-CV.pdf`, served at the site root and linked from
the hero) is **generated from `cv/cv.html`** — a standalone, self-contained HTML source
(inline `<style>`, on-brand dark, A4, **single page**, DM Sans referenced via relative
`../fonts/*.woff2`). It is **not** an Eleventy page: `cv/` is in `.eleventyignore`, so it is
never published as a route or added to the sitemap. It lives in a **git-tracked** folder
(unlike `docs/`, which is git-ignored) so the PDF's source is version-controlled.

### Building

```bash
npm run build:cv
```

Renders `cv/cv.html` → `Viktor-Demydov-CV.pdf` via **headless Chrome**
(`--headless=new --no-pdf-header-footer --print-to-pdf`, into a throwaway `--user-data-dir`).
No new npm/runtime dependency — it reuses the locally installed Chrome (macOS standard path).
The output is a real **selectable-text PDF** (ATS-parseable); DM Sans is subset/embedded
automatically. The `*.pdf` Eleventy passthrough then copies it into `_site/`.

### Editing rules

- Edit copy/layout in `cv/cv.html`, then **always re-run `npm run build:cv`** and **commit
  both** the source and the regenerated `Viktor-Demydov-CV.pdf` (the PDF is a committed
  artifact, since the host serves it directly).
- **Keep it one page.** The left "Experience" column is the height limiter — bumping the
  base font/spacing overflows to a 2nd page fast. Verify after each change:
  `pdfinfo Viktor-Demydov-CV.pdf` → `Pages: 1`; `pdftotext Viktor-Demydov-CV.pdf -` →
  complete, selectable text. (`pdfinfo`/`pdftotext`/`pdftoppm` come from poppler — a dev
  tool, **not** a project dependency.)
- Don't add a separate `@media print` screen variant — the file is rendered straight to PDF,
  so its on-screen styles *are* the print styles (full-bleed dark via `@page { margin: 0 }`
  + `print-color-adjust: exact`).
- **Keep the skills in sync with the hero ticker.** The CV's "Skills" section (grouped
  Design / Engineering / Strategy & Research) and the hero `.skills-ticker` list (the
  Liquid `skills` array in `layout.html`) describe the same skill set — when one changes,
  update the other (and the summary prose if it names a skill being removed).

---

## Starfield Background

An animated Canvas 2D starfield runs on every page. It is self-contained in `_includes/layout.html` — one `<canvas>` element and one inline `<script>` IIFE. No external files, no dependencies. Beyond the dots it also renders a **planet limb + atmosphere glow** at the page bottom, **drifting nebula** blobs, an occasional **meteor**, per-star **twinkle**, and depth **parallax**.

### Structure

| Part | Location | Purpose |
|---|---|---|
| `<canvas id="bg-canvas">` | First child of `<body>` in `layout.html` | Rendering surface |
| `#bg-canvas` CSS rule | `css/style.css` (after `body {}`) | `position: fixed`, full-screen, `z-index: -1`, `pointer-events: none` |
| `<script>` IIFE | Before `</body>` in `layout.html` | All starfield logic |

### Key constants (inside the IIFE)

| Constant | Value | Effect |
|---|---|---|
| `DOT_COUNT` | `300` | Number of dots |
| `INFLUENCE` | `180` | Cursor influence radius in px |
| `MAX_DISP` | `12` | Max dot displacement in px |
| `MOMENTUM_RISE` | `0.12` | How fast momentum builds on fast movement |
| `MOMENTUM_DECAY` | `0.96` | How fast momentum fades when cursor slows |
| `GLOW` | `'150,180,255'` | Shared cool RGB for atmosphere, nebula, meteor (restrained, low-alpha — keeps the monochrome feel) |
| `HORIZON` | `56` | px of planet limb visible above the page bottom |
| `ATMO` | `90` | Atmosphere rim thickness in px |
| `NEBULA_COUNT` | `3` | Number of drifting nebula blobs |
| `METEOR_MIN` / `METEOR_MAX` | `15000` / `30000` | ms between meteors (randomized in range) |
| `PARALLAX` | `0.015` | Cursor depth-parallax strength |
| `TWINKLE` | `0.35` | Star twinkle alpha depth (`0` = no twinkle) |

### How it works

- **Dot generation:** `generateDots()` places dots randomly across the full page — x within `canvas.width`, y within `document.documentElement.scrollHeight`. Each dot stores origin `(ox, oy)`, current `(x, y)`, a `depth`, a `big` flag, and twinkle phase/speed. Dots are only regenerated when the viewport **width** changes. `draw()` translates the canvas by `-scrollY` and skips dots outside the current viewport.
- **Sizes & depth:** `sizeTier()` returns `[radiusMultiplier, depth]` — `[1, 0.25]` (~60%, small/far), `[2, 0.55]` (~30%, mid), `[4, 1.0]` (~10%, big/near). Base radius `0.8 + random * 1.2` is multiplied by the tier. `big = tier[0] === 4`. Used by `generateDots()` **and** the reduced-motion fallback so they stay in sync.
- **Twinkle:** each non-`big` dot modulates its `globalAlpha` by `(1 − TWINKLE) + TWINKLE·sin(t·twSpeed + twPhase)`. The biggest/nearest dots (`d.big`) deliberately do **not** twinkle (steady alpha).
- **Parallax:** cursor displacement force is scaled by `d.depth` and dots get a small horizontal cursor-parallax offset (`pmx · PARALLAX · (depth − 0.35)`). This is **cursor**-parallax only — no scroll-parallax (avoids document-space cull popping).
- **Nebula:** `generateNebula()` creates `NEBULA_COUNT` slow-drifting viewport-fixed blobs. Each blob's soft radial gradient is baked once into an offscreen sprite via `makeBlob()`; `drawNebula()` just `drawImage`s it (no per-frame gradient allocation). Regenerated on every resize.
- **Planet limb + atmosphere:** `buildPlanet()` bakes the visible `HORIZON+ATMO` cap (cool atmosphere rim + near-black body with an upper-left terminator) into one offscreen sprite, rebuilt only when canvas **width** changes. `drawPlanet(bottomY)` blits it with its bottom edge at `bottomY`. In the animation loop it is drawn inside a `translate(0,-scrollY)` block at `pageH` so it sits at the **page bottom** (scroll down to reach it) and tracks the document end.
- **Meteor:** every `METEOR_MIN`–`METEOR_MAX` ms a single streak with a fading gradient tail crosses the upper sky (viewport space, behind the planet). The meteor gradient is the only per-frame gradient and only while a meteor is active.
- **Color:** dots are `#888888` (intentionally dark/subtle); atmosphere/nebula/meteor use the single `GLOW` RGB at low alpha (dark-mode-only site). No `matchMedia`/theme listener.
- **Animation loop:** `draw(ts)` runs via `requestAnimationFrame` with a clamped delta (`min(ts−lastTs, 60)`) so meteor speed/cadence are framerate-independent. Draw order each frame: clear → nebula → dots (twinkle + parallax) → meteor → planet. `pageH` (`document.documentElement.scrollHeight`) is refreshed every 20 frames, not every frame, to avoid a per-frame reflow while still catching lazy-image page growth.
- **Reduced motion:** `prefers-reduced-motion: reduce` skips the rAF loop entirely and draws one static frame — nebula + `DOT_COUNT` static dots + the planet (anchored to the viewport bottom, since this path never scrolls). No twinkle, no meteor.

### Modifying the starfield

- Adjust **density**: change `DOT_COUNT`
- Adjust **reach**: change `INFLUENCE`
- Adjust **strength**: change `MAX_DISP`
- Adjust **size mix / depth**: change the thresholds/return values in `sizeTier()` (`[radiusMultiplier, depth]`)
- Adjust **feel**: change `MOMENTUM_RISE` / `MOMENTUM_DECAY` (higher rise = snappier; higher decay = slower fade)
- Adjust **twinkle / parallax**: change `TWINKLE` (`0` disables) / `PARALLAX`
- Adjust **planet**: change `HORIZON` (how much limb shows) / `ATMO` (rim thickness); the `w * 0.9` in `buildPlanet()` controls limb curvature (flatter on wide screens)
- Adjust **atmosphere/nebula/meteor color**: change the single `GLOW` RGB; meteor cadence via `METEOR_MIN`/`METEOR_MAX`, count via `NEBULA_COUNT`
- After editing `buildPlanet()` / `makeBlob()` or anything gradient-related, remember those sprites are cached — they rebuild on resize (nebula: every resize; planet: width change only)
- Do **not** split the script into a separate `.js` file — inline-only is intentional

---

## Caching

The site **must not** serve stale HTML/CSS after a deploy.

- **No service worker.** A cache-first SW once shipped here and pinned returning
  visitors to old assets forever. `sw.js` is now a **self-destruct kill switch**: on
  activate it deletes all caches, calls `self.registration.unregister()`, and reloads
  open tabs. It is intentionally **not registered** anywhere — do **not** re-add a
  `navigator.serviceWorker.register('/sw.js')` script to `layout.html`. Keep `sw.js`
  served (it is in Eleventy passthrough) so old installed workers can fetch it and die.
- **CSS cache-busting.** `_data/assets.js` exports `cssVersion` from `style.css`'s
  mtime. `layout.html` references the stylesheet as `/css/style.css?v={{ assets.cssVersion }}`
  (both the `preload` and the `stylesheet` link). The token changes only when
  `style.css` actually changes — keep both references in sync and do not hardcode it.
- Source lives on GitHub; the site is served via **Cloudflare Pages**. Cloudflare Pages
  *can* set custom HTTP headers (via a `_headers` file), but the project deliberately
  relies on the query-string `?v=` token as its cache-busting mechanism rather than
  header tuning. Do not reintroduce SW caching as a substitute.

## Build Output (`_site/`)

- Generated automatically by Eleventy — **never edit files in `_site/` directly**
- Not committed to git (excluded via `.gitignore`). If it ever shows as tracked, run `git rm -r --cached _site` (do not delete the directory)
- Mirrors the source structure with processed output

---

## No Tests, No CI/CD

There is currently no test suite and no CI/CD pipeline. All builds are run locally. If adding tests or automation, prefer lightweight tooling that doesn't conflict with the single-dependency philosophy.

---

## Workflow for Changes

Non-trivial work follows this sequence — do not skip steps or reorder them:

1. **Brainstorm** — explore the idea, intent, constraints, and 2–3 solution options before any code.
2. **Plan / spec** — write the agreed design to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` (excluded from the build via `.eleventyignore`).
3. **Implementation** — build it, then verify (`npm run build`, syntax-check inline JS).
4. **Code review** — dispatch a reviewer; fix Critical/Important findings before continuing.
5. **Update `CLAUDE.md`** — record any new knowledge, constants, or conventions the change introduced.
6. **Commit** — only after the above, and only with explicit user approval (see constraint 13).

Trivial fixes (typos, single-line tweaks) may collapse steps 1–2, but review, the doc update, and the approval gate still apply.

---

## Key Constraints for AI Assistants

1. **Do not add JavaScript** unless explicitly requested. The only existing JS is the starfield IIFE in `layout.html` — do not add more without a clear reason.
2. **Do not add new CSS files.** All styles go in `css/style.css`.
3. **Do not edit `_site/`** — it is build output.
4. **Do not hardcode pixel values** in CSS; use CSS custom properties and the 8-point grid.
5. **Do not change the font stack** — DM Sans is the intentional brand font.
6. **Dark mode only** — use the `:root` theme variables; never add a light theme or `@media (prefers-color-scheme: ...)` blocks.
7. **Use WebP or AVIF** for new images.
8. **Do not hand-edit `sitemap.xml`** — it is generated from `sitemap.liquid` every build. Internal docs (`README.md`, `docs/`) are excluded via `.eleventyignore`.
9. **Keep dependencies minimal.** The project intentionally has only one dependency (`@11ty/eleventy`). Avoid adding new packages unless strictly necessary.
10. **Follow existing front matter pattern** for all new pages.
11. **Do not mention Claude** at git commit message.
12. **No service worker registration.** `sw.js` is a kill switch only — never re-add a registration script. Bust CSS cache via the `?v={{ assets.cssVersion }}` token, not a SW. See the Caching section.
13. **Never `git commit` or `git push` without explicit user approval.** Finish and verify the work, then stop and ask — committing proactively is not wanted.
14. **Follow the Workflow for Changes** (brainstorm → plan/spec → implementation → code review → update `CLAUDE.md` → commit). See the section above.
