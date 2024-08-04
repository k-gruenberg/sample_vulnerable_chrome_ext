chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

//  Webpage =====> BP =====> Extension storage =====> CS ======> Another webpage
// |__________________________________________|
//                  here

// The code below takes data received from a web page through the onMessageExternal interface and puts it into the extension storage, unsanitized:

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => { // <== VULNERABILITY LIES HERE! Sender of message is not checked/authenticated!
    let user_name = message["user_name"];
    console.log("Service worker received user name through a message from a web site (URL: " + sender.url + "): " + user_name);

    chrome.storage.local.set({ "user_name": user_name }).then(() => {
        console.log("User name value was set by service worker.");
    });

    sendResponse("ok");
});
