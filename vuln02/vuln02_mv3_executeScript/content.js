console.log('Content script running');

// Not doing anything relevant here.
// The content script is accessing the extension storage, just like the service worker.
// The actual UXSS vulnerability however lies in the service worker and in the service worker only (.executeScript API).

chrome.storage.session.set({ "user_name": "John Doe" }).then(() => {
  console.log("User name value was set by content script.");
});
