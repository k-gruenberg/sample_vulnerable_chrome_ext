console.log('Content script running');

//  Webpage =====> CS =====> Extension storage =====> BP =====> Another webpage
// |__________________________________________|
//                  here

// This content script receives data from a webpage via the postMessage API (non-authenticated).
// It then puts that data into the extension storage (non-sanitized).

window.addEventListener('message', function(event) {
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
