# Starfield Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a subtle animated starfield background to all pages — ~180 random dots with a cursor-driven bow-wave distortion that makes the cursor feel like a rocket flying through space.

**Architecture:** A `<canvas id="bg-canvas">` sits fixed behind all content in `layout.html`. An inline IIFE script (also in `layout.html`) runs the Canvas 2D particle system: dot generation, mouse/velocity tracking, momentum-based radial displacement with wave ripple, and a `requestAnimationFrame` loop. CSS in `style.css` handles canvas positioning only.

**Tech Stack:** Vanilla JS (Canvas 2D API), CSS custom properties, no new dependencies.

---

## File Map

| File | Change |
|---|---|
| `_includes/layout.html` | Add `<canvas id="bg-canvas">` after `<body>`, add `<script>` IIFE before `</body>` |
| `css/style.css` | Add `#bg-canvas` positioning rule after `body {}` block |

---

### Task 1: Add canvas element and CSS positioning

**Files:**
- Modify: `_includes/layout.html` — add canvas element
- Modify: `css/style.css` — add positioning rule

- [ ] **Step 1: Add canvas element to layout.html**

In `_includes/layout.html`, add this line immediately after the `<body>` opening tag (line 80):

```html
  <body>
    <canvas id="bg-canvas" aria-hidden="true"></canvas>
```

- [ ] **Step 2: Add CSS rule to style.css**

In `css/style.css`, add this block immediately after the closing `}` of the `body {}` rule (after line 97):

```css
#bg-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
}
```

- [ ] **Step 3: Verify in browser**

Run `npm start` and open `http://localhost:8080`. Open DevTools → Elements and confirm `<canvas id="bg-canvas">` is the first child of `<body>`. Confirm it doesn't intercept any clicks. Canvas is invisible at this point — that's correct.

- [ ] **Step 4: Commit**

```bash
git add _includes/layout.html css/style.css
git commit -m "feat: add bg-canvas element and CSS positioning"
```

---

### Task 2: Add the IIFE script skeleton, dot generation, and dark mode detection

**Files:**
- Modify: `_includes/layout.html` — add script block before `</body>`

- [ ] **Step 1: Add the script block**

In `_includes/layout.html`, add the following immediately before `</body>`:

```html
    <script>
    (function () {
      var canvas = document.getElementById('bg-canvas');
      var ctx = canvas.getContext('2d');
      var DOT_COUNT = 180;
      var dots = [];
      var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      function dotColor() {
        return dark ? '#e9e9e9' : '#333333';
      }

      function randomAlpha() {
        return dark
          ? 0.12 + Math.random() * 0.16
          : 0.15 + Math.random() * 0.20;
      }

      function generateDots() {
        dots = [];
        for (var i = 0; i < DOT_COUNT; i++) {
          dots.push({
            ox: Math.random() * canvas.width,
            oy: Math.random() * canvas.height,
            x: 0,
            y: 0,
            r: 0.8 + Math.random() * 1.2,
            alpha: randomAlpha()
          });
        }
        dots.forEach(function (d) { d.x = d.ox; d.y = d.oy; });
      }

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateDots();
      }

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        dark = e.matches;
        dots.forEach(function (d) { d.alpha = randomAlpha(); });
      });

      window.addEventListener('resize', resize);
      resize();
    })();
    </script>
```

- [ ] **Step 2: Verify dots are generated**

With `npm start` running, open DevTools → Console and run:

```javascript
// Should log 180 dot objects with ox, oy, r, alpha properties
document.getElementById('bg-canvas').__dots
```

_(Note: this won't work yet since dots aren't exposed — but confirm no JS errors in the console at this point.)_

- [ ] **Step 3: Commit**

```bash
git add _includes/layout.html
git commit -m "feat: starfield dot generation and dark mode detection"
```

---

### Task 3: Add mouse tracking and momentum

**Files:**
- Modify: `_includes/layout.html` — extend script with mouse + momentum state

- [ ] **Step 1: Add mouse/velocity/momentum variables and mousemove listener**

Inside the IIFE in `layout.html`, add these variables and listener **after** the `resize()` call and **before** the closing `})();`:

```javascript
      var mouse = { x: -9999, y: -9999 };
      var prevMouse = { x: -9999, y: -9999 };
      var vx = 0;
      var vy = 0;
      var momentum = 0;
      var MOMENTUM_RISE = 0.12;
      var MOMENTUM_DECAY = 0.96;

      window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });
```

- [ ] **Step 2: Add the updateMomentum function**

Add this function inside the IIFE, before the mousemove listener:

```javascript
      function updateMomentum() {
        vx = mouse.x - prevMouse.x;
        vy = mouse.y - prevMouse.y;
        var speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > 1) {
          momentum = Math.min(1, momentum + MOMENTUM_RISE * Math.min(speed / 15, 1));
        } else {
          momentum *= MOMENTUM_DECAY;
        }
        prevMouse.x = mouse.x;
        prevMouse.y = mouse.y;
      }
```

