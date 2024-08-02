console.log('Content script running');

// In this example extension, the content script acts as a proxy (confused deputy) between a malicious website and the (highly privileged) service worker;
//     communication between content script and webpage is done via localStorage (and via localStorage only).

// Check twice a second if the webpage has put anything into the localStorage:
const interval = setInterval(function() {
    if (localStorage.getItem("cookies") == "please") {
        chrome.runtime.sendMessage({greeting: "hello"}, (response) => {
          console.log("Content script received all cookies: ", response);

          // "Respond" to the website via localStorage:
          localStorage.setItem("cookies", JSON.stringify(response));
        });
    }
}, 500);

// clearInterval(interval);
