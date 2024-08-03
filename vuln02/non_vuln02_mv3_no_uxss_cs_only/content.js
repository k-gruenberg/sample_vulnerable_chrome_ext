console.log('Content script running');

// No vulnerability here. Content script *is* accessing extension storage but it is *not* providing a UXSS vector.

chrome.storage.local.get(["user_name"]).then((result) => {
	const user_name = result.key;
    console.log("Retrieved user name from storage: " + user_name);
});
