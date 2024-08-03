chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// This service worker creates a vector for UXSS by violating security requirement 3.2 (storing cross-site data on the extension storage).
// This results in a vulnerability of type 4.2:
//     Configurations affecting service worker behavior are modifiable by the content script (which has access to the extension storage).

// More precisely, this service worker takes a value out of the extension storage and pastes it into other websites, unsanitized, resulting in UXSS:

chrome.storage.local.get(["user_name"]).then((result) => {
    let user_name = "" + result["user_name"];
    console.log("Service worker retrieved user name from extension storage: " + user_name);

    chrome.tabs.query({}, // empty query => returns all tabs (active and inactive) of all windows
        (tabs) => { // => callback function

            // In each open tab...
            tabs.forEach((tab) => {

                // ...execute a script...
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (uname) => { // => "This function will be serialized, and then deserialized for injection." (https://developer.chrome.com/docs/)
                        
                        // ...pasting the user name value from the extension storage into the content/DOM of the tab, unsanitized:
                        const body = document.getElementsByTagName('body')[0];
                        const new_span = document.createElement('span');
                        new_span.innerHTML = 'Hello ' + uname.replace(/\W/g,"") + '!'; // <== CORRECT SANITIZATION
                        /* (Note that it would probably be smarter to use .innerText in practice but that would be a non-dangerous (UXSS) sink in the first place
                            and the purpose of this sample extension is to see if a tool can correctly detect sanitization functions along a data flow.) */
                        body.append(new_span);

                    },
                    args: [user_name] // => arguments passed to the above function
                });

            });

        }
    );
});
