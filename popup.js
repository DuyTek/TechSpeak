'use strict';

// ── Data ─────────────────────────────────────────────────────────────────────

const TERMS = [
  {
    id: 'idempotent',
    term: 'idempotent',
    kind: 'adjective',
    pron: '/aɪˈdɛm.pə.tənt/',
    tag: 'meeting',
    tagPhrase: 'heard in meetings',
    definition: 'An operation you can run any number of times and always get the same result as running it once. Hitting "save" twice doesn\'t create two copies.',
    inTheWild: 'Make the retry idempotent so a flaky connection can\'t double-charge anyone.',
    related: ['race-condition', 'feature-flag'],
  },
  {
    id: 'yak-shaving',
    term: 'yak shaving',
    kind: 'phrase',
    pron: null,
    tag: 'standup',
    tagPhrase: 'said in standups',
    definition: 'The chain of unrelated little tasks you have to finish before you can do the thing you actually sat down to do.',
    inTheWild: 'I just wanted to fix a typo, but now I\'m deep in yak shaving — three layers of build config before I can even start.',
    related: ['tech-debt', 'bikeshedding'],
  },
  {
    id: 'bikeshedding',
    term: 'bikeshedding',
    kind: 'verb',
    pron: null,
    tag: 'meeting',
    tagPhrase: 'heard in meetings',
    definition: 'Spending disproportionate time arguing over a trivial detail while the genuinely hard decisions go untouched.',
    inTheWild: 'We spent forty minutes bikeshedding the button color and never discussed the launch.',
    related: ['nit', 'yak-shaving'],
  },
  {
    id: 'rubber-ducking',
    term: 'rubber ducking',
    kind: 'phrase',
    pron: null,
    tag: 'dm',
    tagPhrase: 'seen in DMs',
    definition: 'Explaining your problem out loud, step by step — often to an inanimate object — until you spot the answer yourself.',
    inTheWild: 'Never mind, I figured it out rubber ducking it to you. Thanks anyway!',
    related: ['happy-path'],
  },
  {
    id: 'flaky-test',
    term: 'flaky test',
    kind: 'noun',
    pron: null,
    tag: 'standup',
    tagPhrase: 'said in standups',
    definition: 'A test that passes and fails on the very same code for no clear reason — usually timing or environment, not your change.',
    inTheWild: 'Ignore the red check — that one\'s just a flaky test, re-run it and it\'ll pass.',
    related: ['race-condition'],
  },
  {
    id: 'tech-debt',
    term: 'tech debt',
    kind: 'noun',
    pron: null,
    tag: 'meeting',
    tagPhrase: 'heard in meetings',
    definition: 'The future cost of choosing a quick solution now instead of the better one that takes longer. Interest accrues.',
    inTheWild: 'We can ship the hack this week, but we\'re taking on real tech debt that\'ll slow us down next quarter.',
    related: ['yak-shaving', 'footgun'],
  },
  {
    id: 'lgtm',
    term: 'LGTM',
    kind: 'abbreviation',
    pron: null,
    tag: 'dm',
    tagPhrase: 'seen in DMs',
    definition: '"Looks good to me." A quick approval on a review or proposal — sometimes a careful sign-off, sometimes a rubber stamp.',
    inTheWild: 'LGTM — ship it once the tests are green.',
    related: ['ship-it', 'nit'],
  },
  {
    id: 'ship-it',
    term: 'ship it',
    kind: 'phrase',
    pron: null,
    tag: 'standup',
    tagPhrase: 'said in standups',
    definition: 'To release a change to real users. Often a rallying cry meaning "this is good enough — let\'s go."',
    inTheWild: 'Tests pass, design signed off. Ship it.',
    related: ['lgtm', 'feature-flag'],
  },
  {
    id: 'blast-radius',
    term: 'blast radius',
    kind: 'noun',
    pron: null,
    tag: 'meeting',
    tagPhrase: 'heard in meetings',
    definition: 'How much breaks, and who is affected, if a given change or system goes wrong. Smaller is safer.',
    inTheWild: 'Let\'s gate it behind a flag to keep the blast radius small if something goes wrong.',
    related: ['feature-flag', 'p0'],
  },
  {
    id: 'feature-flag',
    term: 'feature flag',
    kind: 'noun',
    pron: null,
    tag: 'meeting',
    tagPhrase: 'heard in meetings',
    definition: 'A switch in the code that turns a feature on or off without a new release — used to test, roll out gradually, or kill it fast.',
    inTheWild: 'It\'s behind a feature flag, so we can enable it for 5% of users first.',
    related: ['ship-it', 'blast-radius'],
  },
  {
    id: 'race-condition',
    term: 'race condition',
    kind: 'noun',
    pron: null,
    tag: 'standup',
    tagPhrase: 'said in standups',
    definition: 'A bug that appears when two things happen at once in an order you didn\'t expect, so the outcome depends on timing.',
    inTheWild: 'The double-submit is a race condition between the click and the network call.',
    related: ['idempotent', 'flaky-test'],
  },
  {
    id: 'dogfooding',
    term: 'dogfooding',
    kind: 'verb',
    pron: null,
    tag: 'meeting',
    tagPhrase: 'heard in meetings',
    definition: 'Using your own product internally before customers do, so your team feels the rough edges first.',
    inTheWild: 'We\'ve been dogfooding the new editor for two weeks and the bugs are obvious.',
    related: ['ship-it'],
  },
  {
    id: 'happy-path',
    term: 'happy path',
    kind: 'noun',
    pron: null,
    tag: 'standup',
    tagPhrase: 'said in standups',
    definition: 'The scenario where everything goes right and the user does exactly what you expected — no errors, no edge cases.',
    inTheWild: 'It works on the happy path; we still need to handle the empty state.',
    related: ['rubber-ducking'],
  },
  {
    id: 'nit',
    term: 'nit',
    kind: 'noun',
    pron: null,
    tag: 'dm',
    tagPhrase: 'seen in DMs',
    definition: 'A minor, non-blocking comment on a review — a nitpick. Usually prefixed "nit:" so the author knows it\'s optional.',
    inTheWild: 'nit: extra space on line 12, totally fine to ignore.',
    related: ['lgtm', 'bikeshedding'],
  },
  {
    id: 'footgun',
    term: 'footgun',
    kind: 'noun',
    pron: null,
    tag: 'dm',
    tagPhrase: 'seen in DMs',
    definition: 'A tool or feature that works as designed but makes it dangerously easy to shoot yourself in the foot.',
    inTheWild: 'That config option is a total footgun — one typo and prod is down.',
    related: ['tech-debt', 'blast-radius'],
  },
  {
    id: 'p0',
    term: 'P0',
    kind: 'noun',
    pron: null,
    tag: 'standup',
    tagPhrase: 'said in standups',
    definition: 'Priority zero — the highest-severity, drop-everything issue. More urgent than a P1, P2, and so on.',
    inTheWild: 'Site\'s down — this is a P0. Paging the on-call now.',
    related: ['blast-radius'],
  },
];

