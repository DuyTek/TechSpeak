# Tasks — EP-004: State Management and Persistence

---

```
Task ID: TSK-005
Epic: EP-004 — State Management and Persistence
Title: Implement chrome.storage.local read/write layer and in-memory state object
Size: S
Priority: Critical

Context & Background:
TechSpeak has two categories of state: persisted (saved bookmarks, history array) and ephemeral
(current view, current term ID, return view, search query). Persisted state must survive popup
close/reopen via chrome.storage.local. Ephemeral state lives only in memory for the popup's
lifetime. All views read from and write to this single state layer — no view should call
chrome.storage directly. See PRD FR-7, FR-8, FR-11, Assumption A3.

Goal:
popup.js contains a state module (object or set of functions) that: loads persisted state on
startup, exposes a read function, exposes write functions for each mutation type (toggleSave,
addToHistory, setView), and persists changes to chrome.storage.local after each mutation.

Scenarios:
- Scenario 1 — Happy Path: User bookmarks "idempotent." toggleSave('idempotent') adds the ID
  to state.saved, writes to storage, and re-renders the bookmark icon as filled. On next popup
  open, state.saved still contains 'idempotent'.
- Scenario 2 — Edge Case (history cap): User views 9 different terms in one session.
  state.history should contain exactly 8 entries — the oldest is dropped. Deduplication: if the
  user views the same term twice, it moves to the front, not duplicated.
- Scenario 3 — Error/Failure State: chrome.storage.local.get fails (e.g., storage quota exceeded
  or API unavailable). The popup must still render using empty defaults (saved: [], history: [])
  rather than crashing or showing a blank screen. Log the error to console.

Acceptance Criteria:
- [ ] AC1: On popup initialization, loadState() calls chrome.storage.local.get(['saved','history'])
      and populates an in-memory state object with the result. If keys are missing, defaults to
      { saved: [], history: [] }.
- [ ] AC2: toggleSave(termId) checks if termId is in state.saved. If present, removes it; if absent,
      adds it. After mutation, calls chrome.storage.local.set({ saved: state.saved }). The function
      returns the new boolean saved state (true = now saved, false = now unsaved).
- [ ] AC3: addToHistory(termId) prepends termId to state.history, removes any existing duplicate of
      that ID from the array, then trims the array to a maximum of 8 entries.
      After mutation, calls chrome.storage.local.set({ history: state.history }).
- [ ] AC4: setView(viewName, termId, returnView) updates the ephemeral in-memory fields
      state.view, state.termId, state.returnView. These are NOT persisted to storage (ephemeral).
      Valid viewName values: 'search', 'browse', 'saved', 'today', 'result'.
- [ ] AC5: isSaved(termId) is a synchronous helper that returns true if termId is in state.saved,
      false otherwise. It reads from the in-memory state, not from storage.
- [ ] AC6: All chrome.storage calls are wrapped in try/catch or use .catch() on the returned Promise.
      Errors are logged with console.error but do not throw to calling code.

Technical Notes:
- chrome.storage.local in MV3 returns Promises (not callbacks). Use async/await or .then()/.catch().
- The entire popup lifecycle is short (user opens, interacts, closes). Do not implement write
  debouncing — write immediately on each mutation.
- state object may be a plain JS object with a module-level const: const state = { saved: [],
  history: [], view: 'search', termId: null, returnView: null }.
- loadState() must be called and awaited before the first render in the DOMContentLoaded handler.
- Do not expose state directly to calling code — mutations must go through the defined functions
  to ensure storage is always kept in sync.

Dependencies:
- TSK-004 (TERMS data must exist for ID validation, though validation is optional at this layer)
- TSK-001 (popup.js must exist)

Definition of Done:
- State module implemented with all 5 functions (loadState, toggleSave, addToHistory, setView,
  isSaved) plus the state object
- Persistence survives popup close/reopen (manually verified)
- History cap at 8 and dedup logic verified by inspection
- Error paths logged, not thrown
- Peer-reviewed
```
