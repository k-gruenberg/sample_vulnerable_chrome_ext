console.log('Content script running');

// This message will only be accepted if coming from the correct URL ("https://www.google.com/"), cf. /background.js:
chrome.runtime.sendMessage({user_name: "John Doe"}, (response) => {
    console.log('Respone: ' + response);
});
