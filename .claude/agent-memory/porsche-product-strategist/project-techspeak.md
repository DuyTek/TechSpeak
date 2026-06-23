---
name: project-techspeak
description: TechSpeak Chrome extension — project context, tech decisions, and scope
metadata:
  type: project
---

TechSpeak is a Chrome extension (MV3, Vanilla JS + plain CSS, no build step) that acts as a
tech jargon glossary popup for non-technical stakeholders. It contains 16 curated terms with
definitions, "in the wild" quotes, and related term navigation.

**Why:** Non-technical employees (PMs, designers, ops) encounter engineering jargon daily in
meetings, Slack DMs, and standups, and have no lightweight workplace-tailored reference.

**Tech decisions (locked — do not re-surface):**
- Manifest V3 service worker background
- Vanilla JS + plain CSS, no React, no bundler, no build step
- All data embedded inline in popup.js (no JSON fetch, no backend)
- chrome.storage.local for saved bookmarks and history (not sync)
- Verification is manual (load unpacked in chrome://extensions)
- Google Fonts for Hanken Grotesk, Newsreader, JetBrains Mono — loaded via link tag in HTML

**File structure:** manifest.json, popup.html, popup.css, popup.js, service-worker.js, icons/

**State shape:** saved (array of term IDs), history (array, max 8, newest first, deduped),
view (ephemeral: search/browse/saved/today/result), termId (ephemeral), returnView (ephemeral)

**PRD and all task docs saved to .doc/ in project root.**

**How to apply:** When producing or validating any new features, check that they align with the
locked tech decisions above (especially: no build step, no backend calls, no content scripts,
no chrome.storage.sync).

[[project-techspeak-open-questions]]
