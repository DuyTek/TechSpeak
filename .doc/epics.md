# TechSpeak — Epics

---

## EP-001 — Manifest and Extension Shell

**Business Value:** Establishes the Chrome extension as a valid, installable MV3 package. Nothing else can be built or tested without this foundation.
**Scope Summary:** `manifest.json`, `popup.html` skeleton, `service-worker.js` stub, folder structure.
**Success Criteria:** Extension loads in chrome://extensions without errors or warnings; clicking the icon opens an empty popup.
**Estimated Size:** S
**Priority:** Critical
**Dependencies:** None
**Child Task IDs:** TSK-001

---

## EP-002 — Visual Shell and Layout

**Business Value:** Establishes the popup's visual container, typography system, color palette, and four-tab navigation chrome. All views are built on top of this shell.
**Scope Summary:** `popup.css` with global styles, popup card dimensions, tab bar component, header variants (brand header vs. definition header), font loading.
**Success Criteria:** Popup renders at 384×496px with correct fonts, teal accent, warm background, tab bar visible and keyboard-accessible.
**Estimated Size:** M
**Priority:** Critical
**Dependencies:** EP-001
**Child Task IDs:** TSK-002, TSK-003

---

## EP-003 — Data Layer

**Business Value:** All views consume term data. Centralizing it as a single authoritative JS structure prevents drift and makes future term additions trivial.
**Scope Summary:** The 16-term data array in `popup.js` with all fields (id, term, kind, tag, tagPhrase, definition, inTheWild, related). No network calls — pure in-memory.
**Success Criteria:** All 16 terms accessible by ID lookup; related IDs resolve to valid entries; no term is missing a required field.
**Estimated Size:** S
**Priority:** Critical
**Dependencies:** EP-001
**Child Task IDs:** TSK-004

---

## EP-004 — State Management and Persistence

**Business Value:** Bookmarking and history are the only features that persist across popup sessions. Without this layer, the Saved tab is meaningless and the extension feels stateless.
**Scope Summary:** `chrome.storage.local` read/write wrapper; state shape (`saved`, `history`, `view`, `termId`, `returnView`); history dedup logic (max 8, newest first).
**Success Criteria:** Saved and history arrays survive popup close/reopen; state reads are async-safe and don't block initial render; history caps at 8 entries.
**Estimated Size:** S
**Priority:** Critical
**Dependencies:** EP-003
**Child Task IDs:** TSK-005

---

## EP-005 — Views: Search and Glossary

**Business Value:** The two primary discovery paths. Search is the default landing; Glossary is the browse path. Together they cover how most users find terms.
**Scope Summary:** Search tab (live filter input + filtered list render), Glossary tab (A-Z sorted full list), shared term-row component (name + tag badge + truncated def + chevron).
**Success Criteria:** Search filters on keyup with no delay; Glossary shows all 16 terms A-Z; each row is clickable and navigates to Definition view.
**Estimated Size:** M
**Priority:** Critical
**Dependencies:** EP-003, EP-004
**Child Task IDs:** TSK-006, TSK-007

---

## EP-006 — View: Definition

**Business Value:** The core value delivery moment — this is where the user actually learns a term. Every navigation path leads here.
**Scope Summary:** Definition view render (term name, tag badge + phrase, full definition, "in the wild" quote with highlighted term text, related chips); bookmark toggle; back navigation; history append on view.
**Success Criteria:** All definition fields render correctly for all 16 terms; bookmark icon fills/unfills and persists; related chips navigate correctly; back arrow returns to correct origin tab; viewing a term appends to history.
**Estimated Size:** M
**Priority:** Critical
**Dependencies:** EP-003, EP-004, EP-002
**Child Task IDs:** TSK-008, TSK-009

---

## EP-007 — Views: Saved and Today

**Business Value:** Saved enables re-access to bookmarked terms and passive recall via history. Today drives serendipitous discovery of unfamiliar terms.
**Scope Summary:** Saved tab (bookmarked list + recently viewed section + empty state); Today tab (term-of-the-day card for yak shaving + 3 explore cards).
**Success Criteria:** Saved tab correctly reflects persisted state; empty state shows when both lists are empty; Today tab renders the seeded term of the day card plus 3 additional terms.
**Estimated Size:** M
**Priority:** High
**Dependencies:** EP-003, EP-004, EP-005 (shared row component)
**Child Task IDs:** TSK-010, TSK-011

---

## EP-008 — Icons

**Business Value:** Required by MV3 manifest. Without valid icons the extension cannot be submitted to the Chrome Web Store and displays a broken image in chrome://extensions.
**Scope Summary:** Generate icon PNGs at 16px, 32px, 48px, 128px. Source art: teal square with "TS" letterform in white, matching the teal accent `oklch(0.58 0.074 200)` ≈ `#3D8C8C`.
**Success Criteria:** Four PNG files exist at correct sizes; manifest references all four; no broken icon in chrome://extensions toolbar or management page.
**Estimated Size:** S
**Priority:** High
**Dependencies:** EP-001
**Child Task IDs:** TSK-012

---
