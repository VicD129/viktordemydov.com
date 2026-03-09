# CLAUDE.md — AI Assistant Guide for viktordemydov.com

This document describes the codebase structure, development workflows, and conventions for AI assistants working on this project.

---

## Project Overview

**viktordemydov.com** is a personal portfolio static website for Viktor Demydov, a UI/UX Designer and Developer. It is built with [Eleventy (11ty)](https://www.11ty.dev/) v3.1.0.

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
| Images | WebP format |
| PWA | Web App Manifest + Service Worker (`sw.js`) |
| SEO | JSON-LD structured data, Open Graph, Twitter Card |
| JavaScript | None (pure static HTML) |

---

## Repository Structure

```
viktordemydov.com/
├── index.html                  # Home page (front matter + content)
├── 404.html                    # Custom error page
├── eleventy.config.mjs         # Eleventy build configuration
├── package.json                # npm scripts and single dependency
├── manifest.json               # PWA manifest
├── robots.txt                  # SEO directives
├── sitemap.xml                 # XML sitemap (update manually when adding pages)
│
├── _includes/
│   └── layout.html             # Master layout — all pages inherit this
│
├── css/
│   └── style.css               # All styles (744 lines, single file, no preprocessor)
│
├── fonts/                      # Self-hosted DM Sans WOFF2 files
│   ├── DMSans-ExtraLight.woff2 # weight 200
│   ├── DMSans-Regular.woff2    # weight 400
│   ├── DMSans-Medium.woff2     # weight 500
│   └── DMSans-SemiBold.woff2   # weight 600
│
├── img/                        # All images in WebP format
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
- **Pass-through copies:** `fonts/`, `css/`, `img/`, `manifest.json`, `robots.txt`, `*.png`, `*.ico`, `*.xml`
- **Watch targets:** `css/` (triggers live reload)

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

2. Add a project card to `index.html` in the "Top Projects" section.
3. Add a `<url>` entry to `sitemap.xml`.
4. Add a brand color variable to `css/style.css` if needed (see Color Conventions below).

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
--clockworx-color: #9b3831;
--abi-color: #f26d1f;
--mvr-color: #f6de41;
--tourhunter-color: #5095e8;
```

### Spacing

Use the **8-point grid system**. Spacing values must be multiples of 8px. Use CSS custom property variables (e.g., `var(--space-3)`) rather than arbitrary pixel values.

### Theming

- **Light mode:** default (background `#f5f5f7`)
- **Dark mode:** `@media (prefers-color-scheme: dark)` — all components must have dark mode styles

### Class Naming

BEM-like naming convention:

```
card               → block
card-body          → element
card-title         → element
card--featured     → modifier (when needed)
```

Utility classes follow a short-hand pattern: `mb-*` (margin-bottom), `mt-*`, `ms-*`, `p-*`.

---

## HTML / Templating Conventions

- All pages use YAML **front matter** with `layout: layout.html`
- Templating engine: **Liquid** (default for `.html` files)
- Use **semantic HTML5** — proper heading hierarchy (h1 → h2 → h3)
- All images must have descriptive `alt` text
- Use `loading="lazy"` on non-hero images
- Use `fetchpriority="high"` on hero/LCP images
- Prefer WebP format for all images

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
- [ ] All images in WebP format with meaningful `alt` text
- [ ] Hero image has `fetchpriority="high"`; secondary images have `loading="lazy"`

---

## Assets

### Images

- Format: **WebP only**
- Location: `img/`
- Naming: descriptive kebab-case (e.g., `photo_me.webp`, `certificate-1.webp`)

### Fonts

- Format: **WOFF2 only**
- Location: `fonts/`
- Naming: `FontFamily-Weight.woff2` (e.g., `DMSans-Medium.woff2`)
- Declared in `css/style.css` via `@font-face` with `font-display: swap`
- Preloaded in `_includes/layout.html` for performance

---

## Build Output (`_site/`)

- Generated automatically by Eleventy — **never edit files in `_site/` directly**
- Not committed to git (excluded via `.gitignore`)
- Mirrors the source structure with processed output

---

## No Tests, No CI/CD

There is currently no test suite and no CI/CD pipeline. All builds are run locally. If adding tests or automation, prefer lightweight tooling that doesn't conflict with the single-dependency philosophy.

---

## Key Constraints for AI Assistants

1. **Do not add JavaScript** unless explicitly requested. The site intentionally has no client-side JS.
2. **Do not add new CSS files.** All styles go in `css/style.css`.
3. **Do not edit `_site/`** — it is build output.
4. **Do not hardcode pixel values** in CSS; use CSS custom properties and the 8-point grid.
5. **Do not change the font stack** — DM Sans is the intentional brand font.
6. **Always include dark mode styles** for any new CSS components.
7. **Always use WebP** for new images.
8. **Update `sitemap.xml`** when adding new pages.
9. **Keep dependencies minimal.** The project intentionally has only one dependency (`@11ty/eleventy`). Avoid adding new packages unless strictly necessary.
10. **Follow existing front matter pattern** for all new pages.
