# Tasks — EP-003: Data Layer

---

```
Task ID: TSK-004
Epic: EP-003 — Data Layer
Title: Author the 16-term glossary data structure in popup.js
Size: S
Priority: Critical

Context & Background:
All views — Search, Glossary, Definition, Saved, Today — consume term data. The data must be
a single source of truth, embedded in popup.js as a const, requiring no network fetch.
Each term needs: id, term (display name), kind (part of speech), tag (context bucket),
tagPhrase (human label for the tag), definition (full text), inTheWild (example quote
with the target word/phrase present), and related (array of term IDs).
See PRD FR-2 through FR-6, Assumption A5.

Goal:
popup.js exports (or declares at module scope) a const TERMS array of 16 objects, one per term,
plus a getTerm(id) helper that returns a term object by ID. A getRelated(ids) helper returns
an array of term objects for a given array of IDs.

Scenarios:
- Scenario 1 — Happy Path: getTerm('blast-radius') returns the blast-radius term object with all
  required fields populated and non-empty.
- Scenario 2 — Edge Case (related resolution): getRelated(['feature-flag', 'p0']) returns an array
  of two complete term objects. Related IDs reference only IDs that exist in TERMS.
- Scenario 3 — Error/Failure State: getTerm('nonexistent-id') returns undefined (not throws).
  Callers must handle undefined gracefully.

Acceptance Criteria:
- [ ] AC1: TERMS is a const array of exactly 16 objects. Each object has all of these fields
      (none undefined or empty string): id, term, kind, tag, tagPhrase, definition, inTheWild,
      related (array, may be empty but not undefined).
- [ ] AC2: The 16 term IDs exactly match the set defined in the PRD:
      idempotent, yak-shaving, bikeshedding, rubber-ducking, flaky-test, tech-debt, lgtm,
      ship-it, blast-radius, feature-flag, race-condition, dogfooding, happy-path, nit, footgun, p0.
- [ ] AC3: tagPhrase values are: tag "meeting" → "heard in meetings", tag "dm" → "seen in DMs",
      tag "standup" → "said in standups". All 16 terms use one of these three tags.
- [ ] AC4: related arrays contain only IDs that exist in TERMS. No broken cross-references.
      Verify: every string in every related array resolves via getTerm().
- [ ] AC5: inTheWild field for every term contains a non-empty string that includes the term's
      display name (or a close variant) somewhere in the sentence, so the highlight logic in
      TSK-009 can find and wrap it.
- [ ] AC6: getTerm(id) performs an O(1) or O(n) lookup and returns the matching term object or
      undefined. A Map keyed by id is acceptable and preferred for O(1).

Technical Notes:
- Write definitions that are accurate, jargon-free, and 2–4 sentences. Assume a non-technical
  reader with no CS background.
- The "in the wild" quote should read like a realistic sentence a PM or designer would encounter
  in Slack or a meeting (e.g., "Make sure the delete endpoint is idempotent so clicking it twice
  doesn't double-delete the record.").
- TERMS should be defined before any DOM-manipulation code in popup.js.
- Using a plain array + Map is fine. No need for classes or a database abstraction.
- Do not import or fetch an external JSON file — all data inline in popup.js.

Dependencies:
- TSK-001 (popup.js file must exist)

Definition of Done:
- TERMS array populated with all 16 terms, all fields non-empty
- getTerm() and getRelated() helpers implemented
- All related IDs verified to resolve
- No console errors on script load
- Peer-reviewed
```
