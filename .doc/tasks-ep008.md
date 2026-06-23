# Tasks — EP-008: Icons

---

```
Task ID: TSK-012
Epic: EP-008 — Icons
Title: Generate extension icons at 16, 32, 48, and 128px
Size: S
Priority: High

Context & Background:
MV3 requires PNG icons at four sizes referenced in manifest.json. Without them, the extension
shows a broken image in the Chrome toolbar, the Extensions management page, and the Chrome Web
Store listing. The art direction is a teal square with "TS" letterform in white, matching the
--color-accent teal (~oklch(0.58 0.074 200), approximately #3D8C8C or #468B8B). See PRD Assumption A2.

Goal:
Produce four PNG files in /icons/: icon16.png, icon32.png, icon48.png, icon128.png. Each is a
solid teal square with rounded corners (border-radius ≈ 20% of size) with "TS" in white centered.
At 16px, the "TS" text may be omitted (too small to be legible) in favor of a solid teal square.

Scenarios:
- Scenario 1 — Happy Path: Extension loads in chrome://extensions. The toolbar icon, the Extensions
  page icon, and the popup badge all show a clean teal square with "TS." No broken-image placeholder.
- Scenario 2 — Edge Case (16px): At 16×16px, the "TS" letterform may not be legible. A plain teal
  square or a minimal "T" initial is acceptable. The icon must still be a valid PNG at exactly 16×16px.
- Scenario 3 — Error/Failure State: If programmatic generation fails, a 1×1 placeholder PNG of the
  correct color is acceptable as a temporary stand-in, but manifest.json must still reference valid
  files at all four sizes.

Acceptance Criteria:
- [ ] AC1: Four files exist at /icons/icon16.png, /icons/icon32.png, /icons/icon48.png,
      /icons/icon128.png. Each file is a valid PNG (not a renamed text file).
- [ ] AC2: Each icon's dominant color is teal (approximately #3D8C8C to #4A9999 range). The icon
      is visually recognizable as the TechSpeak brand mark at its target size.
- [ ] AC3: manifest.json references all four icon sizes in the "icons" field:
      { "16": "icons/icon16.png", "32": "icons/icon32.png", "48": "icons/icon48.png",
        "128": "icons/icon128.png" }.
- [ ] AC4: The manifest "action" field also includes "default_icon" with the same four size paths
      (this controls the toolbar icon specifically, separate from the "icons" field which controls
      the management page).
- [ ] AC5: After loading the extension, no broken-image icon appears in the Chrome toolbar, the
      chrome://extensions page, or the Extensions panel sidebar.

Technical Notes:
GENERATION APPROACH — choose one:

Option A (Preferred if Canvas API is available in a local Node.js or browser script):
  Create a script (not bundled into the extension) that uses an HTML canvas or node-canvas to draw:
  - Filled rounded-rect in teal (#3D8C8C or oklch equivalent)
  - White "TS" text centered at an appropriate font size per canvas size
  - Export as PNG via canvas.toDataURL() or node-canvas's createPNGStream()

Option B (SVG → PNG via Inkscape, ImageMagick, or similar CLI):
  Author a single icons/source.svg (viewBox="0 0 128 128") with:
  - <rect width="128" height="128" rx="25" ry="25" fill="#3D8C8C"/>
  - <text x="64" y="64" text-anchor="middle" dominant-baseline="central"
         font-family="sans-serif" font-weight="700" font-size="56" fill="white">TS</text>
  Then rasterize: `convert -size 16x16 icon.svg icon16.png` etc. (ImageMagick)
  or: `inkscape icon.svg -w 16 -h 16 -o icon16.png` etc.

Option C (Inline data-URI fallback — zero external tools):
  If no rasterization tool is available, generate the PNG bytes programmatically in a one-time
  helper script using pure Node.js Buffer manipulation to write a minimal valid PNG header
  and IDAT chunk for a solid-color image. This produces a valid colored square without "TS" text,
  which is acceptable for all four sizes at this constraint.

- The generation script is a one-time utility — it does NOT ship in the extension.
- Only the four output PNGs go in /icons/ in the extension directory.
- After icon generation, verify in chrome://extensions that the icon renders without a broken
  image placeholder.

Dependencies:
- TSK-001 (manifest.json must have the icons fields ready to reference these paths)

Definition of Done:
- Four PNG files present at correct paths
- manifest.json icons and action.default_icon both reference all four sizes
- No broken icon in Chrome toolbar or extensions page after loading unpacked
- Peer-reviewed (visual spot-check at each size)
```
