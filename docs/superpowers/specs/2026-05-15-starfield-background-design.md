# Starfield Background — Design Spec

**Date:** 2026-05-15  
**Status:** Approved

---

## Overview

Add a subtle animated starfield background to all pages of viktordemydov.com. The effect renders ~180 randomly placed dots (stars) on a full-screen fixed canvas behind all content. The cursor disturbs nearby dots as if it were a rocket flying through space — dots part in a bow wave perpendicular to the cursor's direction of travel, then drift back to rest when the cursor slows or stops.

---

## Scope

- All pages: homepage and all project pages (effect lives in `_includes/layout.html`)
- No new dependencies
- No new CSS files (additions go in `css/style.css`)

---

## Architecture

### Canvas element

A `<canvas id="bg-canvas">` is injected immediately after `<body>` opens in `_includes/layout.html`. It is:
- `position: fixed`
- `top: 0; left: 0; width: 100%; height: 100%`
- `z-index: -1`
- `pointer-events: none` (never intercepts clicks)

Mouse tracking is done on `window`, not on the canvas.

### Script

A single inline `<script>` block at the bottom of `<body>` in `layout.html` handles:
1. Canvas setup and context acquisition
2. Dot generation
3. Mouse/velocity tracking
4. The `requestAnimationFrame` animation loop

No new files. No new dependencies.

---

## Dot System

- **Count:** ~180 dots, randomly placed across the full viewport at load
- **Radius:** 1–2px per dot (random per dot)
- **Base opacity:** 0.15–0.35 in light mode; 0.12–0.28 in dark mode
- **Colors (muted, matching site palette):**
  - Light mode: `#333333` (matches `--text-color`)
  - Dark mode: `#e9e9e9` (matches dark `--text-color`)
- **Dark mode detection:** `window.matchMedia('(prefers-color-scheme: dark)')`, re-checked on `change` event — no page reload needed
- **Resize:** dots are regenerated on `window resize` to fill the new dimensions

---

## Cursor Interaction — Rocket Wake Effect

### Velocity tracking

Each frame, cursor velocity (`dx`, `dy`) is computed from the difference between the current and previous mouse positions.

### Momentum

A `momentum` scalar (0.0–1.0) rises toward 1.0 while the cursor is moving fast, and decays toward 0.0 over ~1 second when the cursor slows or stops. This drives both displacement strength and the return animation.

### Displacement

For each dot within the influence radius (~180px):

1. Compute the vector from dot to cursor
2. Project the velocity direction to find the **perpendicular axis** (the bow-wave axis)
3. Displace the dot along that perpendicular, scaled by:
   - Dot's distance from cursor (closer = stronger, using `smoothstep(180, 0, distance)`)
   - Current `momentum` value
   - Max displacement amplitude: ~12px
4. As `momentum` decays, the dot's displaced position lerps back to its original position

### Result

- Dots **part in front** of the cursor like it's cutting through space
- A **settling trail** is visible behind as dots drift back
- Cursor at rest: zero effect, all dots in original positions
- Fast cursor: strong, wide bow wave

---

## Accessibility

- `prefers-reduced-motion: reduce`: animation loop is skipped entirely; dots are drawn once, static, no cursor interaction

---

## Files Changed

| File | Change |
|---|---|
| `_includes/layout.html` | Add `<canvas id="bg-canvas">` after `<body>`, add `<script>` before `</body>` |
| `css/style.css` | Add `#bg-canvas` positioning rules |

---

## Out of Scope

- WebGL / GLSL shaders
- Three.js or any library
- Dot click interaction
- Touch/mobile cursor tracking (canvas is static on touch devices, dots render at rest)
