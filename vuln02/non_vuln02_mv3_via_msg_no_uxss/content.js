console.log('Content script running');

// cf. /vuln02_mv3_via_msg_non_authenticated but here there isn't actually any UXSS danger:

chrome.runtime.sendMessage({user_name: "John Doe"}, (response) => {
    console.log('Respone: ' + response);
});
