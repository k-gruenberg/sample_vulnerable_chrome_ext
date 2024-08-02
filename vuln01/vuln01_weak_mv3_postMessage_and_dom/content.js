console.log('Content script running');

// In this example extension, the content script acts as a proxy (confused deputy) between a malicious website and the (highly privileged) service worker;
//  not *just* directly via postMessages as in "vuln01_weak_mv3_postMessage" but also more indirectly by *responding* by updating the DOM(!):

// Listen for messages from the website:
window.addEventListener('message', function(event) {
    if (event.source !== window) {
        return; // Ignore messages not from the window
    }

    if (event.data && event.data.type === 'FROM_PAGE') {
        console.log('Received message from the page: ', event.data.payload);

        // Handle the message from the web page:
        // Proxy the message/request to the (highly privileged) service worker and return its result (but via the DOM and *not* via a postMessage!):
        chrome.runtime.sendMessage({greeting: "hello"}, (response) => {
          console.log("Content script received all cookies: ", response);

          // Send a "DOM message" to the website:
          var targetNode = document.getElementById('some-id2');
          targetNode.setAttribute("cookies", JSON.stringify(response));
          // This would be answering via a regular postMessage: window.postMessage({ type: 'FROM_EXTENSION', payload: response }, '*');
        });
    }
}, false);
