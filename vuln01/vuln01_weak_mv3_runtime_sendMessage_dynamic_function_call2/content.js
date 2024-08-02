console.log('Content script running');

// The content script isn't doing anything in this example.
// The vulnerable communication is directly between the website and service worker!
//   (via chrome.runtime.onMessageExternal.addListener() on the side of the service worker)
