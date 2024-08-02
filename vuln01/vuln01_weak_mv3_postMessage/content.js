console.log('Content script running');

// In this example extension, the content script acts as a proxy (confused deputy) between a malicious website and the (highly privileged) service worker:

// Listen for messages from the website:
window.addEventListener('message', function(event) {
    if (event.source !== window) {
        return; // Ignore messages not from the window
    }

    if (event.data && event.data.type === 'FROM_PAGE') {
        console.log('Received message from the page: ', event.data.payload);

        // Handle the message from the web page:
        // Proxy the message/request to the (highly privileged) service worker and return its result:
        chrome.runtime.sendMessage({greeting: "hello"}, (response) => {
          console.log("Content script received all cookies: ", response);

          // Send a message to the website:
          window.postMessage({ type: 'FROM_EXTENSION', payload: response }, '*');
        });
    }
}, false);