- [ ] **Step 3: Verify in browser**

No visual change expected yet. Confirm zero console errors. Move the mouse quickly — momentum is not visible yet but state is being computed.

- [ ] **Step 4: Commit**

```bash
git add _includes/layout.html
git commit -m "feat: starfield mouse tracking and momentum state"
```

---

### Task 4: Add the animation loop with dot displacement and drawing

**Files:**
- Modify: `_includes/layout.html` — add draw loop

- [ ] **Step 1: Add the draw function and start the loop**

Add the `draw` function and the initial `requestAnimationFrame` call inside the IIFE, after `updateMomentum` and the mousemove listener:

```javascript
      var INFLUENCE = 180;
      var MAX_DISP = 12;

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateMomentum();

        var color = dotColor();
        var now = Date.now() * 0.003;

        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          var dx = d.ox - mouse.x;
          var dy = d.oy - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < INFLUENCE && dist > 0 && momentum > 0.01) {
            var falloff = (1 - dist / INFLUENCE);
            falloff = falloff * falloff;
            var wave = Math.sin(dist * 0.05 - now) * 0.4 + 0.6;
            var force = falloff * momentum * MAX_DISP * wave;
            var nx = dx / dist;
            var ny = dy / dist;
            d.x += (d.ox + nx * force - d.x) * 0.14;
            d.y += (d.oy + ny * force - d.y) * 0.14;
          } else {
            d.x += (d.ox - d.x) * 0.08;
            d.y += (d.oy - d.y) * 0.08;
          }

          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = d.alpha;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
      }

      draw();
```

- [ ] **Step 2: Verify the effect in browser**

Open `http://localhost:8080`. You should see:
- Faint dots scattered across the background
- Moving the mouse quickly causes nearby dots to push away from the cursor with a wave ripple
- Slowing or stopping the mouse lets dots drift back to their original positions
- The effect works on all pages (navigate to a project page to confirm)

- [ ] **Step 3: Check dark mode**

Toggle your OS dark mode. Dots should switch from dark gray to light gray without a page reload.

- [ ] **Step 4: Commit**

```bash
git add _includes/layout.html
git commit -m "feat: starfield animation loop with bow-wave cursor effect"
```

---

### Task 5: Add reduced-motion fallback

**Files:**
- Modify: `_includes/layout.html` — guard the IIFE with a reduced-motion check

- [ ] **Step 1: Wrap the animated path in a reduced-motion guard**

The IIFE currently ends with (from Task 2):
```javascript
      window.addEventListener('resize', resize);
      resize();
    })();
```
And `draw();` was appended just before `})();` in Task 4.

Make three edits:
1. Delete the two lines `window.addEventListener('resize', resize);` and `resize();` that appear before the Task 3 additions.
2. Delete the `draw();` line that appears just before `})();`.
3. Add the following block at the very bottom, just before `})();`:

```javascript
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var darkStatic = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var staticColor = darkStatic ? '#e9e9e9' : '#333333';
        for (var s = 0; s < DOT_COUNT; s++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            0.8 + Math.random() * 1.2,
            0, Math.PI * 2
          );
          ctx.fillStyle = staticColor;
          ctx.globalAlpha = darkStatic ? 0.12 + Math.random() * 0.16 : 0.15 + Math.random() * 0.20;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else {
        window.addEventListener('resize', resize);
        resize();
        draw();
      }
```

- [ ] **Step 2: Verify reduced motion**

In DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload. Dots should appear statically with no animation loop running. Confirm in DevTools Performance that no `requestAnimationFrame` is firing.

- [ ] **Step 3: Commit**

```bash
git add _includes/layout.html
git commit -m "feat: static starfield fallback for prefers-reduced-motion"
```

---

### Task 6: Final browser verification

- [ ] **Step 1: Light mode — homepage**

Open `http://localhost:8080` in light mode. Confirm:
- Dots are barely visible dark gray on the light background
- Moving the mouse briskly creates a clear but subtle bow-wave distortion
- Dots return to rest when mouse stops
- No content is obscured

- [ ] **Step 2: Dark mode — homepage**

Toggle OS to dark mode. Confirm:
- Dots switch to muted light gray on the dark `#171717` background
- Cursor effect works identically

- [ ] **Step 3: Project pages**

Navigate to `/projects/clockworx-comeback/`. Confirm the starfield appears behind the project page content with no z-index conflicts.

- [ ] **Step 4: Mobile / touch**

On a mobile device or DevTools touch emulation: confirm dots render statically (no mouse = no animation, or minimal idle state) and no JS errors.

- [ ] **Step 5: Performance check**

DevTools → Performance → Record 3 seconds of mouse movement. Confirm the frame rate stays at 60fps. If it drops significantly, reduce `DOT_COUNT` to 120.
