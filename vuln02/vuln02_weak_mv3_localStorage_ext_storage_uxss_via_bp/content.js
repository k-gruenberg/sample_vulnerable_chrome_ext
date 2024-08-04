console.log('Content script running');

//  Webpage =====> CS =====> Extension storage =====> BP =====> Another webpage
// |__________________________________________|
//                  here

// This content script receives data from a webpage via the localStorage API.
// It then puts that data into the extension storage (non-sanitized).

// Check twice a second if the webpage has put anything into the localStorage:
const interval = setInterval(function() {
    if (localStorage.getItem("uname") !== null) { // https://stackoverflow.com/questions/3262605/how-to-check-whether-a-storage-item-is-set
        const uname = localStorage.getItem("uname");
        // Store the data on the extension storage (non-sanitized):
        chrome.storage.local.set({ "user_name": uname }).then(() => {
            console.log("User name value was set by content script to: " + uname);
        });
    }
}, 500);

// clearInterval(interval);
