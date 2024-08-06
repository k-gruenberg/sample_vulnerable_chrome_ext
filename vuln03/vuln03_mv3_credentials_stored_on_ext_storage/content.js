console.log('Content script running');

// An attack of type 4.3: Sensitive data should not be stored on the extension storage, *any* content script may access it then:
chrome.storage.local.get(["pw"]).then((result) => {
    console.log("Content script has access to password: " + result["pw"]);
});
