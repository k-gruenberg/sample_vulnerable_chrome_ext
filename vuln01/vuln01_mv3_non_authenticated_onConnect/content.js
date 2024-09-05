console.log('Content script running');

// cf. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect#examples:

let myPort = chrome.runtime.connect({ name: "port-from-cs" });
// myPort.postMessage({ greeting: "hello from content script" });

myPort.onMessage.addListener((m) => {
  console.log("In content script, received message from background script: ");
  console.log(m);
});
