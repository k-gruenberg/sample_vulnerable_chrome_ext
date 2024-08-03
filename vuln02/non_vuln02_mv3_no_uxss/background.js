chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// No UXSS vulnerability here.

chrome.storage.local.get(["user_name"]).then((result) => {
    let user_name = result["user_name"];
    console.log("Service worker retrieved user name from extension storage: " + user_name);
});

chrome.storage.local.set({ "user_name": "Jane Doe" }).then(() => {
  console.log("User name value was set by service worker.");
});
