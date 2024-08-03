console.log('Content script running');

// No UXSS vulnerability here.

chrome.storage.local.get(["user_name"]).then((result) => {
    let user_name = result.key;
    console.log("Content script retrieved user name from extension storage: " + user_name);
});

chrome.storage.local.set({ "user_name": "John Doe" }).then(() => {
  console.log("User name value was set by content script.");
});
