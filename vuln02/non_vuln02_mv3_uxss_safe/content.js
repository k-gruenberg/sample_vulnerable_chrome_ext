console.log('Content script running');

// This content script creates a vector for UXSS by violating security requirement 3.2 (storing cross-site data on the extension storage).
// It takes a value out of the extension storage and pastes it into *every* web page, unsanitized:

chrome.storage.local.get(["user_name"]).then((result) => {
	const user_name = result["user_name"];
    console.log("Retrieved user name from storage: " + user_name);
    const body = document.getElementsByTagName('body')[0];
    const new_span = document.createElement('span');
    new_span.innerHTML = 'Hello ' + user_name.replace(/\W/g,"") + '!'; // <== CORRECT SANITIZATION
    body.append(new_span);
});
