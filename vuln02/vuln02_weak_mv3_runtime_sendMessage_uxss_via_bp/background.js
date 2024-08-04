chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// cf. /vuln02_mv3_via_msg_non_authenticated, only that the service worker here isn't receiving the message from a content script but directly from a web page;
// meaning that the attacker model here is that of a simple web attacker, no renderer attacker required!

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => { // <== VULNERABILITY LIES HERE! Sender of message is not checked/authenticated!
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
                        new_span.innerHTML = 'Hello ' + uname + '!'; // <== VULNERABILITY LIES HERE! No sanitization. new_span.innerText should be used instead!
                        body.append(new_span);

                    },
                    args: [user_name] // => arguments passed to the above function
                });

            });

        }
    );

    sendResponse("ok");
});
