console.log('Content script running');

// Note that the behavior below is harmless; a renderer attacker however can impersonate this content script
// and send "<script>alert('UXSS')</script>" as the user name for example.

chrome.runtime.sendMessage({user_name: "John Doe"}, (response) => {
    console.log('Respone: ' + response);
});