const _termMap = new Map(TERMS.map(t => [t.id, t]));
const getTerm = id => _termMap.get(id);
const getRelated = ids => (ids || []).map(id => getTerm(id)).filter(Boolean);

function findBestMatch(query) {
  const q = query.toLowerCase();
  return (
    TERMS.find(t => t.term.toLowerCase() === q) ||
    TERMS.find(t => t.id === q.replace(/\s+/g, '-')) ||
    TERMS.find(t => q.includes(t.term.toLowerCase())) ||
    TERMS.find(t => t.term.toLowerCase().includes(q)) ||
    null
  );
}

// ── State ─────────────────────────────────────────────────────────────────────

const state = {
  saved: [],
  history: [],
  view: 'search',
  termId: null,
  returnView: 'search',
  query: '',
};

const _storage = (typeof chrome !== 'undefined' && chrome.storage)
  ? chrome.storage.local
  : { get: () => Promise.resolve({}), set: () => Promise.resolve() };

async function loadState() {
  try {
    const data = await _storage.get(['saved', 'history']);
    state.saved   = Array.isArray(data.saved)   ? data.saved   : [];
    state.history = Array.isArray(data.history) ? data.history : [];
  } catch (e) {
    console.error('[TechSpeak] loadState:', e);
  }
}

function isSaved(termId) {
  return state.saved.includes(termId);
}

async function toggleSave(termId) {
  state.saved = isSaved(termId)
    ? state.saved.filter(id => id !== termId)
    : [termId, ...state.saved];
  try {
    await _storage.set({ saved: state.saved });
  } catch (e) {
    console.error('[TechSpeak] toggleSave:', e);
  }
  return isSaved(termId);
}

async function addToHistory(termId) {
  state.history = [termId, ...state.history.filter(id => id !== termId)].slice(0, 8);
  try {
    await _storage.set({ history: state.history });
  } catch (e) {
    console.error('[TechSpeak] addToHistory:', e);
  }
}

function setView(viewName, termId, returnView) {
  state.view = viewName;
  if (termId !== undefined)    state.termId    = termId;
  if (returnView !== undefined) state.returnView = returnView;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function truncate(str, max) {
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s\S*$/, '') + '…';
}

