console.log('Content script running');

//  Webpage =====> CS =====> Extension storage =====> BP =====> Another webpage
// |__________________________________________|
//                  here

// This content script receives data from a webpage via the DOM.
// It then puts that data into the extension storage (non-sanitized).

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

                // The DOM mutation we're listening to happend, read out the data and put it into the extension storage (non-sanitized):
                chrome.storage.local.set({ "user_name": targetNode.getAttribute("data-some-attr") }).then(() => {
                    console.log("User name value was set by content script.");
                });

            }
        }
    }
};
var observer = new MutationObserver(callback); // Create an observer instance linked to the callback function
observer.observe(targetNode, config); // Start observing the target node for configured mutations
