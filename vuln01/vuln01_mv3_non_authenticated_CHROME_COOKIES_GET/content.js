console.log('Content script running');

chrome.runtime.sendMessage({greeting: "hello"}, (response) => {
  console.log("Content script received cookie: ", response);
});
