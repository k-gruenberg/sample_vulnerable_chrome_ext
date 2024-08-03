chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { // <== 3.1 violation here (msg from CS is not authenticated) but still no UXSS possible due to sanitization below:
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
                        new_span.innerHTML = 'Hello ' + uname.replace(/\W/g,"") + '!'; // <== CORRECT SANITIZATION
                        /* (Note that it would probably be smarter to use .innerText in practice but that would be a non-dangerous sink in the first place
                            and the purpose of this sample extension is to see if a tool can correctly detect sanitization functions along a data flow.) */
                        body.append(new_span);

                    },
                    args: [user_name] // => arguments passed to the above function
                });

            });

        }
    );

    sendResponse("ok");
});
