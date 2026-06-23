# Tasks — EP-007: Views — Saved and Today

---

```
Task ID: TSK-010
Epic: EP-007 — Views: Saved and Today
Title: Implement Saved tab (bookmarked list + history + empty state)
Size: S
Priority: High

Context & Background:
The Saved tab (data-tab="saved") is divided into two sections: bookmarked terms and "recently
looked up" history. Both are populated from persisted state loaded at startup. The empty state
(nothing saved, no history) must render a meaningful message rather than a blank panel.
See PRD FR-8, FR-9.

Goal:
renderSavedView() reads state.saved and state.history, renders a bookmarked terms section and
a recently viewed section (each with their own heading), and handles the empty state when both
are empty.

Scenarios:
- Scenario 1 — Happy Path: User has saved "idempotent" and "blast radius" and recently viewed
  "lgtm" and "nit." The Saved tab shows: a "Saved" section header with two term rows (idempotent,
  blast radius), then a "Recently looked up" section header with two term rows (lgtm, nit,
  in view order — most recent first). Each row is clickable and navigates to Definition view.
- Scenario 2 — Edge Case (saved but no history): User has bookmarked terms but has not browsed
  any yet in this session (history array is empty). The "Saved" section renders normally. The
  "Recently looked up" section header is hidden (or shows "Nothing browsed yet" sub-message) —
  it does not render an empty list container.
- Scenario 3 — Error/Failure State (nothing saved or viewed): Both state.saved and state.history
  are empty arrays. The entire view renders an empty state: a centered illustration or icon,
  heading "Nothing saved yet", and subtext "Browse the glossary and bookmark terms to find them
  here." No section headers rendered.

Acceptance Criteria:
- [ ] AC1: When state.saved is non-empty, a "Saved" section heading renders above a list of
      term rows (using renderTermRow from TSK-006) for each saved term ID. Terms render in
      the order they appear in state.saved.
- [ ] AC2: When state.history is non-empty, a "Recently looked up" section heading renders above
      a list of term rows for each history term ID. Terms render in state.history order
      (index 0 = most recent).
- [ ] AC3: When both state.saved and state.history are empty arrays, neither section heading
      renders. Instead, an empty-state block renders with a heading and subtext as specified
      in Scenario 3.
- [ ] AC4: When state.saved is empty but state.history is non-empty (or vice versa), only the
      non-empty section renders. The empty section is not shown (not even an empty list).
- [ ] AC5: Clicking a term row in either section calls setView('result', termId, 'saved'),
      shows the definition view, and calls addToHistory(termId).
- [ ] AC6: renderSavedView() is called (re-renders) each time the Saved tab is made active,
      so that changes made in other tabs (new bookmarks, new history) are reflected immediately
      when the user returns to Saved.

Technical Notes:
- Re-use renderTermRow from TSK-006 for all term rows in this view.
- IDs in state.saved or state.history that no longer exist in TERMS (e.g., data was edited)
  must be filtered out gracefully (getTerm returns undefined — skip that entry).
- The empty state illustration can be a simple SVG inline (a bookmark icon outline, for example)
  or a styled CSS element. Do not use an external image.
- Section order: Saved section appears above Recently looked up section.

Dependencies:
- TSK-006 (renderTermRow)
- TSK-005 (state: saved, history)
- TSK-004 (getTerm for ID resolution)
- TSK-003 (HTML: saved view container)

Definition of Done:
- Both sections render correctly when populated
- Empty state renders when both lists are empty
- Partial empty states handled (one section, not both)
- Re-renders on tab activation
- No console errors
- Peer-reviewed
```

---

```
Task ID: TSK-011
Epic: EP-007 — Views: Saved and Today
Title: Implement Today tab (term of the day + explore cards)
Size: S
Priority: High

Context & Background:
The Today tab (data-tab="today") surfaces a featured "term of the day" card prominently, plus
3 additional terms to explore. In v1, the term of the day is statically seeded as "yak shaving."
The 3 explore terms are a fixed selection from the remaining terms. This tab drives serendipitous
discovery. See PRD FR-10, Assumption A4.

Goal:
renderTodayView() mounts a large featured card for the term of the day ("yak-shaving") and three
smaller explore cards for three other terms. All cards are clickable and navigate to the Definition
view with returnView set to 'today'.

Scenarios:
- Scenario 1 — Happy Path: User opens the Today tab. A prominent card at the top shows:
  "Term of the day" label, "yak shaving" as the term name (Newsreader), the [standup] badge,
  and the first sentence or truncated form of the definition. Below it, three explore cards show
  three other terms (e.g., "bikeshedding," "blast radius," "rubber ducking") with their name,
  tag badge, and truncated definition.
- Scenario 2 — Edge Case (Today tab re-visited): The user navigates to another tab and back.
  The Today tab re-renders identically — the term of the day does not change within a session.
- Scenario 3 — Error/Failure State: getTerm('yak-shaving') returns undefined (data issue).
  The featured card renders a fallback ("Check back later") rather than crashing. The 3 explore
  cards still attempt to render from their term IDs.

Acceptance Criteria:
- [ ] AC1: The featured "term of the day" card renders with: a "Term of the day" label in
      --font-mono / muted color, the term's display name in Newsreader (large, ≥ 20px), the
      term's tag badge, and a truncated definition (≤ 80 chars).
- [ ] AC2: The featured card is visually distinct from explore cards: it is larger, may have a
      different background (e.g., teal tint or subtle warm tone), and occupies the full width
      of the content area.
- [ ] AC3: Three explore cards render below the featured card. The three term IDs are statically
      defined in the code (e.g., ['bikeshedding', 'blast-radius', 'rubber-ducking']). Each card
      shows the term name, tag badge, and truncated definition (≤ 60 chars).
- [ ] AC4: Clicking the featured card calls setView('result', 'yak-shaving', 'today') and renders
      the Definition view for yak shaving.
- [ ] AC5: Clicking any explore card calls setView('result', termId, 'today') and renders the
      correct Definition view.
- [ ] AC6: If getTerm('yak-shaving') returns undefined, the featured card area renders the text
      "Today's term is unavailable" and does not throw a JS error.

Technical Notes:
- The Today tab does NOT use renderTermRow — the card layout is visually distinct and must be
  a separate renderTodayCard(term, isFeatured) function.
- The 3 explore term IDs can be a const array at the top of the renderTodayView function.
  They do not need to rotate or be random in v1.
- Consider making the featured card a full-bleed teal-tinted block to match the design's
  visual prominence for the term of the day.
- "Recently looked up" from the Saved tab is separate from the Today explore cards — do not
  conflate the two.

Dependencies:
- TSK-004 (getTerm)
- TSK-005 (setView, addToHistory)
- TSK-003 (HTML: today view container)
- TSK-002 (CSS tokens for featured card styling)

Definition of Done:
- Featured yak shaving card renders with all required fields
- 3 explore cards render with correct terms
- All cards navigate to correct definition view with returnView 'today'
- getTerm undefined handled gracefully
- No console errors
- Peer-reviewed
```
