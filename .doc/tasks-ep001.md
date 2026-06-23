# Tasks — EP-001: Manifest and Extension Shell

---

```
Task ID: TSK-001
Epic: EP-001 — Manifest and Extension Shell
Title: Create manifest.json, popup.html skeleton, and service-worker.js stub
Size: S
Priority: Critical

Context & Background:
MV3 requires a manifest.json declaring the extension's identity, permissions, popup action, icons,
and service worker. Without a valid manifest Chrome will refuse to load the extension.
The popup.html is the host document for all UI. The service-worker.js is required by MV3 even
if it performs no background tasks. See PRD FR-1, NFR-5, NFR-7.

Goal:
Produce a complete, valid manifest.json, a minimal popup.html that references popup.css and popup.js,
and an empty service-worker.js — such that the extension loads in chrome://extensions with zero
warnings and clicking the icon opens a blank popup window.

Scenarios:
- Scenario 1 — Happy Path: Developer loads the folder as an unpacked extension. Chrome shows the
  TechSpeak entry with correct name, description, and icon. Clicking the icon opens a white popup
  at approximately 384×496px.
- Scenario 2 — Edge Case (missing field): If manifest is missing "manifest_version" or "action",
  Chrome shows a parse error. Validate that all required fields are present before marking done.
- Scenario 3 — Error/Failure State: If popup.html references a JS or CSS file that doesn't exist,
  Chrome console shows a net::ERR_FILE_NOT_FOUND. The HTML must only reference files that exist
  (even if those files are empty stubs).

Acceptance Criteria:
- [ ] AC1: manifest.json declares manifest_version 3, name "TechSpeak", version "1.0.0",
      description (≤132 chars), action.default_popup "popup.html", action.default_title "TechSpeak",
      background.service_worker "service-worker.js", permissions ["storage"], and icons referencing
      all four PNG sizes (16, 32, 48, 128).
- [ ] AC2: popup.html is a valid HTML5 document with <meta charset="UTF-8">, a <link> to popup.css,
      and a <script src="popup.js" defer></script> — no inline scripts, no inline event handlers.
      The <head> also includes the Google Fonts <link> tags for Hanken Grotesk, Newsreader, and
      JetBrains Mono (or a comment placeholder if self-hosting is chosen).
- [ ] AC3: service-worker.js exists and contains at minimum a comment
      (e.g., `// TechSpeak service worker — no background tasks in v1`). It must not import
      any remote scripts.
- [ ] AC4: Loading the extension in chrome://extensions produces zero errors and zero warnings
      in the extension card and in the service worker status line.
- [ ] AC5: The extension icon appears in the Chrome toolbar. Clicking it opens a popup — even
      if the popup body is blank at this stage.

Technical Notes:
- MV3 CSP for popup pages defaults to "script-src 'self'; object-src 'self'". Do not add
  unsafe-inline or unsafe-eval.
- Google Fonts loaded via <link rel="stylesheet"> in HTML is permitted under default MV3 CSP
  because it is a stylesheet fetch, not a script fetch. No additional CSP declaration is needed
  for this use case.
- If self-hosting fonts, place .woff2 files in /fonts/ and load via @font-face in popup.css —
  no CSP changes needed.
- Icon PNGs can be 1×1 transparent placeholder PNGs at this stage; real icons are produced in TSK-012.
- Do not use "browser_action" (MV2 key) — use "action" (MV3 key).

Dependencies:
- None. This is the root task.

Definition of Done:
- manifest.json, popup.html, popup.css (empty), popup.js (empty), service-worker.js created
- Extension loads in Chrome stable via Load Unpacked with zero errors/warnings
- Clicking toolbar icon opens popup
- Files peer-reviewed
- No automated tests needed (manual verification)
```
