console.log('Content script running');

//  Webpage =====> BP =====> Extension storage =====> CS ======> Another webpage
//                          |___________________________________________________|
//                                                   here

// The code below takes data out of the extension storage (which originally came from some website A), and puts it into another website B, unsanitized:

// Although this extension is vulnerable under the web attacker model, one could again see this as a violation of Kim and Lee's 
//     security requirement 3.2 (storing cross-site data on the extension storage).
// However, the vulnerability does not arise because the (renderer) attacker has direct write access to the extension storage but rather because the
//     (web) attacker has indirect write access to the extension storage through his communication with the service worker (see background.js file).

chrome.storage.local.get(["user_name"]).then((result) => {
	const user_name = result["user_name"];
    console.log("Retrieved user name from storage: " + user_name);
    const body = document.getElementsByTagName('body')[0];
    const new_span = document.createElement('span');
    new_span.innerHTML = 'Hello ' + user_name + '!'; // <== (UXSS) VULNERABILITY LIES HERE! No sanitization. new_span.innerText should be used instead!
    body.append(new_span);
});
