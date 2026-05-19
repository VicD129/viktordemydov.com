# Starfield → Atmosphere & Planet upgrade

**Date:** 2026-05-19
**Status:** Approved (design), implementing

## Context

The site background is a single inline Canvas-2D IIFE in `_includes/layout.html`
(grey dots on near-black). The user wants to borrow the look of Maxime Heckel's
atmospheric-scattering article (Rayleigh/Mie sky, planet + atmosphere) **without**
adopting its WebGL/Three.js stack, to respect this project's "inline, no-deps,
Canvas-2D" constraint. Goal: more depth and a planet limb with an atmospheric
glow at the bottom of the page, while keeping the quiet monochrome feel.

## Scope (approved)

All four effects, restrained cool palette, Canvas-2D only, stays inline:

1. **Planet limb + atmosphere** — large circle anchored fixed to the viewport
   bottom; only the upper limb shows. Near-black body with an upper-left
   terminator brightening. A low-alpha cool rim glow hugging the limb
   (faux-Rayleigh) drawn as a radial-gradient rect occluded by the body.
2. **Star twinkle** — per-dot `twPhase`/`twSpeed`; modulated `globalAlpha`,
   no extra primitives.
3. **Depth parallax** — reuse the 3 size tiers as depth (far/mid/near):
   cursor-displacement force scaled by depth + a subtle mouse parallax offset.
   No scroll-parallax (avoids document-space cull popping).
4. **Nebula glow + meteors** — 3 slow-drifting viewport-fixed soft radial blobs
   (alpha ~0.04); a meteor streak every 15–30s over ~0.8s with a fading tail.

## Draw order per frame

clear → nebula → stars (twinkle+parallax) → meteor → atmosphere rim → planet body.

## Constraints / non-goals

- No new files, no npm deps, no CSS files; all changes inside the existing IIFE.
- Palette `rgba(150,180,255,a)` at very low alpha — keep monochrome feel.
- `prefers-reduced-motion`: static stars + static nebula + static planet/rim;
  no twinkle, no meteor, no rAF loop.
- `DOT_COUNT` unchanged; target 60fps.

## Verification

`npm run build` succeeds; visual check at `npm start` (user verifies locally).
Confirm: limb hugs page bottom and stays put on scroll, rim glow visible but
subtle, stars shimmer + react to cursor by depth, meteor appears occasionally,
reduced-motion shows a clean static frame.