function makeSvgEl(path, attrs = {}) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  Object.entries({ fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', ...attrs })
    .forEach(([k, v]) => svg.setAttribute(k, v));
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', path);
  svg.appendChild(p);
  return svg;
}

function makeChevron() {
  const svg = makeSvgEl('M9 6l6 6-6 6', {
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    class: 'chevron',
    width: '15',
    height: '15',
    'aria-hidden': 'true',
  });
  return svg;
}

function makeHistoryIcon() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', 'history-icon');
  svg.setAttribute('aria-hidden', 'true');
  const circle = document.createElementNS(ns, 'circle');
  circle.setAttribute('cx', '12'); circle.setAttribute('cy', '12'); circle.setAttribute('r', '9');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M12 7v5l3 2');
  svg.appendChild(circle);
  svg.appendChild(path);
  return svg;
}

function makeTagBadge(tag, extraClass = '') {
  const span = document.createElement('span');
  span.className = 'tag-badge' + (extraClass ? ' ' + extraClass : '');
  span.textContent = '[' + tag + ']';
  return span;
}

// ── Highlight ─────────────────────────────────────────────────────────────────

function highlightTerm(quoteText, termDisplayName) {
  const idx = quoteText.toLowerCase().indexOf(termDisplayName.toLowerCase());
  if (idx === -1) {
    return document.createTextNode(quoteText);
  }
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createTextNode(quoteText.slice(0, idx)));
  const mark = document.createElement('span');
  mark.className = 'highlight';
  mark.textContent = quoteText.slice(idx, idx + termDisplayName.length);
  frag.appendChild(mark);
  frag.appendChild(document.createTextNode(quoteText.slice(idx + termDisplayName.length)));
  return frag;
}

// ── Term row ──────────────────────────────────────────────────────────────────

function renderTermRow(term, fromView) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'term-row';

  const main = document.createElement('span');
  main.className = 'term-row-main';

  const top = document.createElement('span');
  top.className = 'term-row-top';

  const nameEl = document.createElement('span');
  nameEl.className = 'term-row-name';
  nameEl.textContent = term.term;

  top.appendChild(nameEl);
  top.appendChild(makeTagBadge(term.tag));

  const defEl = document.createElement('span');
  defEl.className = 'term-row-def';
  defEl.textContent = truncate(term.definition, 60);

  main.appendChild(top);
  main.appendChild(defEl);
  btn.appendChild(main);
  btn.appendChild(makeChevron());

  btn.addEventListener('click', () => navigateTo(term.id, fromView));

  return btn;
}

// ── Navigation ────────────────────────────────────────────────────────────────

const _views = {};

function initViews() {
  ['search', 'browse', 'saved', 'today', 'result'].forEach(name => {
    _views[name] = document.getElementById('view-' + name);
  });
}

