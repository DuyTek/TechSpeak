# EP-009 Tasks — Context Menu Integration

## TSK-013 — Add contextMenus permission to manifest

**Epic:** EP-009
**Effort:** XS
**Acceptance Criteria:**
- `manifest.json` permissions array includes `"contextMenus"`
- No other permissions added

---

## TSK-014 — Service worker: register and handle context menu

**Epic:** EP-009
**Effort:** S
**Acceptance Criteria:**
- `chrome.runtime.onInstalled` registers a single context menu item with id `techspeak-lookup`, title `"Define with TechSpeak"`, contexts `["selection"]`
- `chrome.contextMenus.onClicked` listener: on `techspeak-lookup`, trims selected text, stores it as `pendingLookup` in `chrome.storage.local`, then calls `chrome.action.openPopup()`
- If `selectionText` is empty or whitespace, does nothing

---

## TSK-015 — Popup: read pendingLookup on startup and navigate

**Epic:** EP-009
**Effort:** S
**Acceptance Criteria:**
- In `DOMContentLoaded`, after initial view renders, popup reads `pendingLookup` from `chrome.storage.local`
- If found: clears the key immediately, then runs `findBestMatch` against the stored text
  - Match found → calls `navigateTo(match.id, 'search')` (Definition view)
  - No match → pre-fills search input with the text and renders Search view
- If not found: default flow (Search tab, empty, focused)
- `findBestMatch(query)` tries in order: exact term name → term id → term name contained in query → query contained in term name → null

**Future Consideration:** Partial match uses first hit by TERMS array order. When multiple terms could match a selection (e.g. "tech debt and yak shaving"), the result is deterministic but arbitrary. A future task should evaluate ranked/scored matching or a disambiguation UI.
