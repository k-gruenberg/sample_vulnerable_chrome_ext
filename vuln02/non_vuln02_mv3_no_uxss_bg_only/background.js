chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// No vulnerability here. Service worker *is* accessing extension storage but it is *not* accessing other sites/providing a UXSS vector.
// Notice that the manifest.json still contains the necessary "scripting" permission for that though!

chrome.storage.local.get(["user_name"]).then((result) => {
    let user_name = result["user_name"];
    console.log("Service worker retrieved user name from extension storage: " + user_name);
});
