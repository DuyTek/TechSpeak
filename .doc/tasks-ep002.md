# Tasks — EP-002: Visual Shell and Layout

---

```
Task ID: TSK-002
Epic: EP-002 — Visual Shell and Layout
Title: Implement popup card, typography system, and color palette in popup.css
Size: S
Priority: Critical

Context & Background:
The popup must render as a white card (384px × 496px, border-radius 16px, box-shadow) over a
transparent Chrome popup background. Typography uses three Google Fonts families with distinct
roles. All color values must match the design palette exactly. See PRD NFR-1, NFR-2.

Goal:
popup.css defines all CSS custom properties (design tokens), base resets, the popup card container,
and font-face assignments — such that opening the popup shows a correctly sized, correctly styled
card with the right background color and no layout shift.

Scenarios:
- Scenario 1 — Happy Path: Popup opens; the card is 384×496px, white (#FCFBF9 or white fill),
  rounded corners visible, subtle drop shadow present, fonts load and render with correct families.
- Scenario 2 — Edge Case (fonts not loaded): If Google Fonts is unreachable (offline), the popup
  must still render legibly with system fallback fonts — it should not break layout.
- Scenario 3 — Error/Failure State: If the popup body overflows 496px (too much content), the
  card should not expand the Chrome popup window unexpectedly. Content areas must use overflow:
  hidden or scroll as appropriate.

Acceptance Criteria:
- [ ] AC1: CSS custom properties defined at :root for all design tokens:
      --color-bg (#E6E3DC), --color-surface (#FCFBF9), --color-accent (teal, oklch(0.58 0.074 200)
      or equivalent hex ~#3D8C8C), --color-text-primary (#1a1a1a or nearest), --color-text-muted
      (#5C574F), --color-text-subtle (#9A968D), --color-tag (#A39E94), --font-ui ('Hanken Grotesk'),
      --font-serif ('Newsreader'), --font-mono ('JetBrains Mono').
- [ ] AC2: The popup root element (body or #app wrapper) is exactly 384px wide × 496px tall,
      no scrollbar on the outer card, background color --color-bg.
- [ ] AC3: The inner card surface (#FCFBF9 / --color-surface) has border-radius: 16px and a
      box-shadow matching the design (e.g., 0 8px 32px rgba(0,0,0,0.12)).
- [ ] AC4: A CSS caret/arrow pointing upward is present at the top-center of the card, pointing
      toward the toolbar, implemented as a CSS ::before or ::after pseudo-element (not an image).
- [ ] AC5: Font families assigned: headings/UI elements use --font-ui, definition body text uses
      --font-serif, tag labels and meta text use --font-mono.

Technical Notes:
- Chrome popup windows size to their content. Set body { width: 384px; height: 496px; margin: 0; }
  and overflow: hidden to lock dimensions.
- oklch() color function is supported in Chrome 111+. Use it directly or provide a hex fallback
  comment for reference.
- Avoid box-sizing gotchas: use box-sizing: border-box globally.
- The caret is decorative; it may be omitted if it causes dimension issues with the Chrome popup
  chrome, but it should be attempted.

Dependencies:
- TSK-001 (popup.css file must exist)

Definition of Done:
- popup.css has all tokens, card styles, and font assignments
- Popup card renders at correct dimensions with correct fonts and colors
- No console errors related to CSS
- Peer-reviewed
```

---

```
Task ID: TSK-003
Epic: EP-002 — Visual Shell and Layout
Title: Implement tab bar and header components in CSS and HTML structure
Size: S
Priority: Critical

Context & Background:
The four-tab bottom bar (Search, Glossary, Saved, Today) and two header variants (brand header,
definition header) are the primary navigation chrome. They appear on every screen. The tab bar
must support an active/inactive visual state and be keyboard accessible. See PRD FR-14, FR-15,
NFR-4.

Goal:
popup.html contains the complete structural skeleton for the tab bar and both header variants.
popup.css styles them. popup.js (stub) can swap active state classes. No view content is rendered
yet — only the shell.

Scenarios:
- Scenario 1 — Happy Path: User opens popup, sees the brand header (teal square + "TechSpeak" +
  close icon) and the four-tab bottom bar with Search tab highlighted in teal.
- Scenario 2 — Edge Case (definition view): When the definition view is active, the brand header
  is replaced by the definition header (back arrow + definition title + bookmark icon + close icon).
  The tab bar remains visible but no tab is highlighted (or the originating tab stays highlighted —
  per design, tab bar is still present).
- Scenario 3 — Error/Failure State: Tab bar icons/labels must not overflow or wrap at 384px width.
  Test with the longest label ("Glossary") to confirm it fits.

Acceptance Criteria:
- [ ] AC1: HTML skeleton contains a #header element with two child variants: .header-brand (visible
      by default) containing a .brand-logo (teal 28×28px square with "TS" or similar) + span
      "TechSpeak" + a close button; and .header-definition (hidden by default) containing a back
      button, a .header-title span, a bookmark button, and a close button.
- [ ] AC2: HTML skeleton contains a #tab-bar element with four <button> elements: data-tab="search",
      data-tab="browse", data-tab="saved", data-tab="today", each with an SVG icon and a text label.
- [ ] AC3: The active tab button (default: data-tab="search") has class .tab--active, which applies
      teal color to both icon and label. Inactive tabs render in --color-text-subtle.
- [ ] AC4: All four tab buttons and both header buttons (back, bookmark, close) are natively focusable
      elements (<button>) with visible :focus-visible outlines.
- [ ] AC5: The tab bar is pinned to the bottom of the popup (position: absolute bottom: 0 or
      flexbox column layout) and the content area between header and tab bar is the scrollable
      viewport for view content.
- [ ] AC6: Switching tabs via JavaScript (adding/removing .tab--active class) correctly moves the
      teal highlight to the newly active tab. This can be demonstrated by manually calling the
      tab-switch function in the console.

Technical Notes:
- Use <button type="button"> for all interactive controls — not <div> or <a>.
- SVG icons for tabs can be inline SVG in the HTML or background-image data URIs in CSS.
  Inline SVG in HTML is preferred for easier color inheritance via currentColor.
- The close button should call window.close() — this closes the popup. No other action needed.
- The back button behavior is wired in TSK-008; at this stage, it can be a no-op.

Dependencies:
- TSK-002 (CSS tokens must be in place)
- TSK-001 (popup.html must exist)

Definition of Done:
- Tab bar and both header variants present in HTML and styled correctly in CSS
- Active tab state toggling works via JS class manipulation
- Keyboard navigation reaches all tab/header buttons
- No layout overflow at 384px
- Peer-reviewed
```
