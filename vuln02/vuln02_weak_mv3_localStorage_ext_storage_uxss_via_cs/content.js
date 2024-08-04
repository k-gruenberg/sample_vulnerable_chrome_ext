console.log('Content script running');

//  Webpage =====> CS =====> Extension storage =====> CS =====> Another webpage
// |__________________________________________|
//                  part (A)
//                          |__________________________________________________|
//                                              part (B)

// (A):
// This content script receives data from a webpage via the localStorage API.
// It then puts that data into the extension storage (non-sanitized).

// (B):
// Simultaneously, another part of this content script takes this very data from the extension storage
//     and puts it into *other* webpages, creating the UXSS vector.

// Although this extension is vulnerable under a simple web attacker model only, only could still see this as a violation of Kim and Lee's
//     security requirement 3.2 (storing cross-site data on the extension storage).

// (A):
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


// (B):
chrome.storage.local.get(["user_name"]).then((result) => {
	const user_name = result["user_name"];
    console.log("Retrieved user name from storage: " + user_name);
    const body = document.getElementsByTagName('body')[0];
    const new_span = document.createElement('span');
    new_span.innerHTML = 'Hello ' + user_name + '!'; // <== (UXSS) VULNERABILITY LIES HERE! No sanitization. new_span.innerText should be used instead!
    body.append(new_span);
});
