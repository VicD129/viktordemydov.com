# CLAUDE.md — AI Assistant Guide for viktordemydov.com

This document describes the codebase structure, development workflows, and conventions for AI assistants working on this project.

---

## Project Overview

**viktordemydov.com** is a personal portfolio static website for Viktor Demydov, a UI/UX Designer and Developer. It is built with [Eleventy (11ty)](https://www.11ty.dev/)

- **Type:** Static site generator (no backend, no database)
- **URL:** https://viktordemydov.com
- **GitHub:** https://github.com/VicD129/viktordemydov.com
- **License:** MIT

---

## Tech Stack

| Layer | Technology |
|---|---|
| Static Site Generator | Eleventy (11ty) v3.1.0 |
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
│   ├── icon-arrow-up-right.html # Shared arrow SVG partials — use via {% include %}
│   ├── icon-arrow-right.html
│   └── icon-arrow-left.html
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
│   ├── mvr.html
│   ├── myabiportal.html
│   └── tourhunter.html
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
- **Pass-through copies:** `fonts/`, `css/`, `img/`, `manifest.json`, `sw.js`, `robots.txt`, `*.png`, `*.ico`, `*.xml`
- **Watch targets:** `css/` (triggers live reload)
- **Custom filter:** `fileMtime` — returns a template's source mtime as `YYYY-MM-DD`; used by `sitemap.liquid` for `<lastmod>`
- **`.eleventyignore`:** excludes `CLAUDE.md`, `README.md`, and `docs/` from the build so internal docs are neither published nor leaked into the generated sitemap
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

2. Add a project card to `index.html` in the "Top Projects" section. Use the icon
   partials (`{% include "icon-arrow-right.html" %}`) — do not paste raw SVG.
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
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
/* ...and so on */

/* brand colors */
--brand-color: #e5c100;         /* site-wide brand yellow */

/* project accent colors */
--pegasus-color: #9b3831;       /* Clockworx accent (class: pegasus-bg) */
--abi-color: #f26d1f;
--mvr-color: #f6de41;
--tourhunter-color: #5095e8;
```

### Spacing

Use the **8-point grid system**. Spacing values must be multiples of 8px. Use CSS custom property variables (e.g., `var(--space-3)`) rather than arbitrary pixel values.

### Theming

- **Dark mode only.** The site renders a single dark palette regardless of OS preference (background `#171717`, text `#e9e9e9`). Theme values live in `:root` in `css/style.css`.
- Do **not** add `@media (prefers-color-scheme: ...)` blocks or a light theme — light mode was intentionally removed. Use the `:root` theme variables for all colors.

### Class Naming

BEM-like naming convention:

```
card               → block
card-body          → element
card-title         → element
card--featured     → modifier (when needed)
```

Utility classes follow a short-hand pattern: `mb-*` (margin-bottom), `mt-*`, `ms-*`, `p-*`.

### Frosted-glass surface (`.bg-glass`)

`.bg-glass` is the single source of truth for the frosted-glass panel surface
(semi-transparent fill + `backdrop-filter: blur()` with `-webkit-` prefix + subtle
border) layered over the starfield. There is no `.bg-dark` — it was replaced by
`.bg-glass`.

- Add `bg-glass` in markup to any block that should read as a glass panel.
- `.chat-bubble` carries **only** layout/typography. To give a chat bubble the glass
  surface, add `bg-glass` alongside it: `class="chat-bubble bg-glass"`. Do **not**
  put surface/background styles back on `.chat-bubble`.
- Keep `backdrop-filter` and `-webkit-backdrop-filter` together so Safari renders the blur.

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

The three arrow SVGs live in `_includes/`: `icon-arrow-up-right.html`,
`icon-arrow-right.html`, `icon-arrow-left.html`. Insert them with
`{% include "icon-arrow-up-right.html" %}` (etc.). **Never paste raw arrow
`<svg>` markup into a page** — reuse the partial so a single edit propagates
everywhere.

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
- Site-wide header (hero title, Ukraine support button)
- `{{ content }}` Liquid placeholder for page-specific content
- Footer (LinkedIn link, email)
- Starfield background canvas (`<canvas id="bg-canvas">`) and its IIFE script

**Do not duplicate** any of the above in individual page files — put it in the layout only.

---

## Project Page Structure

Each project page follows a consistent pattern:

```html
<!-- Work section -->
<section class="work">
  <div class="work-item">
    <!-- Header: title + metadata + hero image -->
    <div class="work-header">
      <h1>Title with <span style="color: var(--project-color)">accent</span></h1>
      <!-- Right-aligned metadata: role, skills, period, links -->
      <img src="/img/..." alt="..." fetchpriority="high">
    </div>

    <!-- Challenge section -->
    <h2 class="section-label">Challenge</h2>

    <!-- Year-by-year log with dark panels and recommendation bubbles -->
  </div>
</section>
```

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

## Starfield Background

An animated Canvas 2D starfield runs on every page. It is self-contained in `_includes/layout.html` — one `<canvas>` element and one inline `<script>` IIFE. No external files, no dependencies.

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

### How it works

- **Dot generation:** `generateDots()` places dots randomly across the full page — x within `canvas.width`, y within `document.documentElement.scrollHeight`. Each dot stores origin `(ox, oy)` and current `(x, y)` position. Dots are only regenerated when the viewport **width** changes. `draw()` translates the canvas by `-scrollY` and skips dots outside the current viewport.
- **Sizes:** each dot's base radius (`0.8 + random * 1.2`) is multiplied by `sizeMultiplier()`, which returns three tiers — `1` (~60%, small/current), `2` (~30%, 2× bigger), `4` (~10%, 4× bigger). Used in both `generateDots()` and the reduced-motion static fallback so they stay in sync.
- **Color:** dots are always `#e9e9e9` (dark-mode-only site). No `matchMedia`/theme listener.
- **Animation loop:** `draw()` runs via `requestAnimationFrame`. Each frame: clears canvas → calls `updateMomentum()` → displaces each dot radially outward from cursor (wave formula: `sin(dist * 0.05 − time)`) → lerps dot back to origin when outside influence.
- **Reduced motion:** `prefers-reduced-motion: reduce` skips the rAF loop entirely and draws `DOT_COUNT` static dots once.

### Modifying the starfield

- Adjust **density**: change `DOT_COUNT`
- Adjust **reach**: change `INFLUENCE`
- Adjust **strength**: change `MAX_DISP`
- Adjust **size mix**: change the thresholds/return values in `sizeMultiplier()`
- Adjust **feel**: change `MOMENTUM_RISE` / `MOMENTUM_DECAY` (higher rise = snappier; higher decay = slower fade)
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
- Host is GitHub Pages (no custom HTTP headers), so the query-string version is the
  cache-busting mechanism. Do not reintroduce SW caching as a substitute.

## Build Output (`_site/`)

- Generated automatically by Eleventy — **never edit files in `_site/` directly**
- Not committed to git (excluded via `.gitignore`). If it ever shows as tracked, run `git rm -r --cached _site` (do not delete the directory)
- Mirrors the source structure with processed output

---

## No Tests, No CI/CD

There is currently no test suite and no CI/CD pipeline. All builds are run locally. If adding tests or automation, prefer lightweight tooling that doesn't conflict with the single-dependency philosophy.

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
