# PRD: TechSpeak Chrome Extension

**Owner:** TBD
**Status:** Approved
**Last updated:** 2026-06-22

---

## Problem Statement

Non-technical stakeholders — product managers, designers, marketers, executive assistants — regularly encounter engineering jargon in meetings, Slack DMs, and daily standups. Terms like "idempotent," "blast radius," or "yak shaving" are used with assumed shared understanding, but non-engineers are left guessing at meaning and reluctant to ask for fear of appearing uninformed. There is no lightweight, always-accessible reference tailored to this workplace context — existing developer glossaries are written by and for engineers, not the people who need translation.

TechSpeak solves this by living inside the browser as a Chrome extension popup: a single click surfaces a curated, human-friendly glossary accessible without leaving the current page or context.

**Who is affected:** Non-technical employees at software companies — PMs, designers, ops, founders, recruiters, execs — who participate in engineering conversations.

**Why now:** The proliferation of cross-functional collaboration (Notion, Slack, Jira, GitHub) means non-engineers are increasingly embedded in engineering workflows and exposed to jargon daily.

---

## Goals and Success Metrics

- **G1:** User can find a definition for any of the 16 glossary terms in under 5 seconds from extension open.
- **G2:** User can bookmark terms they want to revisit — bookmarks persist across browser sessions.
- **G3:** Browsing history (recently viewed) is tracked automatically and visible in the Saved tab.
- **G4:** A "term of the day" surfaces daily discovery of terms the user hasn't explicitly searched.
- **G5:** Extension loads and renders without a network request — all data is local.

Success metrics (to validate post-launch):
- Time-to-definition < 5s for a known term (measured via usability test)
- Zero runtime errors on initial load in Chrome stable
- Extension passes Chrome Web Store review criteria (MV3 compliant, no remote code execution)

---

## Non-Goals

- **No server-side component.** No API calls to any backend. All data is embedded in the extension.
- **No content script injection.** The extension does not interact with or modify any webpage content.
- **No context menu or text-selection trigger.** User must click the extension icon to open the popup.
- **No user-submitted terms or editing.** The glossary is read-only; users cannot add, edit, or delete terms.
- **No sync across devices.** `chrome.storage.local` only — not `chrome.storage.sync`.
- **No dark mode.** Single light theme only in this version.
- **No i18n / localization.** English only.
- **No analytics or telemetry.** No external data collection of any kind.
- **No automated test suite.** Verification is manual (load unpacked extension).

---

## User Personas and Scenarios

**Persona 1 — Maya, Product Manager**
In a sprint planning meeting, the engineering lead mentions "blast radius" and "feature flags" when discussing a deploy. Maya opens TechSpeak, searches "blast radius," reads the definition and the "in the wild" example, then navigates to the related "feature flag" chip — all without leaving the meeting tab.

**Persona 2 — James, UX Designer**
James bookmarks "idempotent" and "race condition" because they come up repeatedly in code reviews he participates in. On Monday morning he checks the Today tab to see the term of the day before his standup.

**Persona 3 — Sara, Founder**
Sara encounters "LGTM" in a GitHub PR comment. She opens TechSpeak and searches "LGTM." The [dm] tag tells her it's "seen in DMs" — she now understands the context, not just the meaning.

---

## Functional Requirements

