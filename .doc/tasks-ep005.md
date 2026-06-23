# Tasks — EP-005: Views — Search and Glossary

---

```
Task ID: TSK-006
Epic: EP-005 — Views: Search and Glossary
Title: Implement shared term-row component and Glossary tab (A-Z list)
Size: S
Priority: Critical

Context & Background:
The Glossary tab (data-tab="browse") is the canonical A-Z list of all 16 terms. It uses a term-row
component — a reusable HTML structure showing term name, tag badge, and truncated definition with
a trailing chevron — that is also used in the Search tab and Saved tab. Building this component
and the Glossary view first establishes the shared rendering primitive. See PRD FR-3, FR-4.

Goal:
A renderTermRow(term) function in popup.js returns a DOM element (<li> or <div>) representing a
single term row. The Glossary tab view function calls TERMS.sort(A-Z).map(renderTermRow) and
mounts the result into the browse view container. Clicking any row calls setView('result', term.id,
'browse') and triggers the Definition view render.

Scenarios:
- Scenario 1 — Happy Path: User clicks the Glossary tab. All 16 terms appear sorted A-Z. Each
  row shows: term name in --font-ui, [tag] badge in --font-mono with a border, truncated definition
  (≤60 chars + ellipsis), and a right-pointing chevron icon.
- Scenario 2 — Edge Case (long definition): The definition truncation must not break in the middle
  of a word. Use CSS text-overflow: ellipsis with overflow: hidden and white-space: nowrap — or
  JS substr to a word boundary. Neither approach should cause layout overflow.
- Scenario 3 — Error/Failure State: If TERMS is empty or undefined (data layer failed silently),
  the Glossary container should render a fallback message ("No terms available") rather than
  crashing with a JS error.

Acceptance Criteria:
- [ ] AC1: renderTermRow(term) returns a focusable, clickable element containing: the term's display
      name, a [tag] badge matching the term's tag value, and the term's definition truncated at
      60 characters with "..." appended if longer.
- [ ] AC2: The Glossary tab renders all 16 terms sorted case-insensitively A-Z by term.term
      (display name). Order: bikeshedding, blast radius, dogfooding, feature flag, flaky test,
      footgun, happy path, idempotent, LGTM, nit, P0, race condition, rubber ducking, ship it,
      tech debt, yak shaving.
- [ ] AC3: Clicking a term row calls setView('result', termId, 'browse'), hides the browse view
      container, shows the definition view container, calls addToHistory(termId), and renders
      the correct term's definition (TSK-008 wires the full render; at this stage, the navigation
      handoff must occur correctly even if definition view is a stub).
- [ ] AC4: Tag badges use a bordered/outlined style (border: 1px solid --color-tag, color: --color-tag,
      font-family: --font-mono, padding: 2px 6px, border-radius: 4px).
- [ ] AC5: The Glossary container is scrollable vertically (overflow-y: auto) within the content
      area between header and tab bar. The header and tab bar remain fixed (do not scroll).

Technical Notes:
- renderTermRow is a pure function: it receives a term object and returns a DOM node. Do not
  mix rendering logic with state mutations in this function — pass a click handler as a parameter
  or attach it after the element is created.
- Alphabetical sort: TERMS.slice().sort((a, b) => a.term.localeCompare(b.term)).
- For the chevron icon, use an inline SVG or a CSS border-based chevron. Do not use an image file.
- Each row element should have role="button" and tabindex="0" if it is not a native <button>,
  or use a native <button> wrapper to satisfy NFR-4 keyboard accessibility.

Dependencies:
- TSK-004 (TERMS data)
- TSK-005 (state functions: setView, addToHistory)
- TSK-003 (HTML structure: browse view container must exist)

Definition of Done:
- renderTermRow function implemented and used in Glossary view
- All 16 terms render in correct A-Z order
- Click navigates to definition view (even stub)
- Scrolling works; header and tab bar stay fixed
- No console errors
- Peer-reviewed
```

---

```
Task ID: TSK-007
Epic: EP-005 — Views: Search and Glossary
Title: Implement Search tab with live-filter input
Size: S
Priority: Critical

Context & Background:
Search is the default landing tab (data-tab="search"). It shows a sticky search input at the top
and a live-filtered list of term rows below it. Filtering happens on every keyup event against
term display names. An empty query shows all terms (or a placeholder prompt). See PRD FR-2, FR-4.

Goal:
The Search tab contains a <input type="search"> or <input type="text"> element and a results list
container. On each input event, the list re-renders filtered term rows matching the query against
term.term (case-insensitive substring match). Clicking a result navigates to Definition view.

Scenarios:
- Scenario 1 — Happy Path: User types "ra" in the search box. The list narrows to show "race
  condition" (and any other terms containing "ra", e.g., "blast radius"). Results update
  immediately with no perceived delay.
- Scenario 2 — Edge Case (no match): User types "zzz". The results list is empty. A "No terms
  found" message appears in the list area. The input remains focused.
- Scenario 3 — Error/Failure State: User types, then clears the input. The full term list
  reappears (all 16 terms), not an empty state. The empty string query is treated as "show all."

Acceptance Criteria:
- [ ] AC1: The Search tab contains an <input> element with placeholder text (e.g., "Search terms…"),
      positioned at the top of the content area, sticky (does not scroll with results).
- [ ] AC2: On every input event (not keydown, not change — input event), the results list is
      re-rendered with term rows matching the query via case-insensitive substring match on
      term.term. The existing renderTermRow function from TSK-006 is reused for each result.
- [ ] AC3: When the query is empty or whitespace-only, all 16 terms are displayed (same list as
      Glossary, but order may be relevance or A-Z — A-Z is acceptable as default).
- [ ] AC4: When no terms match the query, the results list container shows exactly one element:
      a "No terms found" message (not an empty blank area).
- [ ] AC5: When the Search tab is made active (tab-switch), focus is programmatically set to
      the search input element.
- [ ] AC6: Clicking a filtered result row navigates to Definition view with returnView set to
      'search', identical to the Glossary tab navigation pattern.

Technical Notes:
- Use the native input event: searchInput.addEventListener('input', handler). Do not debounce —
  the dataset is 16 terms; synchronous filter is imperceptible.
- Case-insensitive match: query.toLowerCase() and term.term.toLowerCase().includes(query).
  Also consider matching against the definition or tag for richer search — but matching term
  name only is the minimum requirement.
- The search input value is ephemeral (state.query); it is not persisted to chrome.storage.
- Re-use renderTermRow from TSK-006. Do not duplicate the row rendering logic.
- When switching away from Search tab and back, the previous query string and results may be
  preserved (no requirement to clear on tab switch).

Dependencies:
- TSK-006 (renderTermRow function)
- TSK-005 (setView, addToHistory)
- TSK-003 (HTML: search view container, input element must be in DOM)

Definition of Done:
- Search input renders, filters on type, shows "No terms found" on no match
- Focus set to input on tab activation
- Click navigates to definition view with correct returnView
- No console errors
- Peer-reviewed
```
