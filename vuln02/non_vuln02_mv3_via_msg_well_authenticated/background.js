chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// cf. /vuln02_mv3_via_msg_ill_authenticated, only that the authentication here is done *correctly*:

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.url === "https://www.google.com/") { // <== CORRECT AUTHENTICATION (no 3.1 violation)
        let user_name = message["user_name"];
        console.log("Service worker received user name through a message from a content script: " + user_name);

        chrome.tabs.query({}, // empty query => returns all tabs (active and inactive) of all windows
            (tabs) => { // => callback function

                // In each open tab...
                tabs.forEach((tab) => {

                    // ...execute a script...
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: (uname) => { // => "This function will be serialized, and then deserialized for injection." (https://developer.chrome.com/docs/)
                            
                            // ...pasting the user name value from the extension message into the content/DOM of the tab, unsanitized:
                            const body = document.getElementsByTagName('body')[0];
                            const new_span = document.createElement('span');
                            new_span.innerHTML = 'Hello ' + uname + '!'; // <== Possible UXSS vector here, though not exploitable by a renderer attacker due to authentication above!
                            body.append(new_span);

                        },
                        args: [user_name] // => arguments passed to the above function
                    });

                });

            }
        );

        sendResponse("ok");
    } else {
        sendResponse("auth failed");
    }
});