- **FR-1:** The extension popup opens when the user clicks the extension icon in Chrome toolbar.
- **FR-2:** The Search tab displays a live-filtered list of terms as the user types, matching on term name.
- **FR-3:** The Glossary tab displays all 16 terms in alphabetical order with term name, tag badge, and truncated definition.
- **FR-4:** Tapping any term in Search or Glossary navigates to the Definition view for that term.
- **FR-5:** The Definition view displays: term name, tag badge + tag phrase, full definition, "In the wild" example quote (with term highlighted), and related term chips.
- **FR-6:** Clicking a related term chip navigates to that term's Definition view.
- **FR-7:** A bookmark icon in the Definition view header toggles the saved state for the current term; toggling persists immediately to `chrome.storage.local`.
- **FR-8:** The Saved tab shows all bookmarked terms and a "recently looked up" history section (max 8 terms, newest first).
- **FR-9:** The Saved tab shows an empty state when no terms are bookmarked and no history exists.
- **FR-10:** The Today tab shows a "term of the day" card (yak shaving is the seeded default) and 3 additional terms to explore.
- **FR-11:** Viewing a term's Definition view automatically appends that term ID to the browsing history (max 8, deduped, newest first).
- **FR-12:** A back arrow in the Definition view header returns the user to the tab they navigated from.
- **FR-13:** A close icon in all views closes the popup.
- **FR-14:** The bottom tab bar allows switching between Search, Glossary, Saved, and Today tabs at any time.
- **FR-15:** The active tab is visually highlighted in teal; inactive tabs are muted gray.

---

## Non-Functional Requirements

- **NFR-1 — Performance:** Popup must render fully within 300ms of click (all assets local, no network).
- **NFR-2 — Storage:** Total extension package size under 500KB (icons + code + fonts if self-hosted; fonts can be loaded from Google Fonts only if CSP allows it — see CSP section).
- **NFR-3 — Compatibility:** Must function in Chrome stable (current release). No other browsers required.
- **NFR-4 — Accessibility:** Interactive elements must be reachable by keyboard. Focus must be set to the search input when Search tab opens.
- **NFR-5 — MV3 compliance:** No inline event handlers (onclick=""), no eval(), no remote script loading. All JS in separate .js files.
- **NFR-6 — CSP:** Manifest must declare a `content_security_policy` for the popup that allows Google Fonts stylesheet if fonts are loaded that way, but no `unsafe-inline` for scripts.
- **NFR-7 — No permissions beyond storage:** `permissions` array in manifest must only include `"storage"`.

---

## Assumptions and Dependencies

- **A1:** Google Fonts (Hanken Grotesk, Newsreader, JetBrains Mono) will be loaded via `<link>` in `popup.html`. MV3 CSP permits external stylesheet fetches from `https://fonts.googleapis.com` as long as no remote scripts are loaded.
- **A2:** Icons will be generated as PNGs (16, 32, 48, 128px) from an SVG source. If no image generation tool is available, inline data URIs or a simple programmatic canvas-drawn icon is acceptable.
- **A3:** The service worker (`service-worker.js`) is required by MV3 but may be empty or contain only a comment — no background tasks are needed for this extension.
- **A4:** The Today tab's "term of the day" is static (yak shaving) for v1. Dynamic day-based rotation is out of scope.
- **A5:** All 16 term definitions, "in the wild" quotes, and related-term relationships are authored inline in `popup.js` as a JS object/array — no external JSON fetch.

---

## Open Questions

1. **Font loading strategy:** Should fonts be self-hosted (bundled in `/fonts/`) to guarantee offline functionality and avoid CSP complexity, or loaded from Google Fonts? Self-hosting is safer but increases package size.
2. **Term of the day rotation:** Is v1 acceptable with a hardcoded "yak shaving" as the daily term, or does the stakeholder want day-of-year-based rotation from the 16 terms?
3. **Icon art direction:** Is a programmatic/geometric icon acceptable (teal square + "TS" letterform), or is custom illustration required?

---

## Acceptance Criteria

- [ ] Extension installs and opens without errors in Chrome stable via "Load unpacked."
- [ ] All 16 terms appear in the Glossary tab in alphabetical order.
- [ ] Search filters the list in real time with no perceptible lag.
- [ ] Definition view shows all required fields: name, tag, tag phrase, full definition, "in the wild" quote with highlighted term, related chips.
- [ ] Bookmarking a term persists after the popup is closed and reopened.
- [ ] History (recently viewed) updates on each term view and shows in the Saved tab.
- [ ] Back arrow returns to the correct origin tab.
- [ ] No `manifest.json` warnings in chrome://extensions.
- [ ] No console errors on initial popup open.
- [ ] Tab bar correctly highlights active tab in teal.
