console.log('Content script running');

chrome.runtime.sendMessage({user_name: "John Doe"}, (response) => {
    console.log('Respone: ' + response);
});
