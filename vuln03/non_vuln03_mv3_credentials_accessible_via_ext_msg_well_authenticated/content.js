console.log('Content script running');

// The retrieval below will *only* work for the content script injected into "https://www.google.com/" (*exactly* that URL), therefore no vulnerability:
chrome.runtime.sendMessage({
    type: 'get-credentials',
    target: 'service-worker',
    data: ''
}, (response) => {
    console.log("Content script received sensitive data/credentials from service worker: ", response);
});
