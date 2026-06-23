# Tasks — EP-006: View — Definition

---

```
Task ID: TSK-008
Epic: EP-006 — View: Definition
Title: Implement Definition view rendering and back/close navigation
Size: M
Priority: Critical

Context & Background:
The Definition view is the core value-delivery screen. It is reached from any tab and must
correctly render all fields for any of the 16 terms. It also handles back navigation (return to
origin tab), close (window.close()), and triggers history logging. The definition header variant
(back + title + bookmark + close) must be shown while this view is active, replacing the brand
header. See PRD FR-4, FR-5, FR-6, FR-12, FR-13.

Goal:
renderDefinitionView(termId) reads the term from TERMS, populates the definition view container
with all required fields, switches the header to definition-header mode, and calls addToHistory.
The back button returns to the tab stored in state.returnView. The close button calls window.close().

Scenarios:
- Scenario 1 — Happy Path: User taps "blast radius" in Glossary. Definition view renders:
  "blast radius" in Newsreader 32px, [meeting] badge + "heard in meetings" phrase, full definition
  paragraph, "In the wild" section with a quote, and related chips for "feature-flag" and "p0".
  The definition header shows "blast radius" title, back arrow, a bookmark icon (unfilled),
  and a close icon.
- Scenario 2 — Edge Case (related chips): "dogfooding" has one related term: "ship-it". Its
  related section must render exactly one chip. If a related array is empty (edge case per data),
  the "Related" section header should be hidden, not render an empty chip container.
- Scenario 3 — Error/Failure State: renderDefinitionView is called with an invalid termId.
  The function logs console.error and renders a fallback message ("Term not found") in the
  definition view container rather than throwing or showing a blank screen.

Acceptance Criteria:
- [ ] AC1: The definition view container renders the following elements for the given term:
      (a) Term name in Newsreader font, font-size ≥ 28px, font-weight 700 or regular per design.
      (b) Tag badge ([meeting] / [dm] / [standup]) in JetBrains Mono, bordered style.
      (c) Tag phrase ("heard in meetings" etc.) in muted text adjacent to the badge.
      (d) Full definition text in Newsreader serif.
      (e) "In the wild" section label and quote text in italic, Newsreader serif.
      (f) Related section with chip buttons for each related term ID (see TSK-009 for chip wiring).
- [ ] AC2: When renderDefinitionView is called, the brand header (.header-brand) is hidden and
      the definition header (.header-definition) is shown. The .header-title span text is set to
      the term's display name.
- [ ] AC3: addToHistory(termId) is called once per renderDefinitionView invocation. It is NOT
      called on re-renders of the same term (guard: only call if termId !== last-added ID).
- [ ] AC4: The back button in the definition header reads state.returnView and calls the appropriate
      view-switch function to show that tab. The definition header is hidden and the brand header
      is shown. The originating tab's .tab--active class is restored.
- [ ] AC5: The close button in both the brand header and the definition header calls window.close().
- [ ] AC6: If the term's related array is empty, the "Related" section (label + chips container)
      is not rendered (display: none or not inserted into DOM).

Technical Notes:
- The definition view container (#view-result or similar) should be populated via innerHTML or
  DOM API — do not use innerHTML with unsanitized user input (all content here is from the TERMS
  const, so innerHTML from static data is acceptable).
- The definition view shares the scrollable content area with the other tabs. Ensure it can scroll
  if the definition is long (overflow-y: auto on the content area).
- The bookmark icon wiring (filled/unfilled based on isSaved) is implemented in TSK-009.
  At this stage, the bookmark button element must exist and be accessible.
- "In the wild" quote styling: the entire quote is italic; the specific term text within the quote
  is wrapped in <mark> or <span class="highlight"> and styled in teal (--color-accent).
  The highlight logic is in TSK-009.
- Keep renderDefinitionView as a single function that clears and repopulates the container on each
  call — no diffing needed given the small dataset.

Dependencies:
- TSK-004 (TERMS, getTerm)
- TSK-005 (state: addToHistory, setView, isSaved)
- TSK-003 (HTML: definition view container, both header variants must exist in DOM)
- TSK-002 (CSS: Newsreader font, token variables)

Definition of Done:
- renderDefinitionView renders all required fields for all 16 terms
- Header switches to definition variant on activation
- Back navigation returns to correct origin tab
- Close calls window.close()
- Empty related array hides related section
- History is appended on view
- No console errors
- Peer-reviewed
```

---

