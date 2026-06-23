'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'techspeak-lookup',
    title: 'Lookup with TechSpeak',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== 'techspeak-lookup') return;
  const text = (info.selectionText || '').trim();
  if (!text) return;
  await chrome.storage.local.set({ pendingLookup: text });
  await chrome.action.openPopup();
});
