chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// No UXSS vulnerability here.

chrome.storage.session.get(["user_name"]).then((result) => {
    let user_name = result.key;
    console.log("Service worker retrieved user name from extension storage: " + user_name);
});

chrome.storage.session.set({ "user_name": "Jane Doe" }).then(() => {
  console.log("User name value was set by service worker.");
});