```
Task ID: TSK-009
Epic: EP-006 — View: Definition
Title: Implement "In the wild" highlight, related term chips, and bookmark toggle
Size: S
Priority: Critical

Context & Background:
Three interactive/visual details in the Definition view require their own implementation work:
(1) highlighting the term within the "in the wild" quote; (2) rendering related term chips that
navigate to another term's definition; (3) the bookmark icon that toggles fill state and persists.
These are separated from TSK-008 because they each have distinct logic. See PRD FR-5, FR-6, FR-7.

Goal:
(1) The "in the wild" quote renders with the term's display name (case-insensitive) wrapped in a
<mark> or <span class="highlight"> element styled in teal. (2) Each related term chip is a <button>
that calls renderDefinitionView(relatedTermId) on click. (3) The bookmark button in the definition
header reflects isSaved(termId) on render and toggles on click, writing to storage and updating
the icon's visual state.

Scenarios:
- Scenario 1 — Happy Path: "idempotent" definition view opens. The inTheWild text contains the
  word "idempotent" which is wrapped in <span class="highlight"> and appears in teal. Two related
  chips show: "race condition" and "feature flag" (rendered as display names, not IDs). Clicking
  "race condition" chip opens the race-condition definition. Bookmark icon is unfilled (not saved).
  User clicks bookmark — icon fills in teal, term is saved, storage is updated.
- Scenario 2 — Edge Case (term already saved): User re-opens "idempotent" definition after
  having saved it in a prior session. The bookmark icon renders pre-filled on load (isSaved returns
  true from loaded state). Clicking again removes the bookmark (unfills, removes from storage).
- Scenario 3 — Error/Failure State: The inTheWild string does not contain the term name (data
  authored incorrectly). Highlight logic finds no match and renders the quote without highlight
  rather than crashing. The quote still appears.

Acceptance Criteria:
- [ ] AC1: highlightTerm(quoteText, termDisplayName) is a function that returns an HTML string
      (or DocumentFragment) where the first occurrence of termDisplayName (case-insensitive)
      in quoteText is wrapped in <span class="highlight">. All other text is plain text nodes
      (not raw HTML) to avoid XSS risks.
- [ ] AC2: The "in the wild" quote container renders the result of highlightTerm(). The .highlight
      class applies: color: var(--color-accent), font-style: inherit (inherits italic from parent).
- [ ] AC3: Related term chips are <button type="button"> elements displaying the related term's
      display name (term.term, not the ID). Each chip has: border-radius ≥ 16px (pill shape),
      border: 1px solid --color-accent or --color-text-muted, font-family: --font-ui.
      Clicking a chip calls renderDefinitionView(relatedTerm.id) — the returnView does NOT change
      when navigating chip-to-chip (the user should still be able to back out to the original tab).
- [ ] AC4: On renderDefinitionView(termId), the bookmark button's visual state is set based on
      isSaved(termId): if saved, apply .bookmark--active class (filled icon, teal color); if not
      saved, remove .bookmark--active class (outline icon, muted color).
- [ ] AC5: Clicking the bookmark button calls toggleSave(termId), then updates the button's
      .bookmark--active class to reflect the new state. No page re-render required — only the
      bookmark button's class changes.
- [ ] AC6: Chip navigation does not push a new returnView to state. The returnView set when
      first entering the Definition view (e.g., 'browse') is preserved through chip navigation,
      so the back arrow always returns to the originating tab, not to the previously viewed
      definition term.

Technical Notes:
- highlightTerm must not use innerHTML with the raw quoteText if quoteText could ever contain
  user-provided content. Since inTheWild is authored in the TERMS const (static), using a
  string replace into innerHTML is acceptable but use a text-node-based approach for correctness:
  split on the match, create text nodes and the span node, append all to a DocumentFragment.
- Bookmark icon can be an SVG bookmark shape with two states: outline (not saved) and filled
  (saved). Use currentColor and change color via CSS class rather than swapping two separate SVGs.
- Related chips: getRelated(term.related) from TSK-004 returns the full term objects needed to
  display the display name.
- Chip-to-chip navigation: when a chip is clicked, renderDefinitionView is called with the new
  termId and the current state.returnView is preserved (do not call setView — or call it only
  with the new termId, leaving returnView unchanged).

Dependencies:
- TSK-008 (definition view DOM structure must exist)
- TSK-005 (isSaved, toggleSave, state.returnView)
- TSK-004 (getTerm, getRelated)

Definition of Done:
- Highlight wraps first match of term name in teal span
- No highlight if no match (no crash)
- Related chips render display names, navigate correctly, preserve returnView
- Bookmark reflects saved state on load, toggles on click, persists
- No console errors
- Peer-reviewed
```
