console.log('Content script running');

// An attack of type 4.3: Sensitive data should not be accesible via extension messages:
chrome.runtime.sendMessage({
    type: 'get-credentials',
    target: 'service-worker',
    data: ''
}, (response) => {
    console.log("Content script received sensitive data/credentials from service worker: ", response);
});
// Note that the content script does not actually have to make the above request in order for the renderer attack to be able to exploit this vector,
//   as long as there is at least *some* content script that's injected into the page.
