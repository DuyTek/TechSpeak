# TechSpeak

A Chrome extension that explains tech jargon — right where you're reading. Click the icon and instantly look up terms like *idempotent*, *blast radius*, *yak shaving*, and 13 more, with plain-English definitions, real-world examples, and related terms.

Built for designers, PMs, and anyone who sits in engineering meetings but doesn't always have a CS degree handy.

---

## Install

TechSpeak is not yet on the Chrome Web Store. Load it manually as an unpacked extension:

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `TechSpeak` folder (the one containing `manifest.json`)
6. The TechSpeak icon appears in your Chrome toolbar

---

## Using the extension

Click the TechSpeak icon in the toolbar to open the popup. It has four tabs:

| Tab | What it does |
|-----|-------------|
| **Search** | Type any word to live-filter the glossary. Searches term names, definitions, and context tags. |
| **Glossary** | Browse all 16 terms alphabetically (A–Z). |
| **Saved** | Terms you've bookmarked + your recent lookup history. Persists across sessions. |
| **Today** | A featured "term of the day" (yak shaving) and three other terms to explore. |

Tap any term to open its **definition view**, which shows:
- Full definition in plain English
- A real-world usage example with the term highlighted
- Related terms (tap a chip to jump to that definition)
- A bookmark icon to save the term for later

The **back arrow** returns you to whichever tab you came from. The **✕** closes the popup.

---

## Project structure

```
TechSpeak/
├── manifest.json       # Extension manifest (Manifest V3)
├── popup.html          # Popup UI structure — all views in one document
├── popup.css           # All styles; uses CSS custom properties for design tokens
├── popup.js            # All logic: data, state, rendering, event handling
├── service-worker.js   # MV3 background service worker (stub — no background tasks in v1)
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Scripting | Vanilla JS (ES2020) | No build step, zero dependencies, loads instantly |
| Styles | Plain CSS with custom properties | Same rationale; design tokens as CSS variables |
| Extension format | Manifest V3 | Required for Chrome Web Store submissions |
| Persistence | `chrome.storage.local` | Survives popup close/reopen without a backend |
| Fonts | Google Fonts (Hanken Grotesk, Newsreader, JetBrains Mono) | Loaded via `<link>` — permitted under MV3 CSP |

There is no build step, no bundler, no package manager. Files are served directly from the extension directory.

---

## Running locally (for contributors)

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd TechSpeak
   ```

2. **Load into Chrome** (see [Install](#install) above)

3. **Make a change** — edit any file in your editor

4. **Reload the extension**
   - Go to `chrome://extensions`
   - Click the **Reload** button (circular arrow) on the TechSpeak card
   - Reopen the popup

That's the full dev loop. No compilation, no server, no hot-reload.

> **Tip:** Pin the TechSpeak icon to your toolbar so you don't have to hunt for it after each reload.

---

## Contributing

Contributions are welcome. There are no other contributors yet, so the bar to getting started is low.

1. Fork the repository
2. Create a branch: `git checkout -b my-feature`
3. Make changes and reload the extension in Chrome to test
4. Verify all four tabs and the definition view still work correctly
5. Open a pull request with a short description of what changed and why

There is currently no automated test suite. All testing is manual — load the unpacked extension and exercise the flows described in [Using the extension](#using-the-extension).

### Code conventions
- No frameworks, no build tools — keep it that way unless there's a strong reason
- All event listeners attached in `popup.js` via `addEventListener`; no inline `onclick` attributes
- `chrome.storage.local` is the only Chrome API in use; all reads/writes go through the state functions in `popup.js` (`loadState`, `toggleSave`, `addToHistory`)

---

## Adding or editing terms

All glossary content lives in the `TERMS` array at the top of `popup.js`. Each term is a plain object:

```js
{
  id: 'blast-radius',      // kebab-case, unique, used for cross-references
  term: 'blast radius',    // display name shown in the UI
  kind: 'noun',            // part of speech: noun, verb, adjective, phrase, abbreviation
  pron: null,              // pronunciation string, or null
  tag: 'meeting',          // context bucket: 'meeting' | 'dm' | 'standup'
  tagPhrase: 'heard in meetings',  // human label for the tag
  definition: 'How much breaks, and who is affected, if a given change or system goes wrong.',
  inTheWild: 'Let\'s keep the blast radius small by rolling out to 5% first.',
  // ↑ Must contain the exact term name so the highlight logic can find and wrap it
  related: ['feature-flag', 'p0'],  // array of term IDs; must resolve to existing entries
}
```

After adding a term, reload the extension and check that:
- It appears in the Glossary (A–Z)
- Search finds it by name and definition
- Any `related` IDs you listed open correctly from the definition view

---

## Design source

The original UI design lives in Claude Design:
`https://claude.ai/design/p/5a230f5f-100f-49fb-a4df-006a844c886f?file=TechSpeak.dc.html`
