chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// This service worker creates a vector for UXSS by violating security requirement 3.1 (not authenticating messages coming from a content script).
// This results in a vulnerability of type 4.2:
//     Service worker behavior is modifiable by the content script.
// Note that the extension storage is *not* involved in any way here!

// More precisely, this service worker takes a value out of a message received from a CS and pastes it into other websites, unsanitized, resulting in UXSS:

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { // <== VULNERABILITY LIES HERE! Sender of message is not checked/authenticated!
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
                        new_span.innerHTML = 'Hello ' + uname + '!'; // <== VULNERABILITY LIES HERE! new_span.innerText should be used instead!
                        body.append(new_span);

                    },
                    args: [user_name] // => arguments passed to the above function
                });

            });

        }
    );

    sendResponse("ok");
});
