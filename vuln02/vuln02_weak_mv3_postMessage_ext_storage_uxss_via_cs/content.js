console.log('Content script running');

//  Webpage =====> CS =====> Extension storage =====> CS =====> Another webpage
// |__________________________________________|
//                  part (A)
//                          |__________________________________________________|
//                                              part (B)

// (A):
// This content script receives data from a webpage via the postMessage API (non-authenticated).
// It then puts that data into the extension storage (non-sanitized).

// (B):
// Simultaneously, another part of this content script takes this very data from the extension storage
//     and puts it into *other* webpages, creating the UXSS vector.

// Although this extension is vulnerable under a simple web attacker model only, only could still see this as a violation of Kim and Lee's
//     security requirement 3.2 (storing cross-site data on the extension storage).

// (A):
// Listen for messages from the website (note that there's no data leakage in the response; we have a UXSS vulnerability here because the *request*
//     data is stored and later re-used but never sanitized):
window.addEventListener('message', function(event) { // TODO
    if (event.source !== window) {
        return; // Ignore messages not from the window
    }

    if (event.data && event.data.type === 'FROM_PAGE') {
        console.log('Received message from the page: ', event.data.payload);

        // Store the received message on the extension storage:
        chrome.storage.local.set({ "user_name": event.data.payload }).then(() => {
            console.log("User name value was set by content script.");
        });
    }
}, false);


// (B):
chrome.storage.local.get(["user_name"]).then((result) => {
	const user_name = result["user_name"];
    console.log("Retrieved user name from storage: " + user_name);
    const body = document.getElementsByTagName('body')[0];
    const new_span = document.createElement('span');
    new_span.innerHTML = 'Hello ' + user_name + '!'; // <== (UXSS) VULNERABILITY LIES HERE! No sanitization. new_span.innerText should be used instead!
    body.append(new_span);
});
