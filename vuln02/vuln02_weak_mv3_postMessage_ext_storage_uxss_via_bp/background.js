chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

//  Webpage =====> CS =====> Extension storage =====> BP =====> Another webpage
//                          |__________________________________________________|
//                                                  here

// This service worker takes data from the extension storage and pastes it into webpages, non-sanitized.

chrome.storage.local.get(["user_name"]).then((result) => {
    const user_name = "" + result["user_name"];
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
                        new_span.innerHTML = 'Hello ' + uname + '!'; // <== (UXSS) VULNERABILITY LIES HERE! No sanitization. new_span.innerText should be used instead!
                        body.append(new_span);

                    },
                    args: [user_name] // => arguments passed to the above function
                });

            });

        }
    );
});