function showView(name) {
  Object.entries(_views).forEach(([k, el]) => {
    el.classList.toggle('hidden', k !== name);
  });

  const isResult = name === 'result';
  document.getElementById('header-brand').classList.toggle('hidden', isResult);
  document.getElementById('header-def').classList.toggle('hidden', !isResult);

  if (!isResult) {
    document.querySelectorAll('.tab').forEach(btn => {
      const active = btn.dataset.tab === name;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
  }
}

async function navigateTo(termId, fromView) {
  setView('result', termId, fromView);
  showView('result');
  renderDefinitionView(termId);
  await addToHistory(termId);
}

function navigateBack() {
  const rv = state.returnView || 'search';
  setView(rv);
  showView(rv);
  renderViewByName(rv);
}

function renderViewByName(name) {
  if (name === 'search') renderSearchView();
  else if (name === 'browse') renderBrowseView();
  else if (name === 'saved')  renderSavedView();
  else if (name === 'today')  renderTodayView();
}

// ── Search view ───────────────────────────────────────────────────────────────

function filterTerms(q) {
  const query = q.trim().toLowerCase();
  if (!query) return TERMS;
  return TERMS.filter(t =>
    t.term.toLowerCase().includes(query) ||
    t.definition.toLowerCase().includes(query) ||
    t.tag.includes(query)
  );
}

function renderSearchView() {
  const list  = document.getElementById('search-list');
  const empty = document.getElementById('search-empty');
  const results = [...filterTerms(state.query)].sort((a, b) =>
    a.term.localeCompare(b.term)
  );

  list.innerHTML = '';
  if (results.length === 0) {
    empty.classList.remove('hidden');
    list.classList.add('hidden');
  } else {
    empty.classList.add('hidden');
    list.classList.remove('hidden');
    results.forEach(t => list.appendChild(renderTermRow(t, 'search')));
  }
}

// ── Browse / Glossary view ────────────────────────────────────────────────────

function renderBrowseView() {
  const list = document.getElementById('browse-list');
  const meta = document.getElementById('browse-meta');
  list.innerHTML = '';
  meta.textContent = TERMS.length + ' terms · A–Z';
  [...TERMS]
    .sort((a, b) => a.term.localeCompare(b.term))
    .forEach(t => list.appendChild(renderTermRow(t, 'browse')));
}

// ── Saved view ────────────────────────────────────────────────────────────────

function renderSavedView() {
  const container = document.getElementById('saved-content');
  container.innerHTML = '';

  const savedTerms = state.saved.map(getTerm).filter(Boolean);
  const histTerms  = state.history.map(getTerm).filter(Boolean);

  if (savedTerms.length === 0 && histTerms.length === 0) {
    const div = document.createElement('div');
    div.className = 'empty-state';

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z');
    svg.appendChild(path);
    div.appendChild(svg);

    const heading = document.createElement('p');
    heading.className = 'empty-heading';
    heading.textContent = 'Nothing saved yet';
    const sub = document.createElement('p');
    sub.className = 'empty-sub';
    sub.textContent = 'Browse the glossary and bookmark terms to find them here.';
    div.appendChild(heading);
    div.appendChild(sub);
    container.appendChild(div);
    return;
  }

  if (savedTerms.length > 0) {
    const h = document.createElement('div');
    h.className = 'section-heading';
    h.textContent = 'Saved';
    container.appendChild(h);
    const list = document.createElement('div');
    list.className = 'term-list';
    savedTerms.forEach(t => list.appendChild(renderTermRow(t, 'saved')));
    container.appendChild(list);
  }

  if (histTerms.length > 0) {
    const h = document.createElement('div');
    h.className = 'section-heading';
    h.textContent = 'Recently looked up';
    container.appendChild(h);
    const list = document.createElement('div');
    list.className = 'term-list';
    histTerms.forEach(t => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'term-row term-row--history';

      const icon = makeHistoryIcon();
      const nameEl = document.createElement('span');
      nameEl.className = 'term-row-name';
      nameEl.textContent = t.term;
      const badge = makeTagBadge(t.tag);

      btn.appendChild(icon);
      btn.appendChild(nameEl);
      btn.appendChild(badge);
      btn.addEventListener('click', () => navigateTo(t.id, 'saved'));
      list.appendChild(btn);
    });
    container.appendChild(list);
  }
}

// ── Today view ────────────────────────────────────────────────────────────────

const TODAY_ID   = 'yak-shaving';
const EXPLORE_IDS = ['bikeshedding', 'blast-radius', 'rubber-ducking'];

function renderTodayView() {
  const container = document.getElementById('today-content');
  container.innerHTML = '';

  const todayTerm = getTerm(TODAY_ID);

  // Section label
  const label = document.createElement('div');
  label.className = 'today-section-label';
  label.textContent = 'Term of the day';
  container.appendChild(label);

  // Featured card
  if (!todayTerm) {
    const err = document.createElement('p');
    err.style.cssText = 'padding:20px;color:#9A968D;font-size:14px;';
    err.textContent = "Today's term is unavailable.";
    container.appendChild(err);
  } else {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'today-card--featured';

    const cardTag = makeTagBadge(todayTerm.tag, 'tag-badge--accent');
    const termEl = document.createElement('h2');
    termEl.className = 'today-term';
    termEl.textContent = todayTerm.term;
    const defEl = document.createElement('p');
    defEl.className = 'today-def';
    defEl.textContent = truncate(todayTerm.definition, 120);

    card.appendChild(cardTag);
    card.appendChild(termEl);
    card.appendChild(defEl);
    card.addEventListener('click', () => navigateTo(TODAY_ID, 'today'));
    container.appendChild(card);
  }

  // Explore section
  const exploreLabel = document.createElement('div');
  exploreLabel.className = 'explore-section-label';
  exploreLabel.textContent = 'More to explore';
  container.appendChild(exploreLabel);

  EXPLORE_IDS.forEach(id => {
    const term = getTerm(id);
    if (!term) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'explore-row';

    const nameEl = document.createElement('span');
    nameEl.className = 'explore-name';
    nameEl.textContent = term.term;

    btn.appendChild(nameEl);
    btn.appendChild(makeTagBadge(term.tag));
    btn.addEventListener('click', () => navigateTo(term.id, 'today'));
    container.appendChild(btn);
  });
}

// ── Definition view ───────────────────────────────────────────────────────────

let _currentDefTermId = null;

function updateBookmarkBtn(termId) {
  const btn = document.getElementById('bookmark-btn');
  const saved = isSaved(termId);
  btn.classList.toggle('bookmark--active', saved);
  btn.setAttribute('aria-label', saved ? 'Remove from saved' : 'Save term');
}

function renderDefinitionView(termId) {
  const term = getTerm(termId);
  const container = document.getElementById('result-content');
  container.innerHTML = '';
  _currentDefTermId = termId;

  if (!term) {
    console.error('[TechSpeak] term not found:', termId);
    const msg = document.createElement('p');
    msg.style.cssText = 'padding:20px;color:#9A968D;font-size:14px;';
    msg.textContent = 'Term not found.';
    container.appendChild(msg);
    return;
  }

  document.getElementById('def-header-title').textContent = term.term;
  updateBookmarkBtn(termId);

  // Meta (kind · pronunciation)
  const meta = document.createElement('div');
  meta.className = 'def-meta';
  meta.textContent = term.kind + (term.pron ? '   ·   ' + term.pron : '');

  // Term name
  const nameEl = document.createElement('h2');
  nameEl.className = 'def-term';
  nameEl.textContent = term.term;

  // Tag row
  const tagRow = document.createElement('div');
  tagRow.className = 'def-tag-row';
  tagRow.appendChild(makeTagBadge(term.tag, 'tag-badge--accent'));
  const phrase = document.createElement('span');
  phrase.className = 'def-tag-phrase';
  phrase.textContent = term.tagPhrase;
  tagRow.appendChild(phrase);

  // Definition
  const defEl = document.createElement('p');
  defEl.className = 'def-body';
  defEl.textContent = term.definition;

  // In the wild
  const wildLabel = document.createElement('div');
  wildLabel.className = 'wild-label';
  wildLabel.textContent = 'In the wild';

  const wildQuote = document.createElement('blockquote');
  wildQuote.className = 'wild-quote';
  wildQuote.appendChild(highlightTerm(term.inTheWild, term.term));

  container.appendChild(meta);
  container.appendChild(nameEl);
  container.appendChild(tagRow);
  container.appendChild(defEl);
  container.appendChild(wildLabel);
  container.appendChild(wildQuote);

  // Related chips
  const related = getRelated(term.related);
  if (related.length > 0) {
    const relLabel = document.createElement('div');
    relLabel.className = 'related-label';
    relLabel.textContent = 'Related';

    const chips = document.createElement('div');
    chips.className = 'chips';

    related.forEach(r => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = r.term;
      chip.addEventListener('click', () => {
        // Navigate chip-to-chip: preserve returnView
        _currentDefTermId = r.id;
        state.termId = r.id;
        document.getElementById('def-header-title').textContent = r.term;
        updateBookmarkBtn(r.id);
        renderDefinitionView(r.id);
        addToHistory(r.id);
      });
      chips.appendChild(chip);
    });

    container.appendChild(relLabel);
    container.appendChild(chips);
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  initViews();

  // Initial renders
  renderSearchView();
  renderBrowseView();
  renderSavedView();
  renderTodayView();

  // Context menu pending lookup — navigate directly if text was passed from selection
  let handledByLookup = false;
  try {
    const { pendingLookup } = await chrome.storage.local.get('pendingLookup');
    if (pendingLookup) {
      await chrome.storage.local.remove('pendingLookup');
      const match = findBestMatch(pendingLookup.trim());
      if (match) {
        await navigateTo(match.id, 'search');
        handledByLookup = true;
      } else {
        state.query = pendingLookup.trim();
        document.getElementById('search-input').value = state.query;
        renderSearchView();
      }
    }
  } catch (e) {
    console.error('[TechSpeak] pendingLookup:', e);
  }
  if (!handledByLookup) {
    showView('search');
    document.getElementById('search-input').focus();
  }

  // Tab bar
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.tab;
      setView(name);
      showView(name);
      renderViewByName(name);
      if (name === 'search') {
        document.getElementById('search-input').focus();
      }
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', e => {
    state.query = e.target.value;
    renderSearchView();
  });

  // Close buttons
  document.getElementById('close-btn').addEventListener('click', () => window.close());
  document.getElementById('close-btn-def').addEventListener('click', () => window.close());

  // Back button
  document.getElementById('back-btn').addEventListener('click', navigateBack);

  // Bookmark button
  document.getElementById('bookmark-btn').addEventListener('click', async () => {
    const termId = _currentDefTermId || state.termId;
    if (!termId) return;
    await toggleSave(termId);
    updateBookmarkBtn(termId);
  });
});
