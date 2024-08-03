chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Not doing anything relevant here.
// The service worker is accessing the extension storage, just like the content script.
// The actual UXSS vulnerability however lies in the content script and in the content script only.

chrome.storage.local.set({ "user_name": "John Doe" }).then(() => {
  console.log("User name value was set by service worker.");
});
