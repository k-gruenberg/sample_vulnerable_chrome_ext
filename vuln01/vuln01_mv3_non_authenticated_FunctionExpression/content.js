console.log('Content script running');

chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
  console.log("Content script received all cookies: ", response);
});
