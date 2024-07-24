console.log('Content script running');

// In this example extension, the content script acts as a proxy (confused deputy) between a malicious website and the (highly privileged) service worker;
//  not directly via postMessages as in "vuln01_weak_mv3_postMessage" but this time more indirectly by listening to a (and also responding *via* a) DOM event:

// Listen for a specific DOM event: // cf. https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
var targetNode = document.getElementById('some-id'); // Select the node that will be observed for mutations
var config = { attributes: true, childList: true }; // Options for the observer (which mutations to observe)
// Callback function to execute when mutations are observed:
var callback = function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            console.log('DOM event: A child node has been added or removed.');
        }
        else if (mutation.type == 'attributes') {
            console.log('DOM event: The ' + mutation.attributeName + ' attribute was modified.');
            if (mutation.attributeName == "data-some-attr") {

                // The DOM mutation we're listening to happend, "respond" to it by *mutating* a DOM element such that
                //     it then contains sensitive data/information from the service worker:
                // Proxy the "DOM message" to the (highly privileged) service worker and "return" its result by mutating the DOM element:
                chrome.runtime.sendMessage({greeting: "hello"}, (response) => {
                  console.log("Content script received all cookies: ", response);

                  // Send a "DOM message" to the website:
                  targetNode.setAttribute("cookies", JSON.stringify(response));
                  // This would be, on the other hand, a postMessage: window.postMessage({ type: 'FROM_EXTENSION', payload: response }, '*');
                });

            }
        }
    }
};
var observer = new MutationObserver(callback); // Create an observer instance linked to the callback function
observer.observe(targetNode, config); // Start observing the target node for configured mutations
